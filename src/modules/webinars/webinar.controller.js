import slugify from "slugify";
import { prisma } from "../../shared/lib/prisma.js";

const WEBINAR_STATUSES = ["DRAFT", "PENDING", "APPROVED", "PUBLISHED", "REJECTED", "ARCHIVED"];
// Approved + published webinars are visible on the public site.
const PUBLIC_STATUSES = ["PUBLISHED", "APPROVED"];

function parseArrayField(value) {
  if (!value) return [];
  if (Array.isArray(value)) return value;
  try {
    const parsed = JSON.parse(value);
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

function shapeResources(resources) {
  return parseArrayField(resources).map((item) => ({
    title: item?.title || "",
    url: item?.fileUrl || item?.url || "",
    size: item?.fileSize || item?.size || "",
  }));
}

function normalizeResourcesInput(resources) {
  return parseArrayField(resources)
    .filter((item) => item?.title && (item?.fileUrl || item?.url))
    .map((item) => ({
      title: item.title,
      fileUrl: item.fileUrl || item.url,
      fileSize: item.fileSize || item.size || "",
    }));
}

async function getOrCreateWebinarCategory() {
  const slug = "webinars";
  const existing = await prisma.category.findUnique({ where: { slug } });
  if (existing) return existing;

  return prisma.category.create({
    data: {
      name: "Webinars",
      slug,
    },
  });
}

function shapeWebinar(webinar) {
  if (!webinar) return webinar;

  return {
    id: webinar.id,
    title: webinar.title,
    slug: webinar.slug,
    shortDescription: webinar.shortDescription || "",
    fullDescription: webinar.fullDescription || "",
    heroImage: webinar.heroImage || "",
    thumbnail: webinar.thumbnail || webinar.heroImage || "",
    speakerName: webinar.speakerName,
    speakerDesignation: webinar.speakerDesignation || "",
    speakerCompany: webinar.speakerCompany || "",
    speakerImage: webinar.speakerImage || "",
    speakerLinkedin: webinar.speakerLinkedin || "",
    registrationUrl: webinar.registrationUrl || "",
    meetingUrl: webinar.meetingUrl || "",
    youtubeUrl: webinar.youtubeUrl || null,
    startDate: webinar.startDate ? webinar.startDate.toISOString() : null,
    endDate: webinar.endDate ? webinar.endDate.toISOString() : null,
    duration: webinar.duration ?? 60,
    language: webinar.language || "English",
    certificateAvailable: webinar.certificateAvailable ?? false,
    maxSeats: webinar.maxSeats ?? null,
    registeredSeats: webinar.registeredSeats ?? 0,
    seoTitle: webinar.seoTitle || "",
    seoDescription: webinar.seoDescription || "",
    agenda: parseArrayField(webinar.agenda),
    learningPoints: parseArrayField(webinar.learningPoints),
    resources: shapeResources(webinar.resources),
    status: webinar.status,
    featured: webinar.featured ?? false,
    isOnDemand: webinar.isOnDemand ?? false,
    rejectionReason: webinar.rejectionReason || null,
    views: webinar.views ?? 0,
    publishedAt: webinar.publishedAt ? webinar.publishedAt.toISOString() : null,
    category: webinar.category
      ? {
          id: webinar.category.id,
          name: webinar.category.name,
          slug: webinar.category.slug,
        }
      : { name: "Webinars", slug: "webinars" },
  };
}

async function uniqueSlug(title, excludeId) {
  const baseSlug = slugify(title, { lower: true, strict: true }) || "webinar";
  let slug = baseSlug;
  let suffix = 1;

  while (true) {
    const existing = await prisma.webinar.findUnique({ where: { slug } });
    if (!existing || existing.id === excludeId) return slug;
    slug = `${baseSlug}-${suffix++}`;
  }
}

function buildWebinarData(body, { categoryId, slug, status, userId }) {
  return {
    title: body.title?.trim(),
    slug,
    shortDescription: body.shortDescription?.trim() || null,
    fullDescription: body.fullDescription?.trim() || null,
    heroImage: body.heroImage?.trim() || null,
    thumbnail: body.thumbnail?.trim() || null,
    speakerName: body.speakerName?.trim(),
    speakerDesignation: body.speakerDesignation?.trim() || null,
    speakerCompany: body.speakerCompany?.trim() || null,
    speakerImage: body.speakerImage?.trim() || null,
    speakerLinkedin: body.speakerLinkedin?.trim() || null,
    registrationUrl: body.registrationUrl?.trim() || null,
    meetingUrl: body.meetingUrl?.trim() || null,
    youtubeUrl: body.youtubeUrl?.trim() || null,
    startDate: body.startDate ? new Date(body.startDate) : null,
    endDate: body.endDate ? new Date(body.endDate) : null,
    duration: body.duration ? Number(body.duration) : 60,
    language: body.language?.trim() || "English",
    certificateAvailable: Boolean(body.certificateAvailable),
    maxSeats: body.maxSeats ? Number(body.maxSeats) : null,
    seoTitle: body.seoTitle?.trim() || null,
    seoDescription: body.seoDescription?.trim() || null,
    agenda: normalizeAgenda(body.agenda),
    learningPoints: parseArrayField(body.learningPoints).filter(Boolean),
    resources: normalizeResourcesInput(body.resources),
    categoryId,
    ...(status ? { status } : {}),
    ...(userId ? { createdById: userId } : {}),
  };
}

function normalizeAgenda(agenda) {
  return parseArrayField(agenda)
    .filter((item) => item?.title)
    .map((item) => ({
      time: item.time || "",
      title: item.title,
    }));
}

async function findWebinarById(id) {
  const webinarId = Number(id);
  if (!Number.isFinite(webinarId)) return null;

  return prisma.webinar.findUnique({
    where: { id: webinarId },
    include: { category: true },
  });
}

export async function getAdminWebinarStats(req, res) {
  try {
    const grouped = await prisma.webinar.groupBy({
      by: ["status"],
      _count: { _all: true },
    });

    const stats = { total: 0 };
    for (const status of WEBINAR_STATUSES) stats[status] = 0;

    for (const row of grouped) {
      stats[row.status] = row._count._all;
      stats.total += row._count._all;
    }

    return res.json(stats);
  } catch (err) {
    console.error("getAdminWebinarStats:", err);
    return res.status(500).json({ error: "Failed to load webinar stats" });
  }
}

export async function listAdminWebinars(req, res) {
  try {
    const page = Math.max(1, Number(req.query.page) || 1);
    const limit = Math.min(50, Math.max(1, Number(req.query.limit) || 10));
    const status = req.query.status?.trim();
    const search = req.query.search?.trim();

    const where = {};
    if (status && WEBINAR_STATUSES.includes(status)) where.status = status;
    if (search) {
      where.OR = [
        { title: { contains: search, mode: "insensitive" } },
        { speakerName: { contains: search, mode: "insensitive" } },
      ];
    }

    const [total, rows] = await Promise.all([
      prisma.webinar.count({ where }),
      prisma.webinar.findMany({
        where,
        orderBy: [{ updatedAt: "desc" }],
        skip: (page - 1) * limit,
        take: limit,
        include: { category: true },
      }),
    ]);

    return res.json({
      data: rows.map(shapeWebinar),
      pagination: {
        total,
        totalPages: Math.max(1, Math.ceil(total / limit)),
      },
    });
  } catch (err) {
    console.error("listAdminWebinars:", err);
    return res.status(500).json({ error: "Failed to load webinars" });
  }
}

export async function getAdminWebinarById(req, res) {
  try {
    const webinar = await findWebinarById(req.params.id);
    if (!webinar) return res.status(404).json({ error: "Webinar not found" });
    return res.json(shapeWebinar(webinar));
  } catch (err) {
    console.error("getAdminWebinarById:", err);
    return res.status(500).json({ error: "Failed to load webinar" });
  }
}

export async function createWebinar(req, res) {
  try {
    const { title, speakerName, startDate } = req.body;
    if (!title?.trim() || !speakerName?.trim() || !startDate) {
      return res.status(400).json({ error: "Title, speaker name and start date are required." });
    }

    const category = await getOrCreateWebinarCategory();
    const slug = await uniqueSlug(title);

    const webinar = await prisma.webinar.create({
      data: buildWebinarData(req.body, {
        categoryId: category.id,
        slug,
        status: "DRAFT",
        userId: req.user?.id,
      }),
      include: { category: true },
    });

    return res.status(201).json(shapeWebinar(webinar));
  } catch (err) {
    console.error("createWebinar:", err);
    return res.status(500).json({ error: "Failed to create webinar" });
  }
}

export async function updateWebinar(req, res) {
  try {
    const existing = await findWebinarById(req.params.id);
    if (!existing) return res.status(404).json({ error: "Webinar not found" });

    const { title, speakerName, startDate } = req.body;
    if (!title?.trim() || !speakerName?.trim() || !startDate) {
      return res.status(400).json({ error: "Title, speaker name and start date are required." });
    }

    const slug =
      title.trim() !== existing.title
        ? await uniqueSlug(title, existing.id)
        : existing.slug;

    const webinar = await prisma.webinar.update({
      where: { id: existing.id },
      data: buildWebinarData(req.body, { categoryId: existing.categoryId, slug }),
      include: { category: true },
    });

    return res.json(shapeWebinar(webinar));
  } catch (err) {
    console.error("updateWebinar:", err);
    return res.status(500).json({ error: "Failed to update webinar" });
  }
}

export async function deleteWebinar(req, res) {
  try {
    const existing = await findWebinarById(req.params.id);
    if (!existing) return res.status(404).json({ error: "Webinar not found" });

    await prisma.webinar.delete({ where: { id: existing.id } });
    return res.json({ success: true });
  } catch (err) {
    console.error("deleteWebinar:", err);
    return res.status(500).json({ error: "Failed to delete webinar" });
  }
}

export async function approveWebinar(req, res) {
  try {
    const existing = await findWebinarById(req.params.id);
    if (!existing) return res.status(404).json({ error: "Webinar not found" });

    const webinar = await prisma.webinar.update({
      where: { id: existing.id },
      data: {
        status: "PUBLISHED",
        publishedAt: new Date(),
        approvedById: req.user?.id ?? null,
        rejectionReason: null,
      },
      include: { category: true },
    });

    return res.json(shapeWebinar(webinar));
  } catch (err) {
    console.error("approveWebinar:", err);
    return res.status(500).json({ error: "Failed to approve webinar" });
  }
}

export async function rejectWebinar(req, res) {
  try {
    const existing = await findWebinarById(req.params.id);
    if (!existing) return res.status(404).json({ error: "Webinar not found" });

    const reason = req.body?.reason?.trim();
    if (!reason) return res.status(400).json({ error: "Rejection reason is required." });

    const webinar = await prisma.webinar.update({
      where: { id: existing.id },
      data: {
        status: "REJECTED",
        rejectionReason: reason,
      },
      include: { category: true },
    });

    return res.json(shapeWebinar(webinar));
  } catch (err) {
    console.error("rejectWebinar:", err);
    return res.status(500).json({ error: "Failed to reject webinar" });
  }
}

export async function publishWebinar(req, res) {
  try {
    const existing = await findWebinarById(req.params.id);
    if (!existing) return res.status(404).json({ error: "Webinar not found" });

    const webinar = await prisma.webinar.update({
      where: { id: existing.id },
      data: {
        status: "PUBLISHED",
        publishedAt: new Date(),
        approvedById: existing.approvedById ?? req.user?.id ?? null,
      },
      include: { category: true },
    });

    return res.json(shapeWebinar(webinar));
  } catch (err) {
    console.error("publishWebinar:", err);
    return res.status(500).json({ error: "Failed to publish webinar" });
  }
}

export async function draftWebinar(req, res) {
  try {
    const existing = await findWebinarById(req.params.id);
    if (!existing) return res.status(404).json({ error: "Webinar not found" });

    const webinar = await prisma.webinar.update({
      where: { id: existing.id },
      data: {
        status: "DRAFT",
        publishedAt: null,
      },
      include: { category: true },
    });

    return res.json(shapeWebinar(webinar));
  } catch (err) {
    console.error("draftWebinar:", err);
    return res.status(500).json({ error: "Failed to move webinar to draft" });
  }
}

export async function toggleFeatureWebinar(req, res) {
  try {
    const existing = await findWebinarById(req.params.id);
    if (!existing) return res.status(404).json({ error: "Webinar not found" });

    const webinar = await prisma.webinar.update({
      where: { id: existing.id },
      data: { featured: !existing.featured },
      include: { category: true },
    });

    return res.json(shapeWebinar(webinar));
  } catch (err) {
    console.error("toggleFeatureWebinar:", err);
    return res.status(500).json({ error: "Failed to update featured flag" });
  }
}

export async function toggleOnDemandWebinar(req, res) {
  try {
    const existing = await findWebinarById(req.params.id);
    if (!existing) return res.status(404).json({ error: "Webinar not found" });

    const webinar = await prisma.webinar.update({
      where: { id: existing.id },
      data: { isOnDemand: !existing.isOnDemand },
      include: { category: true },
    });

    return res.json(shapeWebinar(webinar));
  } catch (err) {
    console.error("toggleOnDemandWebinar:", err);
    return res.status(500).json({ error: "Failed to update on-demand flag" });
  }
}

export async function listPublicWebinars(req, res) {
  try {
    const rows = await prisma.webinar.findMany({
      where: { status: { in: PUBLIC_STATUSES } },
      orderBy: [{ featured: "desc" }, { startDate: "desc" }],
      include: { category: true },
    });

    return res.json({ data: rows.map(shapeWebinar) });
  } catch (err) {
    console.error("listPublicWebinars:", err);
    return res.status(500).json({ error: "Failed to load webinars" });
  }
}

export async function getPublicWebinarBySlug(req, res) {
  try {
    const webinar = await prisma.webinar.findFirst({
      where: {
        slug: req.params.slug,
        status: { in: PUBLIC_STATUSES },
      },
      include: { category: true },
    });

    if (!webinar) return res.status(404).json({ error: "Webinar not found" });

    await prisma.webinar.update({
      where: { id: webinar.id },
      data: { views: { increment: 1 } },
    });

    return res.json(shapeWebinar(webinar));
  } catch (err) {
    console.error("getPublicWebinarBySlug:", err);
    return res.status(500).json({ error: "Failed to load webinar" });
  }
}

export async function getRelatedWebinars(req, res) {
  try {
    const current = await prisma.webinar.findFirst({
      where: {
        slug: req.params.slug,
        status: { in: PUBLIC_STATUSES },
      },
      select: { id: true, categoryId: true },
    });

    if (!current) return res.json([]);

    const related = await prisma.webinar.findMany({
      where: {
        status: { in: PUBLIC_STATUSES },
        id: { not: current.id },
        ...(current.categoryId ? { categoryId: current.categoryId } : {}),
      },
      orderBy: [{ featured: "desc" }, { startDate: "desc" }],
      take: 4,
      include: { category: true },
    });

    return res.json(
      related.map((item) => ({
        slug: item.slug,
        title: item.title,
        thumbnail: item.thumbnail || item.heroImage || "",
        image: item.thumbnail || item.heroImage || "",
        meta: [item.speakerName, item.speakerCompany].filter(Boolean).join(" · "),
      }))
    );
  } catch (err) {
    console.error("getRelatedWebinars:", err);
    return res.status(500).json({ error: "Failed to load related webinars" });
  }
}
