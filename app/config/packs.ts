export type PackId = "pack_a" | "pack_b" | "pack_c";

export type Pack = {
  id: PackId;
  quantity: 1 | 2 | 3;
  priceTnd: number;
  badge?: "discount" | "premium";
};

// Temporary placeholder pricing (TND). Adjust later.
export const PACKS: Record<PackId, Pack> = {
  pack_a: { id: "pack_a", quantity: 1, priceTnd: 79 },
  pack_b: { id: "pack_b", quantity: 2, priceTnd: 139, badge: "discount" },
  pack_c: { id: "pack_c", quantity: 3, priceTnd: 189, badge: "premium" },
};

export const PACK_ORDER: PackId[] = ["pack_a", "pack_b", "pack_c"];
