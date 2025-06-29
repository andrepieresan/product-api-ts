import { FastifyReply, FastifyRequest } from "fastify";
import { SalesService, CounterSaleInput } from "./salesOrders.service";
import {
    ShipmentService,
    ShipmentCreateInput,
} from "../shipments/shipment.service";

export class SalesController {
    static async counterSaleOrder(
        req: FastifyRequest<{ Body: CounterSaleInput }>,
        rep: FastifyReply
    ) {
        try {
            const counterSale = await SalesService.createCounterSale(req.body);
            return rep.status(201).send(counterSale);
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
    static async saleOrder(
        req: FastifyRequest<{ Body: CounterSaleInput }>,
        rep: FastifyReply
    ) {
        try {
            const counterSale = await SalesService.create(req.body);
            return rep.status(201).send(counterSale);
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

    static async shipmentOrder(
        req: FastifyRequest<{ Body: ShipmentCreateInput }>,
        rep: FastifyReply
    ) {
        try {
            const counterSale = await ShipmentService.create(req.body);
            return rep.status(201).send(counterSale);
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
}
