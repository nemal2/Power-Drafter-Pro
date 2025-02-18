// files.ts
import { v } from "convex/values";
import { mutation, query } from "./_generated/server";
import { Id } from "./_generated/dataModel";

// Create file mutation
export const createFile = mutation({
  args: {
    fileName: v.string(),
    teamId: v.string(),
    createdBy: v.string(),
    archive: v.boolean(),
    document: v.string(),
    whiteboard: v.string()
  },
  handler: async (ctx, args) => {
    const newFile = await ctx.db.insert("files", {
      fileName: args.fileName,
      teamId: args.teamId,
      createdBy: args.createdBy,
      archive: args.archive,
      document: args.document,
      whiteboard: args.whiteboard,
      canvasComponents: [], // Initialize empty array for components
      budget: { // Initialize empty budget
        total: 0,
        items: []
      }
    });
    return newFile;
  }
});

// Get files query
export const getFiles = query({
  args: { teamId: v.string() },
  handler: async (ctx, args) => {
    const files = await ctx.db
      .query("files")
      .filter((q) => q.eq(q.field("teamId"), args.teamId))
      .filter((q) => q.eq(q.field("archive"), false))
      .order("desc")
      .collect();
    return files;
  }
});

// Get single file details
export const getFileById = query({
  args: { fileId: v.id("files") },
  handler: async (ctx, args) => {
    const file = await ctx.db.get(args.fileId);
    return file;
  }
});

export const saveCanvasState = mutation({
  args: {
    fileId: v.id("files"),
    components: v.array(
      v.object({
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
      })
    ),
    budget: v.object({
      total: v.float64(),
      items: v.array(
        v.object({
          id: v.string(),
          name: v.string(),
          quantity: v.float64(),
          price: v.float64()
        })
      )
    })
  },
  handler: async (ctx, args) => {
    if (!args.fileId) {
      throw new Error("fileId is required");
    }
    
    try {
      const result = await ctx.db.patch(args.fileId, {
        canvasComponents: args.components,
        budget: args.budget
      });
      return result;
    } catch (error) {
      console.error("Error in saveCanvasState:", error);
      throw error;
    }
  }
});