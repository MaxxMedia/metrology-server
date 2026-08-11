/**
 * Seed featured posts + 5 posts per parent category.
 * Idempotent by slug (upsert).
 *
 * Usage: node prisma/seedPosts.js
 */
import { PrismaClient } from "@prisma/client";
import crypto from "crypto";

const prisma = new PrismaClient();

function uid() {
  return crypto.randomUUID();
}

function paragraph(html) {
  return { id: uid(), type: "paragraph", content: html };
}

function heading(text, level = 2) {
  return { id: uid(), type: "heading", text, level };
}

function quote(text) {
  return { id: uid(), type: "quote", quote: text };
}

function image(imageUrl, caption = "", alt = "") {
  return { id: uid(), type: "image", imageUrl, caption, alt };
}

const PLACEHOLDER_IMAGES = [
  "https://res.cloudinary.com/dlkuk7rok/image/upload/v1786347104/mould-tech/images/clskmqpimykbz2v87egv.avif",
  "https://res.cloudinary.com/dlkuk7rok/image/upload/v1786355651/mould-tech/images/ib8pxdzv8wgnk0uwzhwd.jpg",
  "https://res.cloudinary.com/dlkuk7rok/image/upload/v1786428495/mould-tech/images/of7llep7xxhykxhsjvhb.png",
  "https://res.cloudinary.com/dlkuk7rok/image/upload/v1786440168/mould-tech/images/htpo5quztutqqnxberx5.jpg",
  "https://res.cloudinary.com/dlkuk7rok/image/upload/v1786355541/mould-tech/images/ys5jgpzxtupl5uuc3kvj.jpg",
];

