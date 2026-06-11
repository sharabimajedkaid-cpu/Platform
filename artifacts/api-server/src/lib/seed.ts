import { sql } from "drizzle-orm";
import {
  db,
  teachers,
  parents,
  students,
  courses,
  criteria,
  assessmentSheets,
  dailyMonitoring,
  appUsers,
} from "@workspace/db";
import { nthTeachingDayISO } from "./teaching-days";
import { logger } from "./logger";

const CRITERIA = [
  { key: "speaking", labelEn: "Speaking", labelAr: "المحادثة" },
  { key: "reading", labelEn: "Reading", labelAr: "القراءة" },
  { key: "writing", labelEn: "Writing", labelAr: "الكتابة" },
  { key: "listening", labelEn: "Listening", labelAr: "الاستماع" },
  { key: "pronunciation", labelEn: "Pronunciation", labelAr: "النطق" },
  { key: "spelling", labelEn: "Spelling", labelAr: "التهجئة" },
  { key: "homework", labelEn: "HW", labelAr: "الواجب المنزلي" },
  { key: "punctuality", labelEn: "Punctuality", labelAr: "الالتزام بالمواعيد" },
  { key: "concentration", labelEn: "Concentration", labelAr: "التركيز" },
  { key: "confidence", labelEn: "Confidence", labelAr: "الثقة بالنفس" },
  { key: "atmosphere", labelEn: "Atmosphere", labelAr: "التفاعل والأجواء" },
];

const TERM_LABEL = "Term 3 — 2026";
const WEEKDAYS = [0, 1, 2, 3, 4]; // Sun–Thu

// Plus-addressed Gmail so every demo report is delivered to the authorized
// britishce44@gmail.com inbox while staying a distinct recipient address.
const inbox = (tag: string) => `britishce44+${tag}@gmail.com`;

interface TeacherSeed {
  login: string;
  name: string;
  tag: string;
  course: {
    name: string;
    level: string;
    termStartDate: string;
    students: { name: string; level: string; parent: string; parentTag: string }[];
  };
}

const TEACHERS: TeacherSeed[] = [
  {
    login: "suhair.almojahid",
    name: "Suhair Al-Mojahid",
    tag: "suhair",
    course: {
      name: "Gogo's Adventures — Level 3",
      level: "Gogo 3",
      termStartDate: "2026-05-17",
      students: [
        { name: "Ahmed Al-Sufyani", level: "Gogo 3", parent: "Mr. Al-Sufyani", parentTag: "sufyani" },
        { name: "Maryam Al-Adeeb", level: "Gogo 3", parent: "Mrs. Al-Adeeb", parentTag: "adeeb" },
        { name: "Yousef Al-Hakimi", level: "Gogo 3", parent: "Mr. Al-Hakimi", parentTag: "hakimi" },
        { name: "Layla Al-Mikhlafi", level: "Gogo 3", parent: "Mrs. Al-Mikhlafi", parentTag: "mikhlafi" },
        { name: "Omar Al-Saqqaf", level: "Gogo 3", parent: "Mr. Al-Saqqaf", parentTag: "saqqaf" },
      ],
    },
  },
  {
    login: "waad.alhammadi",
    name: "Waad Al-Hammadi",
    tag: "waad",
    course: {
      name: "Speakout — Intermediate",
      level: "Intermediate",
      termStartDate: "2026-06-01",
      students: [
        { name: "Fatima Al-Qadhi", level: "Intermediate", parent: "Mr. Al-Qadhi", parentTag: "qadhi" },
        { name: "Hani Al-Shar'abi", level: "Intermediate", parent: "Mrs. Al-Shar'abi", parentTag: "sharabi" },
        { name: "Noor Al-Dhubhani", level: "Intermediate", parent: "Mr. Al-Dhubhani", parentTag: "dhubhani" },
        { name: "Salem Al-Wesabi", level: "Intermediate", parent: "Mrs. Al-Wesabi", parentTag: "wesabi" },
      ],
    },
  },
];

