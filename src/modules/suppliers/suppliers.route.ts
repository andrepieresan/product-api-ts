import { FastifyInstance, FastifyPluginAsync } from "fastify";
import { SuppliersController } from "./suppliers.controller";

export const suppliersRoutes: FastifyPluginAsync = async (f: FastifyInstance) => {
    f.get("/", SuppliersController.getSuppliers);

    f.post("/", SuppliersController.createSupplier);

    f.get("/:id", SuppliersController.getSupplier);

    // f.put("/:id", SuppliersController.updateSupplier);

    f.delete("/:id", SuppliersController.deleteSupplier);

    // // Ratings
    // f.get('/:id/ratings', async (request, reply) => {
    //     reply.send(`Get ratings for supplier ${(request.params as any).id}`);
    // });

    // f.post('/:id/ratings', async (request, reply) => {
    //     reply.send(`Create rating for supplier ${(request.params as any).id}`);
    // });

    // f.get('/:id/ratings/:ratingId', async (request, reply) => {
    //     const { id, ratingId } = request.params as any;
    //     reply.send(`Get rating ${ratingId} for supplier ${id}`);
    // });

    // f.put('/:id/ratings/:ratingId', async (request, reply) => {
    //     const { id, ratingId } = request.params as any;
    //     reply.send(`Update rating ${ratingId} for supplier ${id}`);
    // });

    // // Documents
    // f.get('/:id/documents', async (request, reply) => {
    //     reply.send(`Get documents for supplier ${(request.params as any).id}`);
    // });

    // f.post('/:id/documents', async (request, reply) => {
    //     reply.send(`Create document for supplier ${(request.params as any).id}`);
    // });

    // f.get('/:id/documents/:documentId', async (request, reply) => {
    //     const { id, documentId } = request.params as any;
    //     reply.send(`Get document ${documentId} for supplier ${id}`);
    // });

    // f.put('/:id/documents/:documentId', async (request, reply) => {
    //     const { id, documentId } = request.params as any;
    //     reply.send(`Update document ${documentId} for supplier ${id}`);
    // });

    // f.delete('/:id/documents/:documentId', async (request, reply) => {
    //     const { id, documentId } = request.params as any;
    //     reply.send(`Delete document ${documentId} for supplier ${id}`);
    // });

    // // Contracts
    // f.get('/:id/contracts', async (request, reply) => {
    //     reply.send(`Get contracts for supplier ${(request.params as any).id}`);
    // });

    // f.post('/:id/contracts', async (request, reply) => {
    //     reply.send(`Create contract for supplier ${(request.params as any).id}`);
    // });

    // f.get('/:id/contracts/:contractId', async (request, reply) => {
    //     const { id, contractId } = request.params as any;
    //     reply.send(`Get contract ${contractId} for supplier ${id}`);
    // });

    // f.put('/:id/contracts/:contractId', async (request, reply) => {
    //     const { id, contractId } = request.params as any;
    //     reply.send(`Update contract ${contractId} for supplier ${id}`);
    // });

    // f.delete('/:id/contracts/:contractId', async (request, reply) => {
    //     const { id, contractId } = request.params as any;
    //     reply.send(`Delete contract ${contractId} for supplier ${id}`);
    // });
};

