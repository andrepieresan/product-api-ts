import { FastifyReply } from "fastify/types/reply";
import { PrismaClient } from "../../../../prisma/src/database/client";
import { FastifyRequest } from "fastify/types/request";

const prisma = new PrismaClient();

type PurchaseOrderItemType = {
    productId: number;
    quantity: number;
    unitPrice: string;
};

type PurchaseOrderType = {
    id: number;
    po_number: string;
    supplier_id: number;
    location_id: number;
    status: string;
    order_date: Date;
    expected_delivery_date?: Date | null;
    total_amount: string;
    currency: string;
    payment_terms?: string | null;
    shipping_terms?: string | null;
    notes?: string | null;
    created_at: Date;
    updated_at: Date;
    created_by?: number | null;
    approved_by?: number | null;
    items: PurchaseOrderItemType[];
};

export class PurchaseOrdersController {
    static async createPurchaseOrder(
        request: FastifyRequest<{
            Body: PurchaseOrderType;
        }>,
        reply: FastifyReply
    ) {
        const {
            supplier_id,
            order_date,
            items,
            location_id,
            created_by,
            expected_delivery_date,
        } = request.body;
        const totalAmount = items.reduce(
            (sum, item) => sum + item.quantity * parseFloat(item.unitPrice),
            0
        );
        return await prisma.$transaction(async (tx) => {
            const purchaseOrder = await tx.purchase_orders.create({
                data: {
                    supplier_id,
                    order_date: new Date(order_date).toISOString(),
                    po_number: "PO-" + Date.now(),
                    location_id,
                    created_by,
                    expected_delivery_date: expected_delivery_date
                        ? new Date(expected_delivery_date).toISOString()
                        : null,
                    total_amount: totalAmount.toString(),
                },
            });

            const itemsData = items.map((i) => ({
                purchase_order_id: purchaseOrder.id,
                product_id: i.productId,
                quantity: i.quantity,
                unit_price: i.unitPrice,
            }));

            await tx.purchase_order_items.createMany({
                data: itemsData,
            });

            return purchaseOrder;
        });
    }
}
