import { FastifyInstance } from "fastify";
import { PurchaseOrdersController } from "./purchaseOrders.controller";

export async function purchaseOrdersRoutes(f: FastifyInstance) {
    f.post("", PurchaseOrdersController.createPurchaseOrder);
}
