import { v } from "convex/values";

export const componentValidator = v.object({
  id: v.string(),
  name: v.string(),
  svg: v.string(),
  x: v.float64(),
  y: v.float64(),
  rotation: v.optional(v.float64()),
  description: v.optional(v.string()),
  instanceId: v.string(),
  price: v.float64(),
  specs: v.optional(v.object({
    power: v.array(v.string()),
    resistance: v.array(v.string()),
    tolerance: v.array(v.string())
  }))
});
