import bcrypt from "bcryptjs";
import { prisma } from "../../shared/lib/prisma.js";

export async function adminCreateRecruiter(req, res) {
  try {
    if (req.user.role?.toLowerCase() !== "admin") {
      return res.status(403).json({ error: "Admin only" });
    }

    const { email, password, username, companyId } = req.body;

    const hashedPassword = await bcrypt.hash(password, 10);

    const recruiter = await prisma.user.create({
      data: {
        email,
        password: hashedPassword,
        username,
        role: "recruiter",
        companyId: Number(companyId),
        emailVerified: true,
        isOnboarded: true,
      },
    });

    res.status(201).json(recruiter);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to create recruiter" });
  }
}
