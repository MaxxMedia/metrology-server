import prisma from "../../shared/lib/prisma.js";

async function assertValidParentId(parentId) {
  if (parentId === undefined || parentId === null || parentId === "") {
    return null;
  }

  const id = Number(parentId);
  if (!Number.isInteger(id) || id <= 0) {
    const err = new Error("Invalid parentId");
    err.status = 400;
    throw err;
  }

  const parent = await prisma.category.findUnique({ where: { id } });
  if (!parent) {
    const err = new Error("Parent category not found");
    err.status = 404;
    throw err;
  }
  if (parent.parentId != null) {
    const err = new Error("Cannot nest under a subcategory (only one level allowed)");
    err.status = 400;
    throw err;
  }

  return id;
}

const categoryCountInclude = {
  children: {
    orderBy: { name: "asc" },
    include: {
      _count: {
        select: { posts: true, subPosts: true },
      },
    },
  },
  _count: {
    select: { posts: true, subPosts: true },
  },
};

export const getCategories = async (req, res) => {
  try {
    const parentsOnly =
      req.query.parentsOnly === "1" || req.query.parentsOnly === "true";

    if (parentsOnly) {
      const categories = await prisma.category.findMany({
        where: { parentId: null },
        orderBy: { name: "asc" },
        include: categoryCountInclude,
      });
      return res.json(categories);
    }

    const categories = await prisma.category.findMany({
      orderBy: [{ parentId: "asc" }, { name: "asc" }],
      include: categoryCountInclude,
    });

    res.json(categories);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

export const createCategory = async (req, res) => {
  try {
    const { name, slug } = req.body;

    if (!name || !slug) {
      return res.status(400).json({ error: "Name and slug are required" });
    }

    const parentId = await assertValidParentId(req.body.parentId);

    const category = await prisma.category.create({
      data: { name, slug, parentId },
      include: {
        children: { orderBy: { name: "asc" } },
        parent: true,
      },
    });

    res.status(201).json(category);
  } catch (err) {
    console.error("Error creating category:", err);
    if (err.status) {
      return res.status(err.status).json({ error: err.message });
    }
    if (err.code === "P2002") {
      return res.status(409).json({ error: "Slug must be unique" });
    }
    res.status(500).json({ error: "Failed to create category" });
  }
};

export const updateCategory = async (req, res) => {
  try {
    const id = Number(req.params.id);
    if (!Number.isInteger(id) || id <= 0) {
      return res.status(400).json({ error: "Invalid category id" });
    }

    const { name, slug } = req.body;
    if (!name || !slug) {
      return res.status(400).json({ error: "Name and slug are required" });
    }

    const existing = await prisma.category.findUnique({
      where: { id },
      include: { children: { select: { id: true } } },
    });
    if (!existing) {
      return res.status(404).json({ error: "Category not found" });
    }

    let parentId = existing.parentId;
    if ("parentId" in req.body) {
      parentId = await assertValidParentId(req.body.parentId);
      if (parentId === id) {
        return res.status(400).json({ error: "Category cannot be its own parent" });
      }
      // Promoting/demoting: if this category has children, it must stay top-level
      if (parentId != null && existing.children.length > 0) {
        return res.status(400).json({
          error: "Cannot nest a category that already has subcategories",
        });
      }
    }

    const category = await prisma.category.update({
      where: { id },
      data: { name, slug, parentId },
      include: {
        children: { orderBy: { name: "asc" } },
        parent: true,
      },
    });

    res.json(category);
  } catch (err) {
    console.error("Error updating category:", err);
    if (err.status) {
      return res.status(err.status).json({ error: err.message });
    }
    if (err.code === "P2002") {
      return res.status(409).json({ error: "Slug must be unique" });
    }
    res.status(500).json({ error: err.message || "Failed to update category" });
  }
};

export const deleteCategory = async (req, res) => {
  try {
    const id = Number(req.params.id);
    if (!Number.isInteger(id) || id <= 0) {
      return res.status(400).json({ error: "Invalid category id" });
    }

    const existing = await prisma.category.findUnique({
      where: { id },
      include: {
        children: { select: { id: true } },
        _count: {
          select: { posts: true, subPosts: true },
        },
      },
    });

    if (!existing) {
      return res.status(404).json({ error: "Category not found" });
    }

    if (existing.children.length > 0) {
      return res.status(400).json({
        error: "Cannot delete category that has subcategories. Delete subcategories first.",
      });
    }

    if (existing._count.posts > 0 || existing._count.subPosts > 0) {
      return res.status(400).json({
        error: "Cannot delete category linked to existing posts",
      });
    }

    await prisma.category.delete({ where: { id } });
    res.json({ message: "Category deleted successfully" });
  } catch (err) {
    console.error("Error deleting category:", err);
    if (err.code === "P2003") {
      return res
        .status(400)
        .json({ error: "Cannot delete category linked to existing posts" });
    }
    res.status(500).json({ error: err.message || "Failed to delete category" });
  }
};
