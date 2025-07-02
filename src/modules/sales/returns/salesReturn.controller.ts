import { FastifyRequest, FastifyReply } from "fastify";
import {
    SalesReturnService,
    SalesReturnCreateInput,
} from "./salesReturn.service";

export class SalesReturnController {
    static async create(
        req: FastifyRequest<{ Body: SalesReturnCreateInput }>,
        rep: FastifyReply
    ) {
        try {
            console.log(req.body);
            const salesReturn = await SalesReturnService.create(req.body);
            rep.code(201).send(salesReturn);
        } catch (error) {
            console.log(error);
            rep.code(500).send({
                message: "Erro ao criar devolução de venda.",
                error: error instanceof Error ? error.message : "Unknown error",
            });
        }
    }

    static async finalize(
        req: FastifyRequest<{ Params: { returnNumber: string } }>,
        rep: FastifyReply
    ) {
        try {
            const { returnNumber } = req.params;
            const finalizedReturn = await SalesReturnService.finalize(
                returnNumber
            );
            rep.code(200).send(finalizedReturn);
        } catch (error) {
            rep.code(500).send({
                message: "Erro ao finalizar devolução de venda.",
                error: error instanceof Error ? error.message : "Unknown error",
            });
        }
    }
}
