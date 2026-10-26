/** Centralizes shared activity logger rules and data helpers for backend features. */
/** Persists an activity event for later audit and analytics views. */
export async function logActivity(
    prisma,
    {
        userId,
        action,
        module,
        entityId = null,
    }
) {
    try {
        await prisma.auditLog.create({
            data: {
                userId,
                action,
                entity: module,
                entityId,
            },
        });
    } catch (err) {
        console.error("Activity log write failed:", err);
    }
}