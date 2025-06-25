import { FastifyInstance } from "fastify";
import { productRoutes } from "../modules/products/products.route";
import { userRoutes } from "../modules/users/users.route";
import { suppliersRoutes } from "../modules/suppliers/suppliers.route";
import { purchaseOrdersRoutes } from "../modules/purchases/orders/purchaseOrders.route";

async function routes(f: FastifyInstance) {
    f.get("/", (req, resp) =>
        resp.status(200).type("text/plain").send("TCHAN! ")
    );
    f.register(productRoutes, { prefix: "/products" });
    f.register(userRoutes, { prefix: "/users" });
    f.register(suppliersRoutes, { prefix: "/suppliers" });
    f.register(purchaseOrdersRoutes, { prefix: "/purchase-order" });
}

export default routes;