/** 5 featured posts — same parent category, different subcategories */
function buildFeaturedPosts(parent, children, authorId) {
  const pick = (i) => children[i % children.length];

  return [
    {
      title: "The Quantum Leap: How AI is Securing the Post-Quantum Internet",
      slug: "the-quantum-leap-how-ai-is-securing-the-post-quantum-internet",
      badge: "Featured",
      excerpt:
        "As quantum computers edge closer to breaking current encryption standards, a new alliance between AI and quantum physics is emerging. Discover how machine learning is accelerating error correction and driving the race for unhackable, post-quantum cryptography in 2026.",
      imageUrl: PLACEHOLDER_IMAGES[0],
      categoryId: parent.id,
      subCategoryId: pick(0).id,
      authorId,
      contentBlocks: [
        heading("The Ticking Clock of Quantum Decryption", 1),
        paragraph(
          "<p>By August 2026, the theoretical threat of quantum decryption has become a boardroom reality. With Google's Willow chip demonstrating verifiable quantum advantage and Microsoft activating the first topological qubit processor, the timeline for \"Q-Day\"—the moment current RSA encryption becomes obsolete—has shortened dramatically.</p>"
        ),
        heading("AI: The Unlikely Hero of Quantum Stability", 2),
        paragraph(
          "<p>Quantum systems are notoriously fragile, prone to errors from the slightest environmental noise. However, recent breakthroughs in August 2026 reveal that Artificial Intelligence is solving the very instability that plagues quantum hardware.</p><ul><li><strong>Error Correction at Scale:</strong> AI-driven algorithms from NVIDIA and Google DeepMind decode error rates significantly faster than traditional methods.</li><li><strong>Predictive Maintenance:</strong> Machine learning models predict qubit fluctuations in real-time.</li><li><strong>Material Discovery:</strong> Generative AI has identified new topoconductor materials.</li></ul>"
        ),
        quote(
          "The companies that win in 2026 won't just use AI; they will be built on it. In quantum security, AI is the shield against the very technology it helps advance. — Dr. Marcus Thorne"
        ),
        heading("The Post-Quantum Cryptography (PQC) Mandate", 2),
        paragraph(
          "<p>Following the NIST mandate and Executive Order 14412 signed in June 2026, enterprise adoption of PQC standards has surged. AI agents are now autonomously auditing legacy codebases, identifying vulnerable encryption keys, and deploying lattice-based cryptography replacements.</p>"
        ),
        heading("What This Means for Business Leaders", 2),
        paragraph(
          "<p>Organizations must audit data lifespan for \"harvest now, decrypt later\" threats, adopt crypto-agility, and invest in AI-driven security for continuous threat monitoring.</p>"
        ),
      ],
    },
    {
      title: "Powder Metallurgy Trends 2026: AI & Precision Manufacturing",
      slug: "powder-metallurgy-trends-2026-ai-precision-manufacturing",
      badge: "Featured",
      excerpt:
        "As the global market surges toward USD 9.3 billion in 2026, powder metallurgy is redefining industrial production. Discover how AI-driven quality control, closed-loop powder recycling, and near-net-shape manufacturing are enabling lightweight aerospace components and sustainable automotive solutions.",
      imageUrl: PLACEHOLDER_IMAGES[1],
      categoryId: parent.id,
      subCategoryId: pick(1).id,
      authorId,
      facebookUrl: "https://facebook.com/events/pm-trends-2026",
      linkedinUrl: "https://linkedin.com/company/advanced-materials",
      email: "research@advancedmaterials.example.com",
      contentBlocks: [
        heading("The 2026 Paradigm Shift: From Prototyping to Mass Production", 1),
        paragraph(
          "<p>By August 2026, powder metallurgy (PM) has transitioned from a niche prototyping tool to the backbone of industrial mass production. The global additive manufacturing market with metal powders has reached USD 45.6 billion, driven by a 21% CAGR.</p>"
        ),
        heading("AI-Driven Quality Control & Predictive Maintenance", 2),
        paragraph(
          "<p>Leading manufacturers utilize real-time machine learning models to monitor sintering temperatures and powder flowability, reducing scrap rates by over 40%.</p>"
        ),
        quote(
          "The companies that win in 2026 won't just use AI; they will be built on it. In powder metallurgy, AI is the shield against waste and the engine of precision. — Dr. Marcus Thorne"
        ),
        heading("The Circular Economy & Sustainable Powder Reuse", 2),
        paragraph(
          "<p>Advanced sieving and reconditioning technologies now allow manufacturers to reuse up to 95% of unmelted powder without compromising mechanical properties.</p>"
        ),
        image(PLACEHOLDER_IMAGES[4], "Closed-loop powder recycling in modern PM plants"),
        heading("Aerospace & The Rise of Complex Geometries", 2),
        paragraph(
          "<p>The aerospace sector now accounts for 44.2% of the metal powder AM market, enabling complex internal cooling channels and lattice structures impossible with casting or machining.</p>"
        ),
      ],
    },
    {
      title: "The Circular Revolution: 95% Powder Reuse in Modern Manufacturing",
      slug: "the-circular-revolution-95-percent-powder-reuse-in-modern-manufacturing",
      badge: "Sustainability",
      excerpt:
        "Closed-loop powder recycling is becoming the new industrial standard. Learn how manufacturers are reclaiming up to 95% of unused metal powder while meeting 2026 ESG mandates and cutting carbon footprints by 30%.",
      imageUrl: PLACEHOLDER_IMAGES[4],
      categoryId: parent.id,
      subCategoryId: pick(2).id,
      authorId,
      contentBlocks: [
        heading("Why Powder Reuse Matters in 2026", 1),
        paragraph(
          "<p>With ESG mandates effective early this year, closed-loop powder recycling has become standard practice across precision manufacturing. Sustainability is no longer optional — it is a competitive advantage.</p>"
        ),
        heading("How 95% Reuse Is Achieved", 2),
        paragraph(
          "<p>Advanced sieving, plasma reconditioning, and AI-assisted powder characterization enable reuse of unmelted powder while preserving particle size distribution and mechanical properties.</p>"
        ),
        quote(
          "Circular manufacturing is not a cost center — it is the path to resilient supply chains and lower unit costs."
        ),
        heading("Impact on Cost and Carbon", 2),
        paragraph(
          "<p>Early adopters report a 30% reduction in the carbon footprint of PM components versus traditional subtractive machining, alongside measurable material cost savings.</p>"
        ),
      ],
    },
    {
      title: "The Future of Frontend Development: Building Faster Web Experiences",
      slug: "the-future-of-frontend-development-building-faster-and-smarter-web-experiences",
      badge: "Machine",
      excerpt:
        "Frontend development is evolving rapidly with AI, modern frameworks, and smarter developer tools transforming how websites and applications are designed, built, and delivered.",
      imageUrl: PLACEHOLDER_IMAGES[2],
      categoryId: parent.id,
      subCategoryId: pick(3).id,
      authorId,
      facebookUrl: "https://facebook.com/plastekgroup",
      linkedinUrl: "https://linkedin.com/company/plastek-group",
      twitterUrl: "https://twitter.com/plastekgroup",
      youtubeUrl: "https://www.youtube.com/watch?v=Otim2mDjsYM",
      email: "chandanaprakash02@gmail.com",
      whatsappNumber: "+919876543210",
      contentBlocks: [
        heading("A New Era of Frontend Delivery", 1),
        paragraph(
          "<p>Frontend development has changed dramatically over the past few years. What once required large amounts of custom code can now be achieved using modern frameworks, reusable components, powerful development tools, and AI-assisted workflows.</p>"
        ),
        heading("AI-Assisted Engineering", 2),
        paragraph(
          "<p>From component generation to performance budgets and accessibility audits, AI tooling is compressing the path from idea to production-ready UI.</p>"
        ),
        heading("What Teams Should Prioritize", 2),
        paragraph(
          "<p>Invest in design systems, edge delivery, and measurable Core Web Vitals. The winning frontend teams in 2026 ship faster without sacrificing quality.</p>"
        ),
      ],
    },
    {
      title: "Global EV Battery Supply Chain Summit 2026",
      slug: "global-ev-battery-supply-chain-summit-2026-securing-critical-minerals",
      badge: "Event",
      excerpt:
        "Join global leaders in Berlin for the definitive summit on securing lithium, cobalt, and nickel supply chains. Explore new AI-driven recycling technologies and the impact of the 2026 Critical Minerals Act on EV production.",
      imageUrl: PLACEHOLDER_IMAGES[3],
      categoryId: parent.id,
      subCategoryId: pick(4).id,
      authorId,
      facebookUrl: "https://facebook.com/events/ev-supply-chain-summit-2026",
      linkedinUrl: "https://linkedin.com/events/global-ev-battery-summit",
      twitterUrl: "https://twitter.com/i/spaces/ev-minerals-2026",
      youtubeUrl: "https://youtube.com/watch?v=dummy_ev_summit_promo",
      email: "register@evsupplychain-summit.example.com",
      whatsappNumber: "+49 151 2345 6789",
      contentBlocks: [
        heading("The Critical Minerals Bottleneck", 1),
        paragraph(
          "<p>As we approach Q4 2026, global demand for electric vehicles has outpaced the supply of critical battery minerals. The newly enacted <strong>Global Critical Minerals Act</strong> mandates stricter sourcing ethics and domestic processing quotas.</p>"
        ),
        heading("Summit Highlights", 2),
        quote(
          "The future of mobility depends not just on innovation in the lab, but on resilience in the supply chain. We must close the loop on battery materials. — Dr. Marcus Thorne"
        ),
        paragraph(
          "<p>Over three days, attendees will engage in high-level panels covering AI-driven exploration, urban mining, and geopolitical strategy for EV supply chains.</p><ol><li>AI-Driven Exploration</li><li>Urban Mining &amp; Direct Lithium Recovery</li><li>Geopolitical Strategy &amp; Localization</li></ol>"
        ),
        image(
          "https://res.cloudinary.com/dlkuk7rok/image/upload/v1786440416/mould-tech/images/ngztie8nbtzexkvfjdsa.avif",
          "EV Battery Supply Chain Summit 2026"
        ),
        heading("Who Should Attend", 2),
        paragraph(
          "<p>This event is essential for supply chain directors, sustainability officers, policymakers, and investors in the EV ecosystem.</p>"
        ),
      ],
    },
  ];
}