const MONITORING_SNIPPETS = [
  "Participated actively and answered most questions correctly.",
  "Was a little distracted today but completed the in-class task.",
  "Excellent pronunciation practice; volunteered to read aloud.",
  "Struggled with new vocabulary; needs revision at home.",
  "Confident in group conversation and helped a classmate.",
  "Arrived late and missed the warm-up activity.",
];

export async function seedIfEmpty(): Promise<void> {
  const [{ count }] = await db
    .select({ count: sql<number>`count(*)::int` })
    .from(courses);
  if (count > 0) {
    logger.info({ courses: count }, "Seed skipped — data already present");
    return;
  }

  logger.info("Seeding assessment demo data…");

  // Criteria
  await db.insert(criteria).values(
    CRITERIA.map((c, i) => ({ ...c, orderIndex: i, active: true })),
  );

  const userRows: {
    email: string;
    password: string;
    name: string;
    role: "admin" | "supervisor" | "teacher" | "student" | "parent";
    teacherId: number | null;
    parentId: number | null;
    studentId: number | null;
  }[] = [
    { email: "britishce44@gmail.com", password: "admin123", name: "Admin Britishce44", role: "admin", teacherId: null, parentId: null, studentId: null },
    { email: "supervisor@britishce44.edu", password: "supervisor123", name: "Supervisor B44", role: "supervisor", teacherId: null, parentId: null, studentId: null },
  ];

  for (const t of TEACHERS) {
    const [teacher] = await db
      .insert(teachers)
      .values({ name: t.name, email: inbox(t.tag) })
      .returning();

    const [course] = await db
      .insert(courses)
      .values({
        name: t.course.name,
        level: t.course.level,
        teacherId: teacher.id,
        termLabel: TERM_LABEL,
        termStartDate: t.course.termStartDate,
        teachingWeekdays: WEEKDAYS,
      })
      .returning();

    userRows.push({
      email: t.login,
      password: "teacher123",
      name: t.name,
      role: "teacher",
      teacherId: teacher.id,
      parentId: null,
      studentId: null,
    });

    for (const s of t.course.students) {
      const [parent] = await db
        .insert(parents)
        .values({ name: s.parent, email: inbox(s.parentTag), locale: "ar" })
        .returning();
      const [student] = await db
        .insert(students)
        .values({
          name: s.name,
          courseId: course.id,
          parentId: parent.id,
          level: s.level,
        })
        .returning();

      userRows.push({
        email: inbox(s.parentTag),
        password: "parent123",
        name: s.parent,
        role: "parent",
        teacherId: null,
        parentId: parent.id,
        studentId: null,
      });

      // Daily AI monitoring summaries (second input for reports).
      await db.insert(dailyMonitoring).values([
        {
          studentId: student.id,
          courseId: course.id,
          date: t.course.termStartDate,
          summary: MONITORING_SNIPPETS[student.id % MONITORING_SNIPPETS.length],
          rating: 3 + (student.id % 3),
        },
        {
          studentId: student.id,
          courseId: course.id,
          date: nthTeachingDayISO(t.course.termStartDate, WEEKDAYS, 3),
          summary:
            MONITORING_SNIPPETS[(student.id + 2) % MONITORING_SNIPPETS.length],
          rating: 2 + (student.id % 4),
        },
      ]);
    }

    // Two sheets per course: first week (day 5), last week (day 17).
    await db.insert(assessmentSheets).values([
      {
        courseId: course.id,
        termLabel: TERM_LABEL,
        phase: "first",
        teachingDay: 5,
        dueDate: nthTeachingDayISO(t.course.termStartDate, WEEKDAYS, 5),
        status: "open",
      },
      {
        courseId: course.id,
        termLabel: TERM_LABEL,
        phase: "last",
        teachingDay: 17,
        dueDate: nthTeachingDayISO(t.course.termStartDate, WEEKDAYS, 17),
        status: "open",
      },
    ]);
  }

  await db.insert(appUsers).values(userRows);

  logger.info({ teachers: TEACHERS.length }, "Seed complete");
}
