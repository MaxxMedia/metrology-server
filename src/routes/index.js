/**
 * Mount all API routers. ORDER MATTERS — more specific routes first.
 */
import postsRoutes from "../modules/content/posts.routes.js";
import authorsRoutes from "../modules/content/authors.routes.js";
import categoriesRoutes from "../modules/content/categories.routes.js";
import commentsRoutes from "../modules/content/comments.routes.js";
import authRoutes from "../modules/auth/auth.routes.js";
import uploadRoutes from "../modules/upload/upload.routes.js";
import jobsRoutes from "../modules/jobs/jobs.routes.js";
import companiesRoutes from "../modules/companies/companies.routes.js";
import adminCompaniesRoutes from "../modules/companies/adminCompanies.routes.js";
import applicationsRoutes from "../modules/jobs/applications.routes.js";
import recruitersRoutes from "../modules/recruiters/recruiters.routes.js";
import candidatesRoutes from "../modules/candidates/candidates.routes.js";
import recruiterDashboardRoutes from "../modules/recruiters/recruiterDashboard.routes.js";
import supplierDirectoryRoutes from "../modules/suppliers/supplierDirectories.routes.js";
import adminDirectoryRoutes from "../modules/admin/adminDirectories.routes.js";
import recruiterArticlesRoutes from "../modules/recruiters/recruiterArticles.routes.js";
import companyArticlesRoutes from "../modules/companies/companyArticles.routes.js";
import adminArticlesRoutes from "../modules/admin/adminArticles.routes.js";
import bannerRoutes from "../modules/banners/banner.routes.js";
import bannerUploadRoutes from "../modules/banners/bannerUpload.routes.js";
import eventRoutes from "../modules/events/events.routes.js";
import calendarRoutes from "../modules/events/calendar.routes.js";
import publicRoutes from "../modules/public/public.routes.js";
import magazineRoutes from "../modules/magazines/magazine.routes.js";
import adminUsersRoutes from "../modules/admin/adminUsers.routes.js";
import adminIndustriesRoutes from "../modules/admin/adminIndustry.routes.js";
import jobAlertsRoutes from "../modules/jobs/jobAlerts.routes.js";
import paymentsRoutes from "../modules/payments/payments.routes.js";
import adminAnalyticsRoutes from "../modules/admin/adminAnalytics.routes.js";
import contactRoutes from "../modules/marketing/contact.routes.js";
import newsletterRoutes from "../modules/marketing/newsletter.routes.js";
import leadRoutes from "../modules/marketing/leads.routes.js";
import quoteRoutes from "../modules/suppliers/quotes.routes.js";
import teamRoutes from "../modules/team/team.routes.js";
import companyTeamRoutes from "../modules/companies/companyTeam.routes.js";
import adminPackageRoutes from "../modules/admin/adminPackage.routes.js";
import candidateSkillsRoutes from "../modules/candidates/candidateSkills.routes.js";
import candidateEducationRoutes from "../modules/candidates/candidateEducation.routes.js";
import candidateProjectRoutes from "../modules/candidates/candidateProject.routes.js";
import candidateSocialRoutes from "../modules/candidates/candidateSocial.routes.js";
import candidateCertificationRoutes from "../modules/candidates/candidateCertification.routes.js";
import candidateLanguageRoutes from "../modules/candidates/candidateLanguage.routes.js";
import candidateAchievementRoutes from "../modules/candidates/candidateAchievement.routes.js";
import candidateInterestRoutes from "../modules/candidates/candidateInterest.routes.js";
import connectionRoutes from "../modules/connections/connection.routes.js";
import candidateResumeRoutes from "../modules/candidates/candidateResume.routes.js";
import companyConnectionRoutes from "../modules/companies/companyConnection.routes.js";
import candidateExperienceRoutes from "../modules/candidates/candidateExperience.routes.js";
import adminSubAdminRoutes from "../modules/admin/adminSubAdmin.routes.js";
import adminRoleRoutes from "../modules/admin/adminRole.routes.js";
import adminActivityRoutes from "../modules/admin/adminActivity.routes.js";
import adminPermissionRoutes from "../modules/admin/adminPermission.routes.js";
import industryTalkRoutes from "../modules/industryTalks/industryTalk.routes.js";

