import { PrismaClient } from "../../../../prisma/src/database/client";

const prisma = new PrismaClient();

export type ShipmentCreateInput = {
    orderNumber: string;
    trackingNumber?: string;
    carrier?: string;
};

export class ShipmentService {
    static async create(data: ShipmentCreateInput) {
        return prisma.$transaction(async (tx) => {
            const salesOrder = await tx.sales_orders.findUnique({
                where: { order_number: data.orderNumber },
                include: { sales_order_items: true },
            });

            if (!salesOrder || salesOrder.status !== "processing") {
                throw new Error(
                    "Pedido de Venda inválido ou não está aguardando envio."
                );
            }

            const shipment = await tx.shipments.create({
                data: {
                    shipment_number: `SHP-${Date.now()}`,
                    sales_order_id: salesOrder.id,
                    location_id: salesOrder.location_id,
                    customer_id: salesOrder.customer_id,
                    status: "shipped",
                    shipment_date: new Date(),
                    tracking_number: data.trackingNumber,
                    carrier: data.carrier,
                },
            });

            for (const item of salesOrder.sales_order_items) {
                await tx.shipment_items.create({
                    data: {
                        shipment_id: shipment.id,
                        sales_order_item_id: item.id,
                        product_id: item.product_id,
                        quantity: item.quantity,
                    },
                });

                await tx.inventory.update({
                    where: {
                        product_id_location_id: {
                            product_id: item.product_id,
                            location_id: salesOrder.location_id,
                        },
                    },
                    data: {
                        quantity: {
                            decrement: item.quantity,
                        },
                        reserved_quantity: {
                            decrement: item.quantity,
                        },
                    },
                });
            }

            await tx.sales_orders.update({
                where: { id: salesOrder.id },
                data: { status: "shipped" },
            });

            return shipment;
        });
    }
}
