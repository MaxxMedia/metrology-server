/** Defines Express routes for content endpoints and connects them to their handlers. */
import express from "express";
import { getCategories, createCategory, updateCategory, deleteCategory } from "./categories.controller.js";

const router = express.Router();

router.get("/", getCategories);
router.post("/", createCategory);
router.put("/:id", updateCategory);
router.delete("/:id", deleteCategory);

export default router;

