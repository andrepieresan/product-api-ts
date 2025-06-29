import { FastifyReply } from "fastify/types/reply";
import { PrismaClient } from "../../../../prisma/src/database/client";
import { FastifyRequest } from "fastify/types/request";

const prisma = new PrismaClient();

type GoodsReceiptItemInput = {
    productId: number;
    quantity: number;
    purchaseOrderItemId?: number;
    batchId?: number;
};

type PurchaseReturnItemInput = {
    productId: number;
    quantity: number;
    notes?: string | null;
};

export type PurchaseReturnCreateInput = {
    supplierId: number;
    locationId: number;
    returnDate: Date;
    goodsReceiptId?: number | null;
    reason?: string | null;
    items: PurchaseReturnItemInput[];
    // O 'createdBy' viria do usuário autenticado na requisição
    createdById?: number;
};

export type GoodsReceiptInput = {
    purchaseOrderId: number;
    supplierId: number;
    locationId: number;
    receiptDate: Date;
    notes?: string | null;
    items: GoodsReceiptItemInput[];
};

export class GoodsReceiptService {
    static async create(data: GoodsReceiptInput) {
        try {
            let {
                purchaseOrderId,
                supplierId,
                locationId,
                receiptDate,
                notes,
                items,
            } = data;
            return prisma.$transaction(async (tx) => {
                const goodsReceipt = await tx.goods_receipts.create({
                    data: {
                        receipt_number: `GR-${Date.now()}`,
                        purchase_order_id: purchaseOrderId,
                        supplier_id: supplierId,
                        location_id: locationId,
                        receipt_date: new Date(receiptDate),
                        status: "received",
                        notes: notes,
                    },
                });

                for (const item of items) {
                    await tx.goods_receipt_items.create({
                        data: {
                            goods_receipt_id: goodsReceipt.id,
                            product_id: item.productId,
                            quantity: item.quantity,
                            purchase_order_item_id: item.purchaseOrderItemId,
                            batch_id: item.batchId,
                        },
                    });

                    await tx.inventory.upsert({
                        where: {
                            product_id_location_id: {
                                product_id: item.productId,
                                location_id: locationId,
                            },
                        },
                        update: {
                            quantity: {
                                increment: item.quantity,
                            },
                        },
                        create: {
                            product_id: item.productId,
                            location_id: locationId,
                            quantity: item.quantity,
                            reserved_quantity: 0,
                        },
                    });

                    if (item.purchaseOrderItemId) {
                        await tx.purchase_order_items.update({
                            where: { id: item.purchaseOrderItemId },
                            data: {
                                received_quantity: {
                                    increment: item.quantity,
                                },
                            },
                        });
                    }
                }
                return goodsReceipt;
            });
        } catch (e) {
            if (e instanceof Error) {
                console.log(e.stack);
            } else {
                console.log(e);
            }
        }
    }

    static async updateOrderQuantity(po_number: string) {
        try {
            return await prisma.$transaction(async (tx) => {
                let purchaseOrder = await tx.purchase_orders.findUnique({
                    where: {
                        po_number,
                    },
                });
                if (purchaseOrder) {
                    const purchaseOrderItems =
                        await tx.purchase_order_items.findMany({
                            where: {
                                purchase_order_id: purchaseOrder.id,
                            },
                        });

                    const isFullyReceived = purchaseOrderItems.every(
                        ({ received_quantity, quantity }) =>
                            received_quantity >= quantity
                    );

                    if (!isFullyReceived) {
                        await tx.purchase_orders.update({
                            where: {
                                id: purchaseOrder.id,
                            },
                            data: {
                                status: "partially_received",
                            },
                        });
                    }

                    if (isFullyReceived) {
                        await tx.purchase_orders.update({
                            where: {
                                id: purchaseOrder.id,
                            },
                            data: {
                                status: "received",
                            },
                        });
                    }

                    purchaseOrder = await tx.purchase_orders.findUnique({
                        where: {
                            id: purchaseOrder.id,
                        },
                    });
                    return purchaseOrder;
                }
                if (!purchaseOrder) return false;
            });
        } catch (e) {}
    }

    static async createReturn(data: PurchaseReturnCreateInput) {
        return prisma.$transaction(async (tx) => {
            const purchaseReturn = await tx.purchase_returns.create({
                data: {
                    return_number: `PR-${Date.now()}`,
                    supplier_id: data.supplierId,
                    location_id: data.locationId,
                    goods_receipt_id: data.goodsReceiptId,
                    status: "confirmed",
                    return_date: new Date(data.returnDate),
                    reason: data.reason,
                    created_by: data.createdById,
                },
            });

            data.items.map((item) => {
                return tx.purchase_return_items.create({
                    data: {
                        purchase_return_id: purchaseReturn.id,
                        product_id: item.productId,
                        quantity: item.quantity,
                        notes: item.notes,
                    },
                });
            });

            return tx.purchase_returns.findUnique({
                where: { id: purchaseReturn.id },
                include: {
                    purchase_return_items: true,
                },
            });
        });
    }

    static async finalizeReturn(return_number: string) {
        console.log(return_number);
        return prisma.$transaction(async (tx) => {
            const purchaseReturn = await tx.purchase_returns.findUnique({
                where: { return_number },
                include: { purchase_return_items: true },
            });
            if (!purchaseReturn) {
                throw new Error(
                    "Devolução não encontrada ou não está em status para ser finalizada."
                );
            }

            const updatedInventories = [];

            for (const item of purchaseReturn.purchase_return_items) {
                const updatedInventory = await tx.inventory.update({
                    where: {
                        product_id_location_id: {
                            product_id: item.product_id,
                            location_id: purchaseReturn.location_id,
                        },
                    },
                    data: {
                        quantity: {
                            decrement: item.quantity,
                        },
                    },
                });

                updatedInventories.push(updatedInventory);

                await tx.inventory_movements.create({
                    data: {
                        product_id: item.product_id,
                        from_location_id: purchaseReturn.location_id,
                        to_location_id: purchaseReturn.supplier_id,
                        quantity: item.quantity,
                        movement_type: "return_out",
                        reference_type: "purchase_return_items",
                        reference_id: item.id,
                    },
                });
            }

            const finalReturn = await tx.purchase_returns.update({
                where: { return_number },
                data: { status: "completed" },
            });

            return { finalReturn, updatedInventories };
        });
    }
}
