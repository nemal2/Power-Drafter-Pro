// files.ts
import { v } from "convex/values";
import { mutation, query } from "./_generated/server";
import { Id } from "./_generated/dataModel";
import { componentValidator } from "./types";
import type * as files from "././_generated/api";
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

// Get archived files query
export const getArchivedFiles = query({
  args: { teamId: v.string() },
  handler: async (ctx, args) => {
    const files = await ctx.db
      .query("files")
      .filter((q) => q.eq(q.field("teamId"), args.teamId))
      .filter((q) => q.eq(q.field("archive"), true))
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

// Delete file mutation
export const deleteFile = mutation({
  args: { fileId: v.id("files") },
  handler: async (ctx, args) => {
    try {
      const existingFile = await ctx.db.get(args.fileId);
      if (!existingFile) {
        return { success: false, error: "File not found" };
      }
      await ctx.db.delete(args.fileId);
      return { success: true };
    } catch (error) {
      console.error("Error deleting file:", error);
      return { success: false, error: `Failed to delete file: ${error}` };
    }
  }
});

// Archive file mutation
export const archiveFile = mutation({
  args: { fileId: v.id("files") },
  handler: async (ctx, args) => {
    console.log("Archive mutation called with ID:", args.fileId);
    try {
      const existingFile = await ctx.db.get(args.fileId);
      console.log("Found file:", existingFile ? "yes" : "no");
      if (!existingFile) {
        console.log("File not found");
        return { success: false, error: "File not found" };
      }
      
      // Update the file's archive status to true
      const result = await ctx.db.patch(args.fileId, { archive: true });
      console.log("Archive operation result:", result);
      return { success: true };
    } catch (error) {
      console.error("Error archiving file:", error);
      return { success: false, error: `Failed to archive file: ${error}` };
    }
  }
});

// Restore file mutation
export const restoreFile = mutation({
  args: { fileId: v.id("files") },
  handler: async (ctx, args) => {
    console.log("Restore mutation called with ID:", args.fileId);
    try {
      const existingFile = await ctx.db.get(args.fileId);
      console.log("Found file:", existingFile ? "yes" : "no");
      if (!existingFile) {
        console.log("File not found");
        return { success: false, error: "File not found" };
      }
      
      // Update the file's archive status to false
      const result = await ctx.db.patch(args.fileId, { archive: false });
      console.log("Restore operation result:", result);
      return { success: true };
    } catch (error) {
      console.error("Error restoring file:", error);
      return { success: false, error: `Failed to restore file: ${error}` };
    }
  }
});

export const saveCanvasState = mutation({
  args: {
    fileId: v.id("files"),
    components: v.array(componentValidator),
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
    
    // Ensure all components have required values
    const updatedComponents = args.components.map(comp => ({
      ...comp,
      rotation: comp.rotation ?? 0.0, // Add default rotation if missing
      width: comp.width ?? 100,      // Add default width if missing
      height: comp.height ?? 100     // Add default height if missing
    }));
    
    try {
      const result = await ctx.db.patch(args.fileId, {
        canvasComponents: updatedComponents,
        budget: args.budget
      });
      return result;
    } catch (error) {
      console.error("Error in saveCanvasState:", error);
      throw error;
    }
  }
});