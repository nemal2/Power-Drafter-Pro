// schema.ts
import { defineSchema, defineTable } from "convex/server";
import { v } from "convex/values";

const componentValidator = v.object({
  id: v.string(),
  name: v.string(),
  svg: v.string(),
  x: v.float64(),
  y: v.float64(),
  rotation: v.float64(),
  description: v.optional(v.string()),
  instanceId: v.string(),
  price: v.float64(),
  specs: v.optional(v.object({
    power: v.array(v.string()),
    resistance: v.array(v.string()),
    tolerance: v.array(v.string())
  }))
});

export default defineSchema({
  files: defineTable({
    fileName: v.string(),
    teamId: v.string(),
    createdBy: v.string(),
    archive: v.boolean(),
    document: v.string(),
    whiteboard: v.string(),
    canvasComponents: v.optional(v.array(componentValidator)),
    budget: v.optional(v.object({
      total: v.float64(),
      items: v.array(v.object({
        id: v.string(),
        name: v.string(),
        quantity: v.float64(),
        price: v.float64()
      }))
    }))
  }),
  teams: defineTable({
    teamName: v.string(),
    createdBy: v.string()
  }),
  user: defineTable({
    name: v.string(),
    email: v.string(),
    image: v.string()
  })
});