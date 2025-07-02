import { FastifyInstance } from "fastify";
import { SalesController } from "./salesOrders.controller";
import { SalesReturnController } from "../returns/salesReturn.controller";

export async function salesRoutes(f: FastifyInstance) {
    f.post("/counter-order", SalesController.counterSaleOrder);
    f.post("/order", SalesController.saleOrder);
    f.post("/shipped", SalesController.shipmentOrder);
    f.post("/returns", SalesReturnController.create);
    f.put("/returns/:returnNumber/finalize", SalesReturnController.finalize);
}
