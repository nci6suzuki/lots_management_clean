"use server";

import { z } from "zod";
import { supabaseServer } from "@/lib/supabase/server";

const MonthSchema = z.string().regex(/^\d{4}-\d{2}$/, "YYYY-MM 形式で指定してください");

export async function createItem(input: {
  kind: "備" | "名" | "制";
  name: string;
  category_id?: string | null;
  is_uniform: boolean;
}) {
  const schema = z.object({
    kind: z.enum(["備", "名", "制"]),
    name: z.string().min(1),
    category_id: z.string().uuid().optional().nullable(),
    is_uniform: z.boolean(),
  });
  const data = schema.parse(input);

  // 採番
  const { data: codeData, error: codeErr } = await supabaseServer
    .rpc("generate_item_code", { p_kind: data.kind });

  if (codeErr) throw new Error(codeErr.message);

  const item_code = String(codeData);

  const { data: item, error } = await supabaseServer
    .from("items")
    .insert({
      kind: data.kind,
      item_code,
      name: data.name,
      category_id: data.category_id ?? null,
      is_uniform: data.is_uniform,
    })
    .select("*")
    .single();

  if (error) throw new Error(error.message);
  return item;
}

export async function createVariant(input: {
  item_id: string;
  size?: string | null;
  sku?: string | null;
}) {
  const schema = z.object({
    item_id: z.string().uuid(),
    size: z.string().optional().nullable(),
    sku: z.string().optional().nullable(),
  });
  const data = schema.parse(input);

  const { data: v, error } = await supabaseServer
    .from("item_variants")
    .insert({
      item_id: data.item_id,
      size: data.size ?? null,
      sku: data.sku ?? null,
    })
    .select("*")
    .single();

  if (error) throw new Error(error.message);
  return v;
}

export async function receiveStock(input: {
  type: "purchase" | "return" | "adjust";
  item_variant_id: string;
  qty: number;
  branch_id: string;
  unit_cost?: number; // purchase の時だけ使う
  note?: string;
}) {
  const schema = z.object({
    type: z.enum(["purchase", "return", "adjust"]),
    item_variant_id: z.string().uuid(),
    qty: z.number().int().positive(),
    branch_id: z.string().uuid(),
    unit_cost: z.number().nonnegative().optional(),
    note: z.string().optional(),
  });
  const data = schema.parse(input);

  const { data: movementId, error } = await supabaseServer.rpc("receive_stock", {
    p_type: data.type,
    p_item_variant_id: data.item_variant_id,
    p_qty: data.qty,
    p_branch_id: data.branch_id,
    p_unit_cost: data.unit_cost ?? 0,
    p_note: data.note ?? null,
    p_occurred_at: new Date().toISOString(),
  });

  if (error) throw new Error(error.message);
  return String(movementId);
}

export async function issueStockFIFO(input: {
  type: "lend" | "transfer" | "adjust";
  item_variant_id: string;
  qty: number;
  from_branch_id: string;
  to_branch_id?: string | null;
  note?: string;
}) {
  const schema = z.object({
    type: z.enum(["lend", "transfer", "adjust"]),
    item_variant_id: z.string().uuid(),
    qty: z.number().int().positive(),
    from_branch_id: z.string().uuid(),
    to_branch_id: z.string().uuid().optional().nullable(),
    note: z.string().optional(),
  });
  const data = schema.parse(input);

  const { data: movementId, error } = await supabaseServer.rpc("issue_stock_fifo", {
    p_type: data.type,
    p_item_variant_id: data.item_variant_id,
    p_qty: data.qty,
    p_from_branch_id: data.from_branch_id,
    p_to_branch_id: data.to_branch_id ?? null,
    p_note: data.note ?? null,
    p_occurred_at: new Date().toISOString(),
  });

  if (error) throw new Error(error.message);
  return String(movementId);
}

export async function calcMonthly(month: string) {
  MonthSchema.parse(month);

  const { data, error } = await supabaseServer.rpc("calc_monthly_transfer", {
    p_month: month,
  });

  if (error) throw new Error(error.message);
  return data ?? [];
}

export async function closeMonth(input: { month: string; user_id: string }) {
  MonthSchema.parse(input.month);
  z.string().uuid().parse(input.user_id);

  const { error } = await supabaseServer.rpc("close_month", {
    p_month: input.month,
    p_user_id: input.user_id,
  });

  if (error) throw new Error(error.message);
  return true;
}

export async function transferStockFIFO(input: {
  item_variant_id: string;
  qty: number;
  from_branch_id: string;
  to_branch_id: string;
  note?: string;
}) {
  const schema = z.object({
    item_variant_id: z.string().uuid(),
    qty: z.number().int().positive(),
    from_branch_id: z.string().uuid(),
    to_branch_id: z.string().uuid(),
    note: z.string().optional(),
  });
  const data = schema.parse(input);

  const { data: res, error } = await supabaseServer.rpc("transfer_stock_fifo", {
    p_item_variant_id: data.item_variant_id,
    p_qty: data.qty,
    p_from_branch_id: data.from_branch_id,
    p_to_branch_id: data.to_branch_id,
    p_note: data.note ?? null,
    p_occurred_at: new Date().toISOString(),
  });

  if (error) throw new Error(error.message);
  return res;
}

