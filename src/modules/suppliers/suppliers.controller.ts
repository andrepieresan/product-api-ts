import { FastifyReply, FastifyRequest } from "fastify";
import { SuppliersService } from "./suppliers.service";

type SupplierCreateBody = {
    name: string;
    created_by?: number;
};

type SupplierUpdateBody = {
    name: string;
    legal_name?: string;
    tax_id?: string;
    contact_name?: string;
    email?: string;
    phone?: string;
    address?: string;
    city?: string;
    state?: string;
    postal_code?: string;
    country?: string;
    status: "active" | "inactive" | "blocked";
    payment_terms?: string;
    lead_time_days?: number;
};

export class SuppliersController {
    static async getSuppliers(req: FastifyRequest, rep: FastifyReply) {
        try {
            const suppliers = await SuppliersService.findAll();
            rep.send(suppliers);
        } catch (err) {
            rep.code(500).send({
                error: "Failed to fetch suppliers",
                details: err,
            });
        }
    }

    static async createSupplier(
        req: FastifyRequest<{ Body: SupplierCreateBody }>,
        rep: FastifyReply
    ) {
        try {
            const supplier = await SuppliersService.create(req.body);
            rep.code(201).send(supplier);
        } catch (err) {
            rep.code(400).send({
                error: "Failed to create supplier",
                details: err,
            });
        }
    }

    static async getSupplier(
        req: FastifyRequest<{ Params: { id: string } }>,
        rep: FastifyReply
    ) {
        try {
            const id = Number(req.params.id);
            const supplier = await SuppliersService.findById(id);
            if (!supplier) {
                return rep.code(404).send({ error: "Supplier not found" });
            }
            rep.send(supplier);
        } catch (err) {
            rep.code(400).send({
                error: "Failed to fetch supplier",
                details: err,
            });
        }
    }

    static async updateSupplier(
        req: FastifyRequest<{
            Params: { id: string };
            Body: SupplierUpdateBody;
        }>,
        rep: FastifyReply
    ) {
        try {
            const id = Number(req.params.id);
            const supplier = await SuppliersService.update(id, req.body);
            rep.send(supplier);
        } catch (err) {
            rep.code(400).send({
                error: "Failed to update supplier",
                details: err,
            });
        }
    }

    static async deleteSupplier(
        req: FastifyRequest<{ Params: { id: string } }>,
        rep: FastifyReply
    ) {
        try {
            const id = Number(req.params.id);
            await SuppliersService.delete(id);
            rep.code(204).send();
        } catch (err) {
            rep.code(400).send({
                error: "Failed to delete supplier",
                details: err,
            });
        }
    }
}
