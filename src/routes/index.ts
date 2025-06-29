import { FastifyInstance } from "fastify";
import { productRoutes } from "../modules/products/products.route";
import { userRoutes } from "../modules/users/users.route";
import { suppliersRoutes } from "../modules/suppliers/suppliers.route";
import { purchaseOrdersRoutes } from "../modules/purchases/orders/purchaseOrders.route";
import { goodsReceiptsRoutes } from "@src/modules/purchases/receipts/goodsReceipts.route";
import { salesRoutes } from "@src/modules/sales/orders/salesOrders.route";

async function routes(f: FastifyInstance) {
    f.get("/", (req, resp) =>
        resp.status(200).type("text/plain").send("TCHAN! ")
    );
    f.register(productRoutes, { prefix: "/products" });
    f.register(userRoutes, { prefix: "/users" });
    f.register(suppliersRoutes, { prefix: "/suppliers" });
    f.register(purchaseOrdersRoutes, { prefix: "/purchase-order" });
    f.register(goodsReceiptsRoutes, { prefix: "/purchases" });
    f.register(salesRoutes, { prefix: "/sales" });
}

export default routes;
