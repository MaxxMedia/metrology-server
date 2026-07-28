import * as industryTalkService from "../services/industryTalkService.js";

// ================================
// Create Industry Talk
// ================================
export const createIndustryTalk = async (req, res) => {
  try {
    const talk = await industryTalkService.createIndustryTalk({
      ...req.body,
      createdById: req.user.id,
    });

    return res.status(201).json({
      success: true,
      message: "Industry Talk created successfully.",
      data: talk,
    });
  } catch (error) {
    console.error("Create Industry Talk:", error);

    // Handle specific errors
    if (error.message === "Company not found") {
      return res.status(404).json({
        success: false,
        message: "Company not found. Please provide a valid company ID.",
      });
    }

    if (error.code === "P2002") {
      return res.status(409).json({
        success: false,
        message: "A talk with this slug already exists.",
      });
    }

    return res.status(500).json({
      success: false,
      message: error.message || "Failed to create industry talk.",
    });
  }
};

// ================================
// Update Industry Talk
// ================================
export const updateIndustryTalk = async (req, res) => {
  try {
    const { id } = req.params;

    // Check if talk exists first
    const existingTalk = await industryTalkService.getIndustryTalkById(Number(id));
    if (!existingTalk) {
      return res.status(404).json({
        success: false,
        message: "Industry Talk not found.",
      });
    }

    const talk = await industryTalkService.updateIndustryTalk(
      Number(id),
      req.body
    );

    return res.json({
      success: true,
      message: "Industry Talk updated successfully.",
      data: talk,
    });
  } catch (error) {
    console.error("Update Industry Talk:", error);

    if (error.message === "Company not found") {
      return res.status(404).json({
        success: false,
        message: "Company not found. Please provide a valid company ID.",
      });
    }

    if (error.code === "P2002") {
      return res.status(409).json({
        success: false,
        message: "A talk with this slug already exists.",
      });
    }

    return res.status(500).json({
      success: false,
      message: error.message || "Failed to update industry talk.",
    });
  }
};

// ================================
// Delete Industry Talk
// ================================
export const deleteIndustryTalk = async (req, res) => {
  try {
    const { id } = req.params;

    // Check if talk exists first
    const existingTalk = await industryTalkService.getIndustryTalkById(Number(id));
    if (!existingTalk) {
      return res.status(404).json({
        success: false,
        message: "Industry Talk not found.",
      });
    }

    await industryTalkService.deleteIndustryTalk(Number(id));

    return res.json({
      success: true,
      message: "Industry Talk deleted successfully.",
    });
  } catch (error) {
    console.error("Delete Industry Talk:", error);

    return res.status(500).json({
      success: false,
      message: error.message || "Failed to delete industry talk.",
    });
  }
};

// ================================
// Get All Industry Talks
// ================================
export const getIndustryTalks = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    
    // Validate pagination params
    if (page < 1 || limit < 1) {
      return res.status(400).json({
        success: false,
        message: "Invalid pagination parameters.",
      });
    }

    const data = await industryTalkService.getIndustryTalks({
      page,
      limit,
      search: req.query.search,
      status: req.query.status,
    });

    return res.json({
      success: true,
      ...data,
    });
  } catch (error) {
    console.error("Get Industry Talks:", error);

    return res.status(500).json({
      success: false,
      message: error.message || "Failed to fetch industry talks.",
    });
  }
};

// ================================
// Get By Id
// ================================
export const getIndustryTalkById = async (req, res) => {
  try {
    const { id } = req.params;

    // Validate ID is a number
    if (isNaN(id)) {
      return res.status(400).json({
        success: false,
        message: "Invalid ID format. Expected a number.",
      });
    }

    const talk = await industryTalkService.getIndustryTalkById(Number(id));

    if (!talk) {
      return res.status(404).json({
        success: false,
        message: "Industry Talk not found.",
      });
    }

    return res.json({
      success: true,
      data: talk,
    });
  } catch (error) {
    console.error("Get Industry Talk By ID:", error);

    return res.status(500).json({
      success: false,
      message: error.message || "Failed to fetch industry talk.",
    });
  }
};

