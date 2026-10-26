/** Centralizes shared prisma rules and data helpers for backend features. */
import { PrismaClient } from "@prisma/client";

export const prisma = new PrismaClient();
export default prisma;
