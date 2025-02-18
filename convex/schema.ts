// schema.ts
import { defineSchema, defineTable } from "convex/server";
import { v } from "convex/values";
import { componentValidator } from "./types";

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
  
  // Add teams table schema
  teams: defineTable({
    teamName: v.string(),
    createdBy: v.string()
  }),

  // Add user table schema
  user: defineTable({
    name: v.string(),
    email: v.string(),
    image: v.string()
  })
});