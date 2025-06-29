// src/modules/purchases/receipts/goodsReceipts.route.ts

import { FastifyInstance } from "fastify";
import { GoodsReceiptController } from "./goodsReceipts.controller";

export async function goodsReceiptsRoutes(f: FastifyInstance) {
    f.post(
        "/receipts",
        {
            // schema: {
            //     body: {
            //         type: "object",
            //         properties: {
            //             purchaseOrderId: { type: "number" },
            //             supplierId: { type: "number" },
            //             locationId: { type: "number" },
            //             receiptDate: { type: "string", format: "date" },
            //             notes: { type: "string" },
            //             items: {
            //                 type: "array",
            //                 items: {
            //                     type: "object",
            //                     properties: {
            //                         productId: { type: "number" },
            //                         quantity: { type: "number" },
            //                         purchaseOrderItemId: { type: "number" },
            //                         batchId: { type: "number" },
            //                     },
            //                     required: ["productId", "quantity"],
            //                 },
            //             },
            //         },
            //         required: [
            //             "purchaseOrderId",
            //             "supplierId",
            //             "locationId",
            //             "receiptDate",
            //             "items",
            //         ],
            //     },
            // },
        },
        GoodsReceiptController.store
    );
    f.put(
        "/receipts/:p_order_id",
        GoodsReceiptController.refreshStockStatusById
    );
    f.post("/returns", GoodsReceiptController.storeReturns);
    f.put("/returns/:return_number/finalize", GoodsReceiptController.finalizeReturn);
}
