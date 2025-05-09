// types.ts
import { v } from "convex/values";

// Updated componentValidator to include width and height
export const componentValidator = v.object({
  id: v.string(),
  name: v.string(),
  svg: v.string(),
  category: v.string(),
  price: v.float64(),
  x: v.float64(),
  y: v.float64(),
  instanceId: v.string(),
  rotation: v.optional(v.float64()),
  width: v.optional(v.float64()),    // Added width property
  height: v.optional(v.float64()),   // Added height property
  specs: v.optional(v.object({
    power: v.optional(v.array(v.string())),
    resistance: v.optional(v.array(v.string())),
    tolerance: v.optional(v.array(v.string())),
    // Add other specs as needed
  }))
});