function buildCategoryFillerPosts(parent, children, authorId) {
  const topics = [
    {
      badge: "Featured",
      titleSuffix: "Advances in Precision Measurement",
      excerpt:
        "Explore the latest advances shaping precision measurement workflows, quality assurance, and digital inspection across industrial environments.",
    },
    {
      badge: "Insight",
      titleSuffix: "Quality Control Best Practices for 2026",
      excerpt:
        "Practical quality-control strategies that reduce scrap, improve repeatability, and connect shop-floor metrology to enterprise analytics.",
    },
    {
      badge: "Guide",
      titleSuffix: "Digital Transformation on the Shop Floor",
      excerpt:
        "How manufacturers are digitizing inspection cells, connecting sensors, and building closed-loop feedback into production lines.",
    },
    {
      badge: "Analysis",
      titleSuffix: "Market Outlook and Technology Roadmaps",
      excerpt:
        "A concise market outlook covering investment priorities, standards shifts, and technology roadmaps for the year ahead.",
    },
    {
      badge: "Briefing",
      titleSuffix: "Standards, Compliance, and Audit Readiness",
      excerpt:
        "What compliance teams need to know about evolving standards, audit trails, and documentation for measurement systems.",
    },
  ];

  return topics.map((topic, index) => {
    const child = children[index % children.length];
    const slug = `seed-${parent.slug}-${index + 1}-${child.slug}`.slice(0, 180);
    return {
      title: `${parent.name}: ${topic.titleSuffix}`,
      slug,
      badge: topic.badge,
      excerpt: topic.excerpt,
      imageUrl: PLACEHOLDER_IMAGES[index % PLACEHOLDER_IMAGES.length],
      categoryId: parent.id,
      subCategoryId: child.id,
      authorId,
      contentBlocks: [
        heading(`${topic.titleSuffix}`, 1),
        paragraph(
          `<p>This briefing covers key developments in <strong>${parent.name}</strong>, with a focus on <strong>${child.name}</strong>. Teams are combining instrumentation, software, and AI-assisted analysis to improve throughput and measurement confidence.</p>`
        ),
        heading("Key Takeaways", 2),
        paragraph(
          `<p>Organizations investing in ${child.name.toLowerCase()} capabilities within ${parent.name.toLowerCase()} are seeing faster inspection cycles, cleaner audit trails, and better correlation between process parameters and product quality.</p>`
        ),
        quote(
          `In ${parent.name}, the winners treat ${child.name} as a strategic capability — not just a lab function.`
        ),
        heading("What to Watch Next", 2),
        paragraph(
          "<p>Expect deeper automation, tighter software integration, and more portable systems that bring lab-grade confidence to the production floor.</p>"
        ),
      ],
    };
  });
}

