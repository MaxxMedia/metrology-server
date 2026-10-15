// Whitelist of topic slugs that recruiters are permitted to publish articles into.
// ⚠️  Keep in sync with ACTIVE_TOPIC_SLUGS in metrology-frontend/lib/topic.ts
export const ARTICLE_TOPIC_SLUGS = [
    // Active slugs shown in the frontend topic dropdown
    "dimensional-metrology",
    "precision-measuring-instruments",
    "coordinate-3d-metrology",
    // Legacy slugs — kept so existing articles are not orphaned
    "machine",
    "cuttingtools",
    "dies-moulds-and-tooling",
    "metrologyandquality",
    "factory-automation",
    "CAD/CAM/CAE",
    "manufacturing-technologies",
]