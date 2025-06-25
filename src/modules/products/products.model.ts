export interface Product {
    id?: number;
    sku: string;
    barcode?: string | null;
    name: string;
    description?: string | null;
    category_id?: number | null;
    unit_of_measure: string;
    cost_price?: number | null;
    selling_price?: number | null;
    min_stock_level?: number | null;
    max_stock_level?: number | null;
    reorder_point?: number | null;
    weight?: number | null;
    dimensions?: string | null;
    is_active?: boolean;
    is_serialized?: boolean;
    has_batches?: boolean;
    created_at?: Date;
    updated_at?: Date;
    created_by?: number | null;
}
