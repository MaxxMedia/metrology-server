// C:\Users\Dell\OneDrive\Desktop\tooling\newsprk-backend\src\controllers\adminDirectoryController.js

import prisma from "../../shared/lib/prisma.js"
import bcrypt from "bcrypt";
import slugify from "slugify";

// âœ… Updated include to include lastLoginAt and emailSentForBulkImport
const submittedByInclude = {
  User_SupplierDirectory_submittedByIdToUser: {
    select: { 
      id: true, 
      email: true, 
      fullName: true,
      username: true,
      isOnboarded: true,
      lastLoginAt: true,
      emailSentForBulkImport: true,
    },
  },
}

function mapDirectory(directory) {
  if (!directory) return directory
  const { User_SupplierDirectory_submittedByIdToUser, ...rest } = directory
  return {
    ...rest,
    submittedBy: User_SupplierDirectory_submittedByIdToUser ?? null,
  }
}

export async function getPendingDirectories(req, res) {
  if (req.user.role?.toLowerCase() !== "admin") {
    return res.status(403).json({ error: "Admin only" })
  }

  const directories = await prisma.supplierDirectory.findMany({
    where: {
      status: "PENDING",
    },
    orderBy: { createdAt: "asc" },
    include: submittedByInclude,
  })

  res.json(directories.map(mapDirectory))
}

export async function getDirectoryForReview(req, res) {
  if (req.user.role?.toLowerCase() !== "admin") {
    return res.status(403).json({ error: "Admin only" })
  }

  const directoryId = Number(req.params.id)

  const directory = await prisma.supplierDirectory.findUnique({
    where: { id: directoryId },
    include: submittedByInclude,
  })

  if (!directory) {
    return res.status(404).json({ error: "Directory not found" })
  }

  res.json(mapDirectory(directory))
}

export async function approveDirectory(req, res) {
  if (req.user.role?.toLowerCase() !== "admin") {
    return res.status(403).json({ error: "Admin only" })
  }

  const directoryId = Number(req.params.id)

  const directory = await prisma.supplierDirectory.update({
    where: { id: directoryId },
    data: {
      status: "APPROVED",
      isLiveEditable: true,
      approvedById: req.user.userId ?? req.user.id,
      approvedAt: new Date(),
    },
  })

  await prisma.auditLog.create({
    data: {
      action: "DIRECTORY_APPROVED",
      entity: "SupplierDirectory",
      entityId: directory.id,
      userId: req.user.userId ?? req.user.id,
    },
  })

  res.json({ message: "Directory approved", directory })
}

export async function rejectDirectory(req, res) {
  if (req.user.role?.toLowerCase() !== "admin") {
    return res.status(403).json({ error: "Admin only" })
  }

  const directoryId = Number(req.params.id)

  await prisma.supplierDirectory.update({
    where: { id: directoryId },
    data: { status: "REJECTED" },
  })

  await prisma.auditLog.create({
    data: {
      action: "DIRECTORY_REJECTED",
      entity: "SupplierDirectory",
      entityId: directoryId,
      userId: req.user.userId ?? req.user.id,
    },
  })

  res.json({ message: "Directory rejected" })
}

export async function adminUpdateDirectory(req, res) {
  const directoryId = Number(req.params.id)
  if (!Number.isInteger(directoryId) || directoryId <= 0) {
    return res.status(400).json({ error: "Invalid directory ID" })
  }

  const { name, slug, description, logoUrl, phoneNumber, email, website, googleMapUrl } = req.body
  if (!name?.trim() || !slug?.trim() || !description?.trim()) {
    return res.status(400).json({ error: "Name, slug, and description are required" })
  }

  try {
    const directory = await prisma.supplierDirectory.update({
      where: { id: directoryId },
      data: {
        name: name.trim(),
        slug: slug.trim(),
        description: description.trim(),
        logoUrl: logoUrl?.trim() || null,
        phoneNumber: phoneNumber?.trim() || null,
        email: email?.trim() || null,
        website: website?.trim() || null,
        googleMapUrl: googleMapUrl?.trim() || null,
      },
    })
    return res.json(directory)
  } catch (error) {
    if (error.code === "P2002") return res.status(409).json({ error: "That directory slug is already in use" })
    if (error.code === "P2025") return res.status(404).json({ error: "Directory not found" })
    console.error("Admin update directory error:", error)
    return res.status(500).json({ error: "Failed to update directory" })
  }
}

export async function adminDeleteDirectory(req, res) {
  const directoryId = Number(req.params.id)
  if (!Number.isInteger(directoryId) || directoryId <= 0) {
    return res.status(400).json({ error: "Invalid directory ID" })
  }

  try {
    await prisma.supplierDirectory.delete({ where: { id: directoryId } })
    return res.json({ message: "Directory deleted" })
  } catch (error) {
    if (error.code === "P2025") return res.status(404).json({ error: "Directory not found" })
    if (error.code === "P2003") return res.status(409).json({ error: "This directory has related records and cannot be deleted" })
    console.error("Admin delete directory error:", error)
    return res.status(500).json({ error: "Failed to delete directory" })
  }
}
export async function adminCreateDirectory(req, res) {
  if (req.user.role?.toLowerCase() !== "admin") {
    return res.status(403).json({ error: "Admin only" });
  }

  const {
    name,
    slug,
    description,
    logoUrl,
    companyId,
    submittedById,
  } = req.body;

  const directory = await prisma.supplierDirectory.create({
    data: {
      name,
      slug,
      description,
      logoUrl,
      companyId: Number(companyId),
      submittedById: Number(submittedById),
      status: "APPROVED",
      isLiveEditable: true,
      approvedById: req.user.userId ?? req.user.id,
      approvedAt: new Date(),
    },
  });

  res.status(201).json(directory);
}

