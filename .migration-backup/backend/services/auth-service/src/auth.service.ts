import { Injectable, UnauthorizedException, ConflictException, Logger } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcryptjs';
import * as speakeasy from 'speakeasy';
import * as QRCode from 'qrcode';

export interface UserRecord {
  id: string;
  email: string;
  password: string;
  firstName: string;
  lastName: string;
  role: string;
  phone?: string;
  address?: string;
  grade?: number;
  classroomId?: number;
  mfaSecret?: string;
  mfaEnabled: boolean;
  isActive: boolean;
  refreshToken?: string;
}

@Injectable()
export class AuthService {
  private readonly logger = new Logger(AuthService.name);
  private users: UserRecord[] = [];

  constructor(private jwtService: JwtService) {
    this.seedDefaultUsers();
  }

  private seedDefaultUsers() {
    const defaultPassword = bcrypt.hashSync('admin123', 10);
    this.users.push({
      id: 'admin-001', email: 'britishce44@gmail.com', password: defaultPassword,
      firstName: 'Admin', lastName: 'Britishce44', role: 'admin', mfaEnabled: false, isActive: true,
    });
    this.users.push({
      id: 'sup-001', email: 'supervisor@britishce44.edu', password: bcrypt.hashSync('supervisor123', 10),
      firstName: 'Supervisor', lastName: 'Britishce44', role: 'supervisor', mfaEnabled: false, isActive: true,
    });
    const teachers = [
      { id: 'tch-001', email: 'suhair.almojahid@britishce44.edu', firstName: 'T.Suhair', lastName: 'Almojahid' },
      { id: 'tch-002', email: 'waad.alhammadi@britishce44.edu', firstName: "T.Wa'ad", lastName: 'Alhammadi' },
      { id: 'tch-003', email: 'jamal.alshameeri@britishce44.edu', firstName: 'T.Jamal', lastName: 'Alshameeri' },
      { id: 'tch-004', email: 'amani.alsharabi@britishce44.edu', firstName: 'T.Amani', lastName: 'Alsharabi' },
      { id: 'tch-005', email: 'khadeejah.alghaily@britishce44.edu', firstName: 'T.Khadeejah', lastName: 'Alghaily' },
      { id: 'tch-006', email: 'shihab.alomary@britishce44.edu', firstName: 'T.Shihab', lastName: 'Alomary' },
    ];
    teachers.forEach(t => {
      this.users.push({ ...t, password: bcrypt.hashSync('teacher123', 10), role: 'teacher', mfaEnabled: false, isActive: true });
    });
    for (let i = 1; i <= 50; i++) {
      this.users.push({
        id: `std-${String(i).padStart(4, '0')}`,
        email: `student${i}@britishce44.edu`,
        password: bcrypt.hashSync('student123', 10),
        firstName: 'Student', lastName: `${i}`, role: 'student',
        grade: Math.floor((i - 1) / 10) + 1,
        classroomId: (i % 240) + 1,
        mfaEnabled: false, isActive: true,
      });
    }
  }

  async validateUser(email: string, password: string): Promise<Omit<UserRecord, 'password'> | null> {
    const user = this.users.find(u => u.email === email.toLowerCase());
    if (!user) return null;
    if (!user.isActive) throw new UnauthorizedException('Account is deactivated');
    const isValid = await bcrypt.compare(password, user.password);
    if (!isValid) return null;
    const { password: _, ...result } = user;
    return result;
  }

  async login(email: string, password: string): Promise<{ accessToken: string; refreshToken: string; user: Omit<UserRecord, 'password'> }> {
    const user = await this.validateUser(email, password);
    if (!user) throw new UnauthorizedException('Invalid credentials');

    const payload = { sub: user.id, email: user.email, role: user.role };
    const accessToken = this.jwtService.sign(payload);
    const refreshToken = this.jwtService.sign({ ...payload, type: 'refresh' }, { expiresIn: '7d' });

    const userRecord = this.users.find(u => u.id === user.id);
    if (userRecord) userRecord.refreshToken = refreshToken;

    return { accessToken, refreshToken, user };
  }

  async register(userData: { email: string; password: string; firstName: string; lastName: string; role: string; phone?: string; address?: string }): Promise<{ id: string }> {
    const existing = this.users.find(u => u.email === userData.email.toLowerCase());
    if (existing) throw new ConflictException('Email already registered');

    const id = `user-${Date.now().toString(36)}`;
    const hashedPassword = await bcrypt.hash(userData.password, 10);
    this.users.push({
      id,
      email: userData.email.toLowerCase(),
      password: hashedPassword,
      firstName: userData.firstName,
      lastName: userData.lastName,
      role: userData.role || 'student',
      phone: userData.phone,
      address: userData.address,
      mfaEnabled: false,
      isActive: true,
    });
    return { id };
  }

  async refreshToken(token: string): Promise<{ accessToken: string }> {
    try {
      const decoded = this.jwtService.verify(token);
      const user = this.users.find(u => u.id === decoded.sub);
      if (!user || user.refreshToken !== token) throw new UnauthorizedException('Invalid refresh token');
      const payload = { sub: user.id, email: user.email, role: user.role };
      const accessToken = this.jwtService.sign(payload);
      return { accessToken };
    } catch {
      throw new UnauthorizedException('Invalid refresh token');
    }
  }

  async generateMfaSecret(userId: string): Promise<{ secret: string; qrCode: string }> {
    const user = this.users.find(u => u.id === userId);
    if (!user) throw new UnauthorizedException('User not found');
    const secret = speakeasy.generateSecret({ name: `Britishce44:${user.email}` });
    user.mfaSecret = secret.base32;
    const qrCode = await QRCode.toDataURL(secret.otpauth_url || '');
    return { secret: secret.base32, qrCode };
  }

  async verifyMfa(userId: string, token: string): Promise<boolean> {
    const user = this.users.find(u => u.id === userId);
    if (!user || !user.mfaSecret) return false;
    return speakeasy.totp.verify({ secret: user.mfaSecret, encoding: 'base32', token });
  }

  async enableMfa(userId: string): Promise<void> {
    const user = this.users.find(u => u.id === userId);
    if (user) user.mfaEnabled = true;
  }

  async getUsers(): Promise<Omit<UserRecord, 'password'>[]> {
    return this.users.map(({ password, ...u }) => u);
  }

  async getUserById(id: string): Promise<Omit<UserRecord, 'password'> | null> {
    const user = this.users.find(u => u.id === id);
    if (!user) return null;
    const { password, ...result } = user;
    return result;
  }

  async deactivateUser(id: string): Promise<void> {
    const user = this.users.find(u => u.id === id);
    if (user) user.isActive = false;
  }
}
