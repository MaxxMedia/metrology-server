import express from "express";
import {
    uploadImage,
    uploadDocument,
    deleteFile,
    uploadMultipleDocuments,
    uploadIndustryTalk
} from "./upload.controller.js";
import { uploadIndustryTalkFiles } from "../../shared/middleware/uploadIndustryTalk.js";
import { requireAuth } from "../../shared/middleware/auth.js";

const router = express.Router();

// ✅ Image upload
router.post("/", uploadImage);

// ✅ Document upload (PDF, Word, Excel, etc.)
router.post("/document", uploadDocument);

// ✅ Multiple documents upload
router.post("/documents", uploadMultipleDocuments);

router.post("/document", requireAuth, ...uploadDocument)

// ✅ Delete file
router.delete("/", deleteFile);

router.post(
  "/industry-talk",
  requireAuth,
  uploadIndustryTalkFiles,
  uploadIndustryTalk
);

export default router;