import prisma from "../../shared/lib/prisma.js";
import slugify from "slugify";

const ADMIN_ROLES = ["admin", "super_admin"];

function assertAdmin(req, res) {
  const role = req.user?.role?.toLowerCase();
  if (!role || !ADMIN_ROLES.includes(role)) {
    res.status(403).json({ error: "Admin only" });
    return false;
  }
  return true;
}

async function assertValidParentId(parentId, industryId = null) {
  if (parentId === undefined || parentId === null || parentId === "") {
    return null;
  }

  const id = Number(parentId);
  if (!Number.isInteger(id) || id <= 0) {
    const err = new Error("Invalid parentId");
    err.status = 400;
    throw err;
  }

  if (industryId != null && id === industryId) {
    const err = new Error("Industry cannot be its own parent");
    err.status = 400;
    throw err;
  }

  const parent = await prisma.industry.findUnique({ where: { id } });
  if (!parent) {
    const err = new Error("Parent industry not found");
    err.status = 404;
    throw err;
  }

  return id;
}

/* =========================================
   GET ROOT INDUSTRIES (parentId = null)
========================================= */
export async function getIndustryTree(req, res) {
  try {
    const industries = await prisma.industry.findMany({
      where: { parentId: null },
      orderBy: { name: "asc" },
    });

    res.json(industries);
  } catch (error) {
    console.error("GET INDUSTRIES ERROR:", error);
    res.status(500).json({ error: "Failed to fetch industries" });
  }
}

/* =========================================
   GET ALL INDUSTRIES (flat — admin UI)
========================================= */
export async function getAllIndustries(req, res) {
  try {
    const industries = await prisma.industry.findMany({
      orderBy: [{ parentId: "asc" }, { name: "asc" }],
      include: {
        _count: {
          select: {
            other_Industry: true,
            Company: true,
            IndustryTalk: true,
          },
        },
      },
    });

    res.json(industries);
  } catch (error) {
    console.error("GET ALL INDUSTRIES ERROR:", error);
    res.status(500).json({ error: "Failed to fetch industries" });
  }
}

/* =========================================
   GET CHILDREN OF A SPECIFIC INDUSTRY
========================================= */
export async function getIndustryChildren(req, res) {
  try {
    const { id } = req.params;

    const children = await prisma.industry.findMany({
      where: { parentId: Number(id) },
      orderBy: { name: "asc" },
    });

    res.json(children);
  } catch (error) {
    console.error("GET INDUSTRY CHILDREN ERROR:", error);
    res.status(500).json({ error: "Failed to fetch industry children" });
  }
}

/* =========================================
   CREATE INDUSTRY (ADMIN ONLY)
========================================= */
export async function createIndustry(req, res) {
  if (!assertAdmin(req, res)) return;

  const { name, parentId } = req.body;

  if (!name?.trim()) {
    return res.status(400).json({ error: "Name is required" });
  }

  try {
    const slug = slugify(name, { lower: true, strict: true });
    const resolvedParentId = await assertValidParentId(parentId);

    const existing = await prisma.industry.findUnique({
      where: { slug },
    });

    if (existing) {
      return res.status(400).json({ error: "Industry already exists" });
    }

    const industry = await prisma.industry.create({
      data: {
        name: name.trim(),
        slug,
        parentId: resolvedParentId,
      },
    });

    res.status(201).json(industry);
  } catch (error) {
    console.error("CREATE INDUSTRY ERROR:", error);
    if (error.status) {
      return res.status(error.status).json({ error: error.message });
    }
    res.status(500).json({ error: "Failed to create industry" });
  }
}

/* =========================================
   UPDATE INDUSTRY (ADMIN ONLY)
========================================= */
export async function updateIndustry(req, res) {
  if (!assertAdmin(req, res)) return;

  const id = Number(req.params.id);
  if (!Number.isInteger(id) || id <= 0) {
    return res.status(400).json({ error: "Invalid industry id" });
  }

  const { name, slug: slugInput, parentId } = req.body;

  if (!name?.trim()) {
    return res.status(400).json({ error: "Name is required" });
  }

  try {
    const existing = await prisma.industry.findUnique({
      where: { id },
      include: {
        other_Industry: { select: { id: true } },
      },
    });

    if (!existing) {
      return res.status(404).json({ error: "Industry not found" });
    }

    let resolvedParentId = existing.parentId;
    if ("parentId" in req.body) {
      resolvedParentId = await assertValidParentId(parentId, id);
      if (resolvedParentId != null && existing.other_Industry.length > 0) {
        return res.status(400).json({
          error: "Cannot nest an industry that already has sub-industries",
        });
      }
    }

    const slug =
      slugInput?.trim() ||
      slugify(name, { lower: true, strict: true });

    const industry = await prisma.industry.update({
      where: { id },
      data: {
        name: name.trim(),
        slug,
        parentId: resolvedParentId,
      },
    });

    res.json(industry);
  } catch (error) {
    console.error("UPDATE INDUSTRY ERROR:", error);
    if (error.status) {
      return res.status(error.status).json({ error: error.message });
    }
    if (error.code === "P2002") {
      return res.status(409).json({ error: "Slug must be unique" });
    }
    res.status(500).json({ error: "Failed to update industry" });
  }
}

/* =========================================
   DELETE INDUSTRY (ADMIN ONLY)
========================================= */
export async function deleteIndustry(req, res) {
  if (!assertAdmin(req, res)) return;

  const id = Number(req.params.id);
  if (!Number.isInteger(id) || id <= 0) {
    return res.status(400).json({ error: "Invalid industry id" });
  }

  try {
    const existing = await prisma.industry.findUnique({
      where: { id },
      include: {
        other_Industry: { select: { id: true } },
        _count: {
          select: {
            Company: true,
            IndustryTalk: true,
          },
        },
      },
    });

    if (!existing) {
      return res.status(404).json({ error: "Industry not found" });
    }

    if (existing.other_Industry.length > 0) {
      return res.status(400).json({
        error: "Cannot delete industry that has sub-industries. Delete children first.",
      });
    }

    if (existing._count.Company > 0 || existing._count.IndustryTalk > 0) {
      return res.status(400).json({
        error: "Cannot delete industry linked to companies or industry talks",
      });
    }

    await prisma.industry.delete({ where: { id } });
    res.json({ message: "Industry deleted" });
  } catch (error) {
    console.error("DELETE INDUSTRY ERROR:", error);
    res.status(500).json({ error: "Failed to delete industry" });
  }
}