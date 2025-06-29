import { FastifyInstance } from "fastify";
import { SalesController } from "./salesOrders.controller";

export async function salesRoutes(f: FastifyInstance) {
    f.post("/counter-order", SalesController.counterSaleOrder);
    f.post("/order", SalesController.saleOrder);
    f.post("/shipped", SalesController.shipmentOrder);
}
