import { FastifyInstance } from "fastify";
import { ProductController } from "./product.controller";
import { InventaryController } from "../inventary/inventary.controller";
import { LocationController } from "../location/location.controller";

export async function productRoutes(f: FastifyInstance) {
    f.post("/product", ProductController.store);
    f.get("/product/:id", ProductController.getProductById);
    f.get("/product/sku/:sku", ProductController.getProductBySku);
    f.get("/product/barcode/:barcode", ProductController.getProductsByBarcode);
    // f.put("/product/delete", deleteById);

    f.post("/category", ProductController.storeCategory);
    f.get("/category/:id", ProductController.getCategoryById);
    f.get("/category/:name/name", ProductController.getCategoryByName);
    // f.put("/category/delete", deleteCatById);

    f.post("/location", LocationController.storeLocation);
    f.get("/location", LocationController.getLocations);
    f.get("/location/:id", LocationController.getLocationById);
    f.get("/location/:name/name", LocationController.getLocationByName);
    // f.put("/location/delete", deleteLocationById);

    f.post("/inventary", InventaryController.storeInventary);
    f.get(
        "/inventary/product/:product_id",
        InventaryController.getInventaryByProductId
    );
    f.get(
        "/inventary/product/:product_name/name",
        InventaryController.getInventaryByProductName
    );
    f.get(
        "/inventary/location/:location_id",
        InventaryController.getInventaryByLocationId
    );
    f.get(
        "/inventary/location-product-id/:location_id/:product_id",
        InventaryController.getProductIdByLocationId
    );
    f.get(
        "/inventary/location-product-name/:location_id/:product_name",
        InventaryController.getProductNameByLocationId
    );
    // f.put("/inventary/delete", deleteLocationById);

    // f.post("/inventary/movements", storeMovement);
    // f.get("/inventary/movements", getMovements);
    // f.get("/inventary/movements/:product_id/product", getMovementsByProductId);
    // f.get("/inventary/movements/:location_id/location", getMovementsByLocation);

    // f.post("/inventary/counts/store", storeCounts);
    // f.post("/inventary/counts/:item_id", storeItemInCount);
    // f.post(
    //     "/inventary/counts/:count_id/item/:item_id",
    //     updateinventaryItemCounts
    // );
    // f.get("/inventary/counts", getinventaryGroupByLocation);
    // f.get("/inventary/counts/:location_id", getinventaryCountsByLocationId);
    // f.put("/inventary/counts/:count_id/finalize", finalizeinventaryCount);
    // f.get("/inventary/counts/:count_id/discrepancies", getDiscrepancies);
    // f.put("/inventary/counts/:count_id/approve", approveinventaryCount);
    // f.get(
    //     "/inventary/counts/:count_id/discrepancies/:location_id/location",
    //     getDiscrepanciesByLocation
    // );

    // f.post("/inventary/adjustments", storeAdjustment);
    // f.get(
    //     "/inventary/adjustments/:location_id/location",
    //     getAdjustmentsByLocationId
    // );
    // f.get(
    //     "/inventary/adjustments/:location_name/location-name",
    //     getAdjustmentsByLocationName
    // );
    // f.get("/inventary/adjustments/:count_id/count", getAdjustmentsByCountId);
    // f.get("/inventary/adjustments/:adjustment_id", getAdjustmentsById);
    // f.put("/inventary/adjustments/:adjustment_id/approve", getAdjustmentsById);
}
