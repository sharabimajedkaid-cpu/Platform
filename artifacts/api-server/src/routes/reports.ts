import { Router, type IRouter } from "express";
import { desc, eq } from "drizzle-orm";
import {
  db,
  reports,
  students,
  courses,
  assessmentSheets,
  type Report,
} from "@workspace/db";
import {
  requireAuth,
  requireRole,
  isStaff,
  teacherCourseIds,
  type AuthUser,
} from "../lib/auth";
import { generateReportsForSheet } from "../lib/reports";
import { deliverReport, flushPendingDeliveries } from "../lib/google";

const router: IRouter = Router();

async function scopeReports(
  user: AuthUser,
  rows: Report[],
): Promise<Report[]> {
  if (isStaff(user)) return rows;
  if (user.role === "teacher") {
    const ids = await teacherCourseIds(user);
    return rows.filter((r) => r.audience === "teacher" && ids.includes(r.courseId));
  }
  if (user.role === "parent" && user.parentId) {
    const kids = await db
      .select()
      .from(students)
      .where(eq(students.parentId, user.parentId));
    const kidIds = new Set(kids.map((k) => k.id));
    return rows.filter((r) => r.audience === "parent" && kidIds.has(r.studentId));
  }
  return [];
}

router.get("/v1/reports", requireAuth, async (req, res) => {
  const u = req.user!;
  const sheetId = req.query.sheetId ? Number(req.query.sheetId) : null;
  let rows = await db.select().from(reports).orderBy(desc(reports.createdAt));
  if (sheetId) rows = rows.filter((r) => r.sheetId === sheetId);
  rows = await scopeReports(u, rows);

  const studs = await db.select().from(students);
  const studMap = new Map(studs.map((s) => [s.id, s.name]));
  const crs = await db.select().from(courses);
  const crsMap = new Map(crs.map((c) => [c.id, c.name]));
  const out = rows.map((r) => ({
    ...r,
    studentName: studMap.get(r.studentId) ?? null,
    courseName: crsMap.get(r.courseId) ?? null,
  }));
  return res.json({ reports: out });
});

router.post("/v1/reports/generate", requireAuth, async (req, res) => {
  const u = req.user!;
  const sheetId = Number(req.body?.sheetId);
  if (!sheetId) return res.status(400).json({ message: "sheetId required" });
  const [sheet] = await db
    .select()
    .from(assessmentSheets)
    .where(eq(assessmentSheets.id, sheetId))
    .limit(1);
  if (!sheet) return res.status(404).json({ message: "sheet not found" });
  if (!isStaff(u) && !(await teacherCourseIds(u)).includes(sheet.courseId))
    return res.status(403).json({ message: "No access" });
  const r = await generateReportsForSheet(sheetId);
  return res.json(r);
});

router.patch(
  "/v1/reports/:id",
  requireAuth,
  requireRole("admin", "supervisor"),
  async (req, res) => {
    const id = Number(req.params.id);
    const { body, level, recipientEmail } = req.body ?? {};
    const set: Record<string, unknown> = {
      updatedAt: new Date(),
      status: "edited",
    };
    if (body !== undefined) set.body = body;
    if (level !== undefined) set.level = level;
    if (recipientEmail !== undefined) set.recipientEmail = recipientEmail;
    const [row] = await db
      .update(reports)
      .set(set)
      .where(eq(reports.id, id))
      .returning();
    return res.json({ report: row });
  },
);

router.post("/v1/reports/flush", requireAuth, requireRole("admin", "supervisor"), async (_req, res) => {
  return res.json(await flushPendingDeliveries());
});

router.post(
  "/v1/reports/send-sheet",
  requireAuth,
  requireRole("admin", "supervisor"),
  async (req, res) => {
    const sheetId = Number(req.body?.sheetId);
    const [sheet] = await db
      .select()
      .from(assessmentSheets)
      .where(eq(assessmentSheets.id, sheetId))
      .limit(1);
    if (!sheet) return res.status(404).json({ message: "sheet not found" });
    const rows = await db
      .select()
      .from(reports)
      .where(eq(reports.sheetId, sheetId));
    for (const r of rows) await deliverReport(r, sheet.termLabel);
    return res.json({ sent: rows.length });
  },
);

router.post(
  "/v1/reports/:id/send",
  requireAuth,
  requireRole("admin", "supervisor"),
  async (req, res) => {
    const id = Number(req.params.id);
    const [r] = await db
      .select()
      .from(reports)
      .where(eq(reports.id, id))
      .limit(1);
    if (!r) return res.status(404).json({ message: "not found" });
    const [sheet] = await db
      .select()
      .from(assessmentSheets)
      .where(eq(assessmentSheets.id, r.sheetId))
      .limit(1);
    const result = await deliverReport(r, sheet?.termLabel ?? "Term");
    return res.json(result);
  },
);

export default router;