export function mountRoutes(app) {
  // Contact was historically mounted early (before health) — keep that order.
  app.use("/api/contact", contactRoutes);

  // COMPANY — specific before generic
  app.use("/api/companies", companyTeamRoutes);
  app.use("/api/companies", companyArticlesRoutes);
  app.use("/api/companies", companiesRoutes);

  app.use("/api/posts", postsRoutes);
  app.use("/api/authors", authorsRoutes);
  app.use("/api/categories", categoriesRoutes);
  app.use("/api/posts", commentsRoutes);
  app.use("/api/auth", authRoutes);
  app.use("/api/upload", uploadRoutes);
  app.use("/api/jobs", jobsRoutes);

  app.use("/api/companies", companyArticlesRoutes);
  app.use("/api/companies", companiesRoutes);
  app.use("/api/admin/companies", adminCompaniesRoutes);
  app.use("/api/applications", applicationsRoutes);
  app.use("/api/recruiters", recruitersRoutes);
  app.use("/api/candidates", candidatesRoutes);

  app.use("/api/candidate-skills", candidateSkillsRoutes);
  app.use("/api/candidate-education", candidateEducationRoutes);
  app.use("/api/candidate-projects", candidateProjectRoutes);
  app.use("/api/candidate-socials", candidateSocialRoutes);
  app.use("/api/candidate-certifications", candidateCertificationRoutes);
  app.use("/api/candidate-languages", candidateLanguageRoutes);
  app.use("/api/candidate-achievements", candidateAchievementRoutes);
  app.use("/api/candidate-interests", candidateInterestRoutes);
  app.use("/api/candidate-resume", candidateResumeRoutes);
  app.use("/api/candidate-experience", candidateExperienceRoutes);

  app.use("/api/recruiter", recruiterDashboardRoutes);
  app.use("/api/recruiter", recruiterArticlesRoutes);
  app.use("/api/team", teamRoutes);
  app.use("/api/suppliers", supplierDirectoryRoutes);
  app.use("/api/suppliers", quoteRoutes);

  console.log("🔵 Mounting admin package routes...");
  app.use("/api/admin", adminPackageRoutes);
  console.log("✅ Admin package routes mounted at /api/admin");

  app.use("/api/admin", adminDirectoryRoutes);
  app.use("/api/admin", adminArticlesRoutes);
  app.use("/api/admin", adminUsersRoutes);
  app.use("/api/admin", adminAnalyticsRoutes);
  app.use("/api/industry-talks", industryTalkRoutes);

  console.log("🔵 Mounting admin sub-admin (RBAC) routes...");
  app.use("/api/admin", adminSubAdminRoutes);
  console.log("✅ Admin sub-admin routes mounted at /api/admin");

  console.log("🔵 Mounting admin role (RBAC v2) routes...");
  app.use("/api/admin", adminRoleRoutes);
  console.log("✅ Admin role routes mounted at /api/admin");

  console.log("🔵 Mounting admin permission catalogue routes...");
  app.use("/api/admin", adminPermissionRoutes);
  console.log("✅ Admin permission routes mounted at /api/admin");

  console.log("🔵 Mounting admin activity routes...");
  app.use("/api/admin", adminActivityRoutes);
  console.log("✅ Admin activity routes mounted at /api/admin");

  app.use("/api/banners", bannerRoutes);
  app.use("/api/banners", bannerUploadRoutes);
  app.use("/api/events", eventRoutes);
  app.use("/api/calendar", calendarRoutes);
  app.use("/api", publicRoutes);
  app.use("/api/connections", connectionRoutes);
  app.use("/api/magazines", magazineRoutes);
  app.use("/api/job-alerts", jobAlertsRoutes);
  app.use("/api/payments", paymentsRoutes);
  app.use("/api", adminIndustriesRoutes);
  app.use("/api/newsletter", newsletterRoutes);
  app.use("/api/leads", leadRoutes);
  app.use("/api/quotes", quoteRoutes);
  app.use("/api/companies", companyConnectionRoutes);
}
