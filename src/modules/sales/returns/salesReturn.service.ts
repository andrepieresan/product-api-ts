import { PrismaClient } from "../../../../prisma/src/database/client";

const prisma = new PrismaClient();

export type SalesReturnItemInput = {
    productId: number;
    quantity: number;
    notes?: string | null;
};

export type SalesReturnCreateInput = {
    salesOrderId?: number | null;
    customerId: number;
    locationId: number;
    returnDate: Date;
    reason?: string | null;
    items: SalesReturnItemInput[];
    createdById?: number;
};

export class SalesReturnService {
    static async create(data: SalesReturnCreateInput) {
        return prisma.$transaction(async (tx) => {
            const salesReturn = await tx.sales_returns.create({
                data: {
                    return_number: `SR-${Date.now()}`,
                    sales_order_id: data.salesOrderId,
                    customer_id: data.customerId,
                    location_id: data.locationId,
                    return_date: new Date(data.returnDate),
                    status: "confirmed",
                    reason: data.reason,
                    created_by: data.createdById,
                },
            });

            for (const item of data.items) {
                await tx.sales_return_items.create({
                    data: {
                        sales_return_id: salesReturn.id,
                        product_id: item.productId,
                        quantity: item.quantity,
                        notes: item.notes,
                    },
                });
            }

            return tx.sales_returns.findUnique({
                where: { id: salesReturn.id },
                include: {
                    sales_return_items: true,
                },
            });
        });
    }

    static async finalize(returnNumber: string) {
        return prisma.$transaction(async (tx) => {
            const salesReturn = await tx.sales_returns.findUnique({
                where: { return_number: returnNumber },
                include: { sales_return_items: true },
            });

            if (!salesReturn || salesReturn.status !== "confirmed") {
                throw new Error(
                    "Devolução de venda não encontrada ou não está com o status 'confirmed'."
                );
            }

            for (const item of salesReturn.sales_return_items) {
                await tx.inventory.update({
                    where: {
                        product_id_location_id: {
                            product_id: item.product_id,
                            location_id: salesReturn.location_id,
                        },
                    },
                    data: {
                        quantity: {
                            increment: item.quantity,
                        },
                    },
                });

                await tx.inventory_movements.create({
                    data: {
                        product_id: item.product_id,
                        to_location_id: salesReturn.location_id,
                        quantity: item.quantity,
                        movement_type: "return_in",
                        reference_type: "sales_return_items",
                        reference_id: item.id,
                        created_by: salesReturn.created_by,
                    },
                });
            }

            return tx.sales_returns.update({
                where: { id: salesReturn.id },
                data: { status: "completed" },
            });
        });
    }
}