import { Router, type IRouter } from "express";

const router: IRouter = Router();

const USERS: Record<string, { id: string; email: string; firstName: string; lastName: string; role: string; password: string; grade?: number; classroomId?: number }> = {
  "britishce44@gmail.com": { id: "1", email: "britishce44@gmail.com", firstName: "Admin", lastName: "Britishce44", role: "admin", password: "admin123" },
  "suhair.almojahid": { id: "2", email: "suhair.almojahid", firstName: "Suhair", lastName: "Al-Mojahid", role: "teacher", password: "teacher123" },
  "waad.alhammadi": { id: "3", email: "waad.alhammadi", firstName: "Waad", lastName: "Al-Hammadi", role: "teacher", password: "teacher123" },
  "jamal.alshameeri": { id: "4", email: "jamal.alshameeri", firstName: "Jamal", lastName: "Al-Shameeri", role: "teacher", password: "teacher123" },
  "amani.alsharabi": { id: "5", email: "amani.alsharabi", firstName: "Amani", lastName: "Al-Sharabi", role: "teacher", password: "teacher123" },
  "khadeejah.alghaily": { id: "6", email: "khadeejah.alghaily", firstName: "Khadeejah", lastName: "Al-Ghaily", role: "teacher", password: "teacher123" },
  "shihab.alomary": { id: "7", email: "shihab.alomary", firstName: "Shihab", lastName: "Al-Omary", role: "teacher", password: "teacher123" },
  "supervisor@britishce44.edu": { id: "8", email: "supervisor@britishce44.edu", firstName: "Supervisor", lastName: "B44", role: "supervisor", password: "supervisor123" },
};

const registeredUsers: typeof USERS = { ...USERS };
let nextId = 100;

router.post("/v1/auth/login", (req, res) => {
  const { email, password } = req.body;
  const user = registeredUsers[email];
  if (!user || user.password !== password) {
    return res.status(401).json({ message: "Invalid credentials" });
  }
  const { password: _pw, ...userData } = user;
  const accessToken = `token-${user.id}-${Date.now()}`;
  return res.json({ accessToken, user: userData });
});

router.post("/v1/auth/register", (req, res) => {
  const { email, password, firstName, lastName, role = "student", phone, address } = req.body;
  if (!email || !password || !firstName || !lastName) {
    return res.status(400).json({ message: "Missing required fields" });
  }
  if (registeredUsers[email]) {
    return res.status(400).json({ message: "Email already registered" });
  }
  nextId++;
  registeredUsers[email] = { id: String(nextId), email, firstName, lastName, role, password, phone, address } as any;
  return res.json({ message: "Registration successful" });
});

export default router;
