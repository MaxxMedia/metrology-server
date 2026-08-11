import express from "express"
import { PrismaClient } from "@prisma/client"

const router = express.Router()
const prisma = new PrismaClient()

router.get("/event/:slug.ics", async (req, res) => {
  const { slug } = req.params

  const event = await prisma.event.findUnique({
    where: { slug },
  })

  if (!event) {
    return res.status(404).send("Event not found")
  }

  const start = new Date(event.startDate)
    .toISOString()
    .replace(/[-:]/g, "")
    .split(".")[0] + "Z"

  const end = new Date(event.endDate)
    .toISOString()
    .replace(/[-:]/g, "")
    .split(".")[0] + "Z"

  const ics = `
BEGIN:VCALENDAR
VERSION:2.0
PRODID:-//Mould Technology//Events//EN
BEGIN:VEVENT
UID:${event.slug}@mouldtechnology.com
DTSTAMP:${start}
DTSTART:${start}
DTEND:${end}
SUMMARY:${event.title}
DESCRIPTION:${event.description}
LOCATION:${event.location || ""}
END:VEVENT
END:VCALENDAR
`

  res.setHeader("Content-Type", "text/calendar")
  res.setHeader(
    "Content-Disposition",
    `attachment; filename="${event.slug}.ics"`
  )

  res.send(ics.trim())
})

export default router
