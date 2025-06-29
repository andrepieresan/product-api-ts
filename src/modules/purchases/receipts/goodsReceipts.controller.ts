import { FastifyReply, FastifyRequest } from "fastify";
import {
    GoodsReceiptService,
    GoodsReceiptInput,
    PurchaseReturnCreateInput,
} from "./goodsReceipts.service";
export class GoodsReceiptController {
    static async store(
        req: FastifyRequest<{ Body: GoodsReceiptInput }>,
        rep: FastifyReply
    ) {
        try {
            const goodsReceipt = await GoodsReceiptService.create(req.body);
            return rep.status(201).send(goodsReceipt);
        } catch (error) {
            if (error instanceof Error) {
                console.log(error.stack);
            } else {
                console.log(error);
            }
            return rep.status(500).send({
                error: "Internal Server Error",
                message:
                    error instanceof Error ? error.message : "Unknown error",
            });
        }
    }
    static async finalizeReturn(
        req: FastifyRequest<{ Params: { return_number: string } }>,
        rep: FastifyReply
    ) {
        try {
            const { return_number } = req.params;
            console.log(return_number);
            const purchaseReturn = await GoodsReceiptService.finalizeReturn(
                return_number
            );
            return rep.status(201).send(purchaseReturn);
        } catch (error) {
            if (error instanceof Error) {
                console.log(error.stack);
            } else {
                console.log(error);
            }
            return rep.status(500).send({
                error: "Internal Server Error",
                message:
                    error instanceof Error ? error.message : "Unknown error",
            });
        }
    }

    static async storeReturns(
        req: FastifyRequest<{ Body: PurchaseReturnCreateInput }>,
        rep: FastifyReply
    ) {
        try {
            const purchaseReturn = await GoodsReceiptService.createReturn(
                req.body
            );
            return rep.status(201).send(purchaseReturn);
        } catch (error) {
            if (error instanceof Error) {
                console.log(error.stack);
            } else {
                console.log(error);
            }
            return rep.status(500).send({
                error: "Internal Server Error",
                message:
                    error instanceof Error ? error.message : "Unknown error",
            });
        }
    }

    static async findOne(
        req: FastifyRequest<{ Params: { id: string } }>,
        rep: FastifyReply
    ) {
        // Lógica para buscar um recibo de mercadoria pelo ID
        const { id } = req.params;
        rep.send({ id, name: "Sample Receipt" });
    }

    static async refreshStockStatusById(
        req: FastifyRequest<{ Params: { p_order_id: string } }>,
        rep: FastifyReply
    ) {
        try {
            let { p_order_id } = req.params;
            const purchaseOrder = await GoodsReceiptService.updateOrderQuantity(
                p_order_id
            );
            return rep.status(201).send(purchaseOrder);
        } catch (error) {
            if (error instanceof Error) {
                console.log(error.stack);
            } else {
                console.log(error);
            }
            return rep.status(500).send({
                error: "Internal Server Error",
                message:
                    error instanceof Error ? error.message : "Unknown error",
            });
        }
    }

    static async delete(
        req: FastifyRequest<{ Params: { id: string } }>,
        rep: FastifyReply
    ) {
        const { id } = req.params;
        rep.send({ message: `Goods receipt ${id} deleted` });
    }
}
