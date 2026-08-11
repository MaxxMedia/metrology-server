/**
 * Idempotent seed for metrology category taxonomy (parents + subcategories).
 * Does not delete existing categories (articles, trending, etc.).
 *
 * Usage: node prisma/seedMetrologyCategories.js
 */
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

function slugify(text) {
  return String(text)
    .toLowerCase()
    .replace(/&/g, " and ")
    .replace(/[^a-z0-9\s-]/g, "")
    .trim()
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-");
}

/** @type {Record<string, string[]>} */
const TAXONOMY = {
  "Dimensional Metrology": [
    "Coordinate Measuring Machines (CMM)",
    "Portable CMM / Articulated Arms",
    "Height Gauges",
    "Profile Projectors",
    "Optical Comparators",
    "Vision Measuring Systems",
    "Measuring Microscopes",
    "Form & Contour Measurement",
    "Roundness & Cylindricity",
    "Surface Roughness",
    "Thread Measurement",
    "Gear Measurement",
    "Length & Angle Measurement",
  ],
  "Precision Measuring Instruments": [
    "Vernier Calipers",
    "Micrometers",
    "Dial Gauges",
    "Digital Gauges",
    "Bore Gauges",
    "Height Gauges",
    "Depth Gauges",
    "Gauge Blocks",
    "Plug Gauges",
    "Ring Gauges",
    "Snap Gauges",
    "Thread Gauges",
    "Feeler Gauges",
    "Precision Levels",
  ],
  "Coordinate & 3D Metrology": [
    "CMM",
    "Portable CMM",
    "3D Scanners",
    "Laser Scanners",
    "Structured Light Scanners",
    "Photogrammetry",
    "3D Measurement Software",
    "Reverse Engineering",
    "Point Cloud Processing",
    "3D Inspection",
  ],
  "Optical & Vision Metrology": [
    "Machine Vision Systems",
    "Video Measuring Machines",
    "Optical Measurement Systems",
    "Digital Microscopes",
    "Industrial Microscopes",
    "Image Measurement",
    "Automated Optical Inspection (AOI)",
    "Smart Cameras",
    "Vision Software",
  ],
  "Surface & Form Metrology": [
    "Surface Roughness",
    "Surface Texture",
    "Contour Measurement",
    "Roundness",
    "Cylindricity",
    "Straightness",
    "Flatness",
    "Parallelism",
    "Perpendicularity",
    "Profile Measurement",
    "Surface Topography",
  ],
  "Geometric Dimensioning & Tolerancing": [
    "GD&T Software",
    "GD&T Training",
    "Tolerance Analysis",
    "Datum Systems",
    "Geometric Tolerances",
    "Dimensional Tolerances",
    "SPC & Statistical Analysis",
    "Quality Inspection Software",
  ],
  "Calibration & Measurement Services": [
    "Dimensional Calibration",
    "Electrical Calibration",
    "Temperature Calibration",
    "Pressure Calibration",
    "Force Calibration",
    "Mass Calibration",
    "Torque Calibration",
    "Flow Calibration",
    "Humidity Calibration",
    "Calibration Laboratories",
    "NABL Accredited Laboratories",
    "On-site Calibration",
    "Calibration Management Software",
  ],
  "Material & Mechanical Testing": [
    "Hardness Testing",
    "Tensile Testing",
    "Compression Testing",
    "Impact Testing",
    "Fatigue Testing",
    "Universal Testing Machines",
    "Material Testing Machines",
    "Metallurgical Testing",
    "Non-Destructive Testing (NDT)",
  ],
  "NDT & Inspection": [
    "Ultrasonic Testing",
    "Radiographic Testing",
    "Magnetic Particle Testing",
    "Dye Penetrant Testing",
    "Eddy Current Testing",
    "X-Ray Inspection",
    "CT Inspection",
    "Visual Inspection",
    "Automated Inspection",
  ],
  "Manufacturing Metrology": [
    "In-process Measurement",
    "Shop-floor Metrology",
    "Automated Inspection",
    "Inline Inspection",
    "Post-process Inspection",
    "Tool Measurement",
    "Machine Tool Calibration",
    "Manufacturing Quality Control",
    "Closed-loop Manufacturing",
    "Digital Manufacturing Metrology",
  ],
  "Surface & 3D Scanning": [
    "Laser Scanning",
    "3D Optical Scanning",
    "White Light Scanning",
    "Blue Light Scanning",
    "Handheld 3D Scanners",
    "Industrial CT",
    "Surface Mapping",
    "Reverse Engineering",
  ],
  "Sensors & Measurement Technology": [
    "Laser Sensors",
    "Displacement Sensors",
    "Position Sensors",
    "Proximity Sensors",
    "Temperature Sensors",
    "Pressure Sensors",
    "Force Sensors",
    "Load Cells",
    "Torque Sensors",
    "Optical Sensors",
  ],
  "Process & Industrial Measurement": [
    "Temperature Measurement",
    "Pressure Measurement",
    "Flow Measurement",
    "Level Measurement",
    "Humidity Measurement",
    "Vacuum Measurement",
    "Vibration Measurement",
    "Force & Torque Measurement",
    "Electrical Measurement",
  ],
  "Electrical & Electronic Metrology": [
    "Digital Multimeters",
    "Oscilloscopes",
    "Electrical Calibrators",
    "Voltage Measurement",
    "Current Measurement",
    "Resistance Measurement",
    "Power & Energy Measurement",
    "RF & Microwave Measurement",
    "Electronic Test Equipment",
  ],
  "Metrology Software": [
    "CMM Software",
    "Measurement Software",
    "Inspection Software",
    "SPC Software",
    "Statistical Analysis",
    "Calibration Management",
    "Quality Management Software",
    "Digital Twin",
    "Digital Metrology",
    "AI-Based Inspection",
    "Automated Measurement Software",
  ],
  "Automation & Robotics": [
    "Robotic Inspection",
    "Automated CMM",
    "Robotic Measurement",
    "Automated Vision Inspection",
    "Inspection Cells",
    "Robot-mounted 3D Scanners",
    "Smart Factory Metrology",
    "Industry 4.0 Metrology",
  ],
  "Industry-Specific Metrology": [
    "Automotive",
    "Aerospace",
    "Defence",
    "Medical Devices",
    "Electronics & Semiconductors",
    "Machine Tools",
    "Die & Mould",
    "Precision Engineering",
    "Oil & Gas",
    "Energy & Power",
    "Railways",
    "Consumer Electronics",
    "Automotive Components",
    "Plastics",
    "Additive Manufacturing",
    "General Engineering",
  ],
};

async function upsertParent(name) {
  const slug = slugify(name);
  return prisma.category.upsert({
    where: { slug },
    update: { name, parentId: null },
    create: { name, slug, parentId: null },
  });
}

async function upsertChild(parent, childName) {
  const slug = `${parent.slug}-${slugify(childName)}`;
  return prisma.category.upsert({
    where: { slug },
    update: { name: childName, parentId: parent.id },
    create: { name: childName, slug, parentId: parent.id },
  });
}

async function main() {
  let parents = 0;
  let children = 0;

  for (const [parentName, childNames] of Object.entries(TAXONOMY)) {
    const parent = await upsertParent(parentName);
    parents += 1;
    for (const childName of childNames) {
      await upsertChild(parent, childName);
      children += 1;
    }
    console.log(`✓ ${parentName} (${childNames.length} subcategories)`);
  }

  console.log(`\nDone. Upserted ${parents} parents and ${children} subcategories.`);
}

main()
  .catch((err) => {
    console.error(err);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
