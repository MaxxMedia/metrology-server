import prisma from "../../shared/lib/prisma.js";
import slugify from "slugify";

// /* =========================================
//    GET FULL INDUSTRY TREE
// ========================================= */
// export async function getIndustryTree(req, res) {
//   try {
//     const industries = await prisma.industry.findMany({
//       where: { parentId: null },
//       include: {
//         children: {
//           include: {
//             children: true,
//           },
//         },
//       },
//       orderBy: { name: "asc" },
//     });

//     res.json(industries);
//   } catch (error) {
//     console.error("GET INDUSTRIES ERROR:", error);
//     res.status(500).json({ error: "Failed to fetch industries" });
//   }
// }

// /* =========================================
//    CREATE INDUSTRY (ADMIN ONLY)
// ========================================= */
// export async function createIndustry(req, res) {
//   if (req.user.role?.toLowerCase() !== "admin") {
//     return res.status(403).json({ error: "Admin only" });
//   }

//   const { name, parentId } = req.body;

//   try {
//     const slug = slugify(name, { lower: true, strict: true });

//     const existing = await prisma.industry.findUnique({
//       where: { slug },
//     });

//     if (existing) {
//       return res.status(400).json({ error: "Industry already exists" });
//     }

//     const industry = await prisma.industry.create({
//       data: {
//         name,
//         slug,
//         parentId: parentId ? Number(parentId) : null,
//       },
//     });

//     res.status(201).json(industry);
//   } catch (error) {
//     console.error("CREATE INDUSTRY ERROR:", error);
//     res.status(500).json({ error: "Failed to create industry" });
//   }
// }


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
   GET CHILDREN OF A SPECIFIC INDUSTRY
========================================= */
export async function getIndustryChildren(req, res) {
  try {
    const { id } = req.params;

    const children = await prisma.industry.findMany({
      where: { parentId: Number(id) },
      orderBy: { name: "asc" },
    });

    res.json(children); // returns [] if leaf node — frontend uses this to finalize selection
  } catch (error) {
    console.error("GET INDUSTRY CHILDREN ERROR:", error);
    res.status(500).json({ error: "Failed to fetch industry children" });
  }
}

/* =========================================
   CREATE INDUSTRY (ADMIN ONLY)
========================================= */
export async function createIndustry(req, res) {
  if (req.user.role?.toLowerCase() !== "admin") {
    return res.status(403).json({ error: "Admin only" });
  }

  const { name, parentId } = req.body;

  try {
    const slug = slugify(name, { lower: true, strict: true });

    const existing = await prisma.industry.findUnique({
      where: { slug },
    });

    if (existing) {
      return res.status(400).json({ error: "Industry already exists" });
    }

    const industry = await prisma.industry.create({
      data: {
        name,
        slug,
        parentId: parentId ? Number(parentId) : null,
      },
    });

    res.status(201).json(industry);
  } catch (error) {
    console.error("CREATE INDUSTRY ERROR:", error);
    res.status(500).json({ error: "Failed to create industry" });
  }
}