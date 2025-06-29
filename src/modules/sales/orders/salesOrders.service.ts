import { PrismaClient } from "../../../../prisma/src/database/client";

export type CounterSaleInput = {
    customerId: number;
    locationId: number;
    items: Array<{
        productId: number;
        quantity: number;
        unitPrice: number;
    }>;
};

const prisma = new PrismaClient();

export class SalesService {
    static async create(data: CounterSaleInput) {
        return prisma.$transaction(async (tx) => {
            for (const item of data.items) {
                const inventory = await tx.inventory.findUnique({
                    where: {
                        product_id_location_id: {
                            product_id: item.productId,
                            location_id: data.locationId,
                        },
                    },
                });

                if (
                    !inventory ||
                    Number(inventory.available_quantity) < item.quantity
                ) {
                    throw new Error(
                        `Estoque indisponível para o produto ID ${item.productId}.`
                    );
                }

                await tx.inventory.update({
                    where: {
                        product_id_location_id: {
                            product_id: item.productId,
                            location_id: data.locationId,
                        },
                    },
                    data: {
                        reserved_quantity: {
                            increment: item.quantity,
                        },
                    },
                });
            }

            const totalAmount = data.items.reduce(
                (sum, item) => sum + item.quantity * item.unitPrice,
                0
            );

            const salesOrder = await tx.sales_orders.create({
                data: {
                    order_number: `SO-${Date.now()}`,
                    customer_id: data.customerId,
                    location_id: data.locationId,
                    status: "processing",
                    order_date: new Date(),
                    total_amount: totalAmount,
                },
            });

            await Promise.all(
                data.items.map((item) =>
                    tx.sales_order_items.create({
                        data: {
                            sales_order_id: salesOrder.id,
                            product_id: item.productId,
                            quantity: item.quantity,
                            unit_price: item.unitPrice,
                        },
                    })
                )
            );

            return salesOrder;
        });
    }

    static async createCounterSale(data: CounterSaleInput) {
        return prisma.$transaction(async (tx) => {
            const totalAmount = data.items.reduce(
                (sum, item) => sum + item.quantity * item.unitPrice,
                0
            );

            const salesOrder = await tx.sales_orders.create({
                data: {
                    order_number: `BALCAO-${Date.now()}`,
                    customer_id: data.customerId,
                    location_id: data.locationId,
                    status: "delivered",
                    order_date: new Date(),
                    total_amount: totalAmount,
                },
            });

            const shipment = await tx.shipments.create({
                data: {
                    shipment_number: `ENV-BALCAO-${Date.now()}`,
                    sales_order_id: salesOrder.id,
                    customer_id: data.customerId,
                    location_id: data.locationId,
                    status: "delivered",
                    shipment_date: new Date(),
                },
            });

            for (const item of data.items) {
                const [salesOrderItem] = await Promise.all([
                    tx.sales_order_items.create({
                        data: {
                            sales_order_id: salesOrder.id,
                            product_id: item.productId,
                            quantity: item.quantity,
                            unit_price: item.unitPrice,
                        },
                    }),
                ]);
                await Promise.all([
                    tx.shipment_items.create({
                        data: {
                            shipment_id: shipment.id,
                            sales_order_item_id: salesOrderItem.id,
                            product_id: item.productId,
                            quantity: item.quantity,
                        },
                    }),
                ]);
                const [updatedInventory] = await Promise.all([
                    tx.inventory.update({
                        where: {
                            product_id_location_id: {
                                product_id: item.productId,
                                location_id: data.locationId,
                            },
                        },
                        data: {
                            quantity: {
                                decrement: item.quantity,
                            },
                        },
                    }),
                ]);

                if (updatedInventory.quantity.lt(0)) {
                    throw new Error(
                        `Venda de balcão falhou. Estoque insuficiente para o produto ID ${item.productId}.`
                    );
                }
            }

            return salesOrder;
        });
    }
}
