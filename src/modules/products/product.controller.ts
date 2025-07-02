import { FastifyRequest, FastifyReply } from "fastify";
import { ProductService, ProductType } from "./products.service";

type CategoryRequestBody = {
    name: string;
    description?: string | null;
};

export class ProductController {
    static async store(
        request: FastifyRequest<{ Body: ProductType }>,
        reply: FastifyReply
    ) {
        try {
            const product = await ProductService.create(request.body);
            reply.code(201).send(product);
        } catch (error) {
            reply.code(500).send({ error: "Failed to create product" });
        }
    }

    static async getProductById(
        request: FastifyRequest<{ Params: { id: string } }>,
        reply: FastifyReply
    ) {
        try {
            const id = parseInt(request.params.id, 10);
            const product = await ProductService.findById(id);

            if (!product) {
                return reply
                    .code(404)
                    .send({ error: `Product - #${id} - not found` });
            }
            reply.send(product);
        } catch (error) {
            reply.code(500).send({
                error: `Failed to fetch product - #${request.params.id}`,
            });
        }
    }

    static async getProductBySku(
        request: FastifyRequest<{ Params: { sku: string } }>,
        reply: FastifyReply
    ) {
        try {
            const { sku } = request.params;
            const product = await ProductService.findBySku(sku);

            if (!product) {
                return reply.code(404).send({ error: "Product not found" });
            }
            reply.send(product);
        } catch (error) {
            reply.code(500).send({ error: "Failed to fetch product" });
        }
    }

    static async getProductsByBarcode(
        request: FastifyRequest<{ Params: { barcode: string } }>,
        reply: FastifyReply
    ) {
        try {
            const { barcode } = request.params;
            const products = await ProductService.findByBarcode(barcode);

            if (!products || products.length === 0) {
                return reply.code(404).send({ error: "Products not found" });
            }
            reply.send(products);
        } catch (error) {
            reply.code(500).send({ error: "Failed to fetch products" });
        }
    }

    static async storeCategory(
        request: FastifyRequest<{ Body: CategoryRequestBody }>,
        reply: FastifyReply
    ) {
        try {
            const category = await ProductService.createCategory(request.body);
            reply.code(201).send(category);
        } catch (error) {
            reply.code(500).send({ error: "Failed to create category" });
        }
    }

    static async getCategoryById(
        request: FastifyRequest<{ Params: { id: string } }>,
        reply: FastifyReply
    ) {
        try {
            const id = parseInt(request.params.id, 10);
            const category = await ProductService.findCategoryById(id);

            if (!category) {
                return reply
                    .code(404)
                    .send({ error: `Category - #${id} - not found` });
            }
            reply.send(category);
        } catch (error) {
            reply.code(500).send({
                error: `Failed to fetch category - #${request.params.id}`,
            });
        }
    }

    static async getCategoryByName(
        request: FastifyRequest<{ Params: { name: string } }>,
        reply: FastifyReply
    ) {
        try {
            const { name } = request.params;
            const category = await ProductService.findCategoryByName(name);

            if (!category) {
                return reply
                    .code(404)
                    .send({ error: `Category - ${name} - not found` });
            }
            reply.send(category);
        } catch (error) {
            reply
                .code(500)
                .send({ error: `Failed to fetch category - ${name}` });
        }
    }
}