// ================================
// Get By Slug
// ================================
export const getIndustryTalkBySlug = async (req, res) => {
  try {
    const { slug } = req.params;

    if (!slug) {
      return res.status(400).json({
        success: false,
        message: "Slug is required.",
      });
    }

    const talk = await industryTalkService.getIndustryTalkBySlug(slug);

    if (!talk) {
      return res.status(404).json({
        success: false,
        message: "Industry Talk not found.",
      });
    }

    // Increment views when fetched (optional - uncomment if needed)
    // await industryTalkService.incrementViews(talk.id);

    return res.json({
      success: true,
      data: talk,
    });
  } catch (error) {
    console.error("Get Industry Talk By Slug:", error);

    return res.status(500).json({
      success: false,
      message: error.message || "Failed to fetch industry talk.",
    });
  }
};

// ================================
// Publish
// ================================
export const publishIndustryTalk = async (req, res) => {
  try {
    const { id } = req.params;

    // Check if talk exists
    const existingTalk = await industryTalkService.getIndustryTalkById(Number(id));
    if (!existingTalk) {
      return res.status(404).json({
        success: false,
        message: "Industry Talk not found.",
      });
    }

    // Check if already published
    if (existingTalk.status === "PUBLISHED") {
      return res.status(400).json({
        success: false,
        message: "This talk is already published.",
      });
    }

    const talk = await industryTalkService.publishIndustryTalk(
      Number(id),
      req.user.id
    );

    return res.json({
      success: true,
      message: "Industry Talk published successfully.",
      data: talk,
    });
  } catch (error) {
    console.error("Publish Industry Talk:", error);

    return res.status(500).json({
      success: false,
      message: error.message || "Failed to publish industry talk.",
    });
  }
};

// ================================
// Save Draft
// ================================
export const saveDraftIndustryTalk = async (req, res) => {
  try {
    const { id } = req.params;

    // Check if talk exists
    const existingTalk = await industryTalkService.getIndustryTalkById(Number(id));
    if (!existingTalk) {
      return res.status(404).json({
        success: false,
        message: "Industry Talk not found.",
      });
    }

    const talk = await industryTalkService.saveDraft(Number(id));

    return res.json({
      success: true,
      message: "Saved as draft successfully.",
      data: talk,
    });
  } catch (error) {
    console.error("Save Draft Industry Talk:", error);

    return res.status(500).json({
      success: false,
      message: error.message || "Failed to save draft.",
    });
  }
};

// ================================
// Increment Views
// ================================
export const incrementIndustryTalkView = async (req, res) => {
  try {
    const { id } = req.params;

    // Check if talk exists
    const existingTalk = await industryTalkService.getIndustryTalkById(Number(id));
    if (!existingTalk) {
      return res.status(404).json({
        success: false,
        message: "Industry Talk not found.",
      });
    }

    const updatedTalk = await industryTalkService.incrementViews(Number(id));

    return res.json({
      success: true,
      message: "View count incremented.",
      data: {
        views: updatedTalk.views,
      },
    });
  } catch (error) {
    console.error("Increment Industry Talk View:", error);

    return res.status(500).json({
      success: false,
      message: error.message || "Failed to increment view count.",
    });
  }
};

// ================================
// Increment Shares
// ================================
export const incrementIndustryTalkShare = async (req, res) => {
  try {
    const { id } = req.params;

    // Check if talk exists
    const existingTalk = await industryTalkService.getIndustryTalkById(Number(id));
    if (!existingTalk) {
      return res.status(404).json({
        success: false,
        message: "Industry Talk not found.",
      });
    }

    const updatedTalk = await industryTalkService.incrementShares(Number(id));

    return res.json({
      success: true,
      message: "Share count incremented.",
      data: {
        shares: updatedTalk.shares,
      },
    });
  } catch (error) {
    console.error("Increment Industry Talk Share:", error);

    return res.status(500).json({
      success: false,
      message: error.message || "Failed to increment share count.",
    });
  }
};