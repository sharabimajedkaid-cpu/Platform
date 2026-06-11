import { eq } from "drizzle-orm";
import cron from "node-cron";
import {
  db,
  courses,
  teachers,
  assessmentSheets,
  calendarEvents,
  tasks,
  notifications,
  messages,
  reports,
} from "@workspace/db";
import { addDaysISO, todayISO } from "./teaching-days";
import { generateReportsForSheet } from "./reports";
import { deliverReport } from "./google";
import { logger } from "./logger";

async function notifyIfNew(values: {
  audienceRole: string;
  recipientEmail?: string | null;
  title: string;
  body: string;
  category: string;
  icon: string;
  dedupeKey: string;
}): Promise<void> {
  const [existing] = await db
    .select({ id: notifications.id })
    .from(notifications)
    .where(eq(notifications.dedupeKey, values.dedupeKey))
    .limit(1);
  if (existing) return;
  await db.insert(notifications).values(values);
}

async function messageIfNew(values: {
  threadKey: string;
  toEmail?: string | null;
  toRole?: string | null;
  body: string;
  dedupeKey: string;
}): Promise<void> {
  const [existing] = await db
    .select({ id: messages.id })
    .from(messages)
    .where(eq(messages.dedupeKey, values.dedupeKey))
    .limit(1);
  if (existing) return;
  await db.insert(messages).values(values);
}

// Ensure each sheet has its milestone calendar event, reminder calendar event,
// and a teacher task. Idempotent via dedupeKey unique constraints.
export async function reconcileSheets(): Promise<void> {
  const sheets = await db.select().from(assessmentSheets);
  for (const sheet of sheets) {
    const [course] = await db
      .select()
      .from(courses)
      .where(eq(courses.id, sheet.courseId))
      .limit(1);
    if (!course) continue;
    const teacher = course.teacherId
      ? (
          await db
            .select()
            .from(teachers)
            .where(eq(teachers.id, course.teacherId))
            .limit(1)
        )[0]
      : null;

    const phaseLabel = sheet.phase === "first" ? "First-Week" : "Last-Week";
    const reminderDate = addDaysISO(sheet.dueDate, -1);

    await db
      .insert(calendarEvents)
      .values({
        title: `${phaseLabel} Assessment — ${course.name}`,
        description: `Teaching day ${sheet.teachingDay}. Submit the ${phaseLabel.toLowerCase()} assessment sheet.`,
        date: sheet.dueDate,
        type: "milestone",
        courseId: course.id,
        dedupeKey: `cal:milestone:${sheet.id}`,
      })
      .onConflictDoNothing();

    await db
      .insert(calendarEvents)
      .values({
        title: `Reminder: ${phaseLabel} Assessment — ${course.name}`,
        description: `Reminder — the ${phaseLabel.toLowerCase()} assessment sheet is due tomorrow (teaching day ${sheet.teachingDay}).`,
        date: reminderDate,
        type: "reminder",
        courseId: course.id,
        dedupeKey: `cal:reminder:${sheet.id}`,
      })
      .onConflictDoNothing();

    await db
      .insert(tasks)
      .values({
        title: `Fill ${phaseLabel} assessment — ${course.name}`,
        description: `Score every student 1–5 on each criterion, then submit. Due ${sheet.dueDate} (teaching day ${sheet.teachingDay}).`,
        assigneeType: "teacher",
        assigneeId: teacher?.id ?? null,
        courseId: course.id,
        sheetId: sheet.id,
        dueDate: sheet.dueDate,
        type: "assessment_reminder",
        status: sheet.status === "open" ? "pending" : "done",
        dedupeKey: `task:${sheet.id}`,
      })
      .onConflictDoNothing();
  }
}

// Fire reminders for open sheets whose reminder date has arrived, and mark
// sheets overdue. Idempotent via dedupeKey existence checks.
export async function runDueReminders(): Promise<number> {
  const today = todayISO();
  const sheets = await db.select().from(assessmentSheets);
  let fired = 0;
  for (const sheet of sheets) {
    if (sheet.status !== "open") continue;
    const reminderDate = addDaysISO(sheet.dueDate, -1);
    if (reminderDate > today) continue; // not yet time

    const [course] = await db
      .select()
      .from(courses)
      .where(eq(courses.id, sheet.courseId))
      .limit(1);
    if (!course) continue;
    const teacher = course.teacherId
      ? (
          await db
            .select()
            .from(teachers)
            .where(eq(teachers.id, course.teacherId))
            .limit(1)
        )[0]
      : null;

    const phaseLabel = sheet.phase === "first" ? "First-Week" : "Last-Week";
    const overdue = sheet.dueDate < today;
    const title = overdue
      ? `Overdue: ${phaseLabel} assessment — ${course.name}`
      : `Reminder: ${phaseLabel} assessment — ${course.name}`;
    const body = overdue
      ? `The ${phaseLabel.toLowerCase()} assessment sheet for ${course.name} was due ${sheet.dueDate}. Please submit it.`
      : `The ${phaseLabel.toLowerCase()} assessment sheet for ${course.name} is due ${sheet.dueDate} (teaching day ${sheet.teachingDay}).`;

    await notifyIfNew({
      audienceRole: "teacher",
      recipientEmail: teacher?.email ?? null,
      title,
      body,
      category: "assessment",
      icon: "📋",
      dedupeKey: `notif:reminder:${sheet.id}`,
    });
    await notifyIfNew({
      audienceRole: "admin",
      title,
      body,
      category: "assessment",
      icon: "📋",
      dedupeKey: `notif:reminder:admin:${sheet.id}`,
    });
    await messageIfNew({
      threadKey: teacher?.email ?? "system",
      toEmail: teacher?.email ?? null,
      toRole: "teacher",
      body: `${title} — ${body}`,
      dedupeKey: `msg:reminder:${sheet.id}`,
    });
    fired++;
  }
  return fired;
}

// On/after the milestone day, if the sheet is submitted and reports haven't
// been generated yet, generate + deliver them, and announce readiness.
export async function runMilestones(): Promise<number> {
  const today = todayISO();
  const sheets = await db.select().from(assessmentSheets);
  let processed = 0;
  for (const sheet of sheets) {
    if (sheet.status === "open") continue;
    if (sheet.reportsGeneratedAt) continue;
    if (sheet.dueDate > today) continue;

    await generateReportsForSheet(sheet.id);
    const sheetReports = await db
      .select()
      .from(reports)
      .where(eq(reports.sheetId, sheet.id));
    for (const r of sheetReports) await deliverReport(r, sheet.termLabel);

    const [course] = await db
      .select()
      .from(courses)
      .where(eq(courses.id, sheet.courseId))
      .limit(1);
    await notifyIfNew({
      audienceRole: "admin",
      title: `Reports ready — ${course?.name ?? "course"}`,
      body: `Assessment reports for ${course?.name ?? "the course"} have been generated and queued for delivery.`,
      category: "assessment",
      icon: "✅",
      dedupeKey: `notif:reportready:${sheet.id}`,
    });
    processed++;
  }
  return processed;
}

export async function tick(): Promise<{
  reminders: number;
  milestones: number;
}> {
  await reconcileSheets();
  const reminders = await runDueReminders();
  const milestones = await runMilestones();
  logger.info({ reminders, milestones }, "scheduler tick complete");
  return { reminders, milestones };
}

export function startScheduler(): void {
  // Daily at 06:00 server time.
  cron.schedule("0 6 * * *", () => {
    tick().catch((err) => logger.error({ err }, "scheduled tick failed"));
  });
  logger.info("assessment scheduler started (daily 06:00)");
}