async function upsertPost(data) {
  const payload = {
    title: data.title,
    badge: data.badge,
    excerpt: data.excerpt,
    content: data.content || "",
    contentBlocks: data.contentBlocks || [],
    imageUrl: data.imageUrl,
    facebookUrl: data.facebookUrl ?? null,
    linkedinUrl: data.linkedinUrl ?? null,
    twitterUrl: data.twitterUrl ?? null,
    youtubeUrl: data.youtubeUrl ?? null,
    email: data.email ?? null,
    whatsappNumber: data.whatsappNumber ?? null,
    authorId: data.authorId,
    categoryId: data.categoryId,
    subCategoryId: data.subCategoryId,
    status: "APPROVED",
    publishedAt: data.publishedAt ? new Date(data.publishedAt) : new Date(),
  };

  return prisma.post.upsert({
    where: { slug: data.slug },
    update: payload,
    create: { slug: data.slug, ...payload },
  });
}

async function main() {
  let author = await prisma.author.findFirst({ orderBy: { id: "asc" } });
  if (!author) {
    author = await prisma.author.create({
      data: {
        name: "Dr. Marcus Thorne",
        bio: "Industry analyst covering advanced manufacturing, AI, and industrial technology.",
      },
    });
    console.log(`Created author #${author.id}`);
  }

  const parents = await prisma.category.findMany({
    where: { parentId: null },
    include: {
      children: { orderBy: { name: "asc" } },
    },
    orderBy: { name: "asc" },
  });

  // Prefer Manufacturing Metrology for the 5 featured posts; fallback to first parent with children
  let featuredParent =
    parents.find((p) => p.slug.includes("manufacturing-metrology") && p.children.length >= 5) ||
    parents.find((p) => p.children.length >= 5);

  if (!featuredParent) {
    throw new Error("No parent category with at least 5 subcategories found. Run seedMetrologyCategories.js first.");
  }

  console.log(
    `\nFeatured posts → category "${featuredParent.name}" (#${featuredParent.id}) with different subcategories`
  );

  const featured = buildFeaturedPosts(featuredParent, featuredParent.children, author.id);
  for (const post of featured) {
    const saved = await upsertPost(post);
    const sub = featuredParent.children.find((c) => c.id === post.subCategoryId);
    console.log(`  ✓ [${post.badge}] ${saved.title} → ${sub?.name || "—"}`);
  }

  // 5 posts per parent category that has subcategories
  let fillerCount = 0;
  for (const parent of parents) {
    if (!parent.children.length) {
      console.log(`  · skip "${parent.name}" (no subcategories)`);
      continue;
    }

    // Featured parent already has the 5 featured posts; still add 5 filler posts with distinct slugs
    const fillers = buildCategoryFillerPosts(parent, parent.children, author.id);
    for (const post of fillers) {
      await upsertPost(post);
      fillerCount += 1;
    }
    console.log(`  ✓ ${parent.name}: ${fillers.length} seeded posts`);
  }

  const total = await prisma.post.count();
  console.log(`\nDone. Featured: ${featured.length}, category fillers upserted: ${fillerCount}, total posts in DB: ${total}`);
}

main()
  .catch((err) => {
    console.error(err);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
