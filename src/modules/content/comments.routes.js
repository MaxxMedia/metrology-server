import express from "express";
import {
  getComments,
  addComment,
} from "./comments.controller.js";

import { requireAuth } from "../../shared/middleware/auth.js";

const router = express.Router();

// Public
router.get("/:postId/comments", getComments);

// Logged in users only
router.post("/:postId/comments", requireAuth, addComment);

export default router;