/* =========================================
   âœ… HELPER: Generate a unique username
========================================= */
async function generateUniqueUsername(email) {
  const base = email
    .split("@")[0]
    .toLowerCase()
    .replace(/[^a-z0-9]/g, "")

  // Try base first
  const existing = await prisma.user.findUnique({ where: { username: base } })
  if (!existing) return base

  // Keep trying with random 4-digit suffix until unique
  let username = ""
  let isUnique = false

  while (!isUnique) {
    const suffix = Math.floor(1000 + Math.random() * 9000)
    username = `${base}${suffix}`
    const taken = await prisma.user.findUnique({ where: { username } })
    if (!taken) isUnique = true
  }

  return username
}

export async function adminCreateFullSetup(req, res) {
  if (req.user.role?.toLowerCase() !== "admin") {
    return res.status(403).json({ error: "Admin only" });
  }

  const { company, recruiter, directory } = req.body;

  try {
    // Generate unique username
    const uniqueUsername = await generateUniqueUsername(recruiter.email);

    const result = await prisma.$transaction(async (tx) => {

      /* ==============================
         1ï¸âƒ£ VALIDATE INDUSTRY
      ============================== */
      const industry = await tx.industry.findUnique({
        where: { id: Number(company.industryId) },
      });

      if (!industry) {
        throw new Error("Invalid industry selected");
      }

      /* ==============================
         2ï¸âƒ£ CREATE COMPANY
      ============================== */
      let companySlug = slugify(company.name, {
        lower: true,
        strict: true,
      });

      const existingCompany = await tx.company.findUnique({
        where: { slug: companySlug },
      });

      if (existingCompany) {
        companySlug = `${companySlug}-${Date.now()}`;
      }

      const newCompany = await tx.company.create({
        data: {
          name: company.name,
          slug: companySlug,
          description: company.description,
          website: company.website,
          location: company.location,
          address: company.address,
          industryId: Number(company.industryId),
          logoUrl: company.logoUrl,
          isVerified: true,
        },
      });

      /* ==============================
         3ï¸âƒ£ CHECK EMAIL
      ============================== */
      const existingUser = await tx.user.findUnique({
        where: {
          email: recruiter.email,
        },
      });

      if (existingUser) {
        throw new Error("A user with this email already exists.");
      }

      /* ==============================
         4ï¸âƒ£ CREATE RECRUITER
      ============================== */
      const hashedPassword = await bcrypt.hash(recruiter.password, 10);

      const newRecruiter = await tx.user.create({
        data: {
          email: recruiter.email,
          username: uniqueUsername,
          password: hashedPassword,
          role: "recruiter",
          fullName: recruiter.fullName,
          companyId: newCompany.id,
          emailVerified: true,
          emailSentForBulkImport: false,
          isOnboarded: false,
          lastLoginAt: null,
        },
      });

      /* ==============================
         5ï¸âƒ£ CREATE DIRECTORY
      ============================== */
      let directorySlug = slugify(directory.name, {
        lower: true,
        strict: true,
      });

      const existingDirectory = await tx.supplierDirectory.findUnique({
        where: { slug: directorySlug },
      });

      if (existingDirectory) {
        directorySlug = `${directorySlug}-${Date.now()}`;
      }

      const newDirectory = await tx.supplierDirectory.create({
        data: {
          name: directory.name,
          slug: directorySlug,
          description: directory.description,
          website: directory.website,
          phoneNumber: directory.phoneNumber,
          email: directory.email,
          logoUrl: directory.logoUrl,
          videoGallery: directory.videoGallery || [],
          socialLinks: directory.socialLinks || {},
          companyId: newCompany.id,
          submittedById: newRecruiter.id,
          status: "APPROVED",
          isLiveEditable: true,
          approvedById: req.user.userId ?? req.user.id,
          approvedAt: new Date(),
        },
      });

      /* ==============================
         6ï¸âƒ£ AUDIT LOG
      ============================== */
      await tx.auditLog.create({
        data: {
          action: "FULL_DIRECTORY_CREATED",
          entity: "SupplierDirectory",
          entityId: newDirectory.id,
          userId: req.user.userId ?? req.user.id,
        },
      });

      return {
        company: newCompany,
        recruiter: newRecruiter,
        directory: newDirectory,
      };
    });

    res.status(201).json(result);

  } catch (error) {
    console.error("FULL SETUP ERROR:", error);

    if (error.code === "P2002") {
      return res.status(400).json({
        error: "Email already exists.",
      });
    }

    return res.status(400).json({
      error: error.message || "Failed to create full setup",
    });
  }
}
