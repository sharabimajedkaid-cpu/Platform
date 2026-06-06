import { Injectable } from '@nestjs/common';
import { v4 as uuidv4 } from 'uuid';

export interface Employee {
  id: string; name: string; position: string; department: string;
  salary: number; hireDate: string; status: 'active' | 'on_leave' | 'terminated';
}

export interface PayrollRecord {
  id: string; employeeId: string; employeeName: string;
  baseSalary: number; deductions: number; netPay: number;
  period: string; paidAt: string;
}

@Injectable()
export class HrService {
  private employees: Employee[] = [];
  private payroll: PayrollRecord[] = [];

  constructor() {
    this.seedEmployees();
  }

  private seedEmployees() {
    const names = ['Admin Britishce44', 'Supervisor', 'T.Suhair Almojahid', "T.Wa'ad Alhammadi",
      'T.Jamal Alshameeri', 'T.Amani Alsharabi', 'T.Khadeejah Alghaily', 'T.Shihab Alomary'];
    names.forEach((name, i) => {
      this.employees.push({
        id: `emp-${String(i + 1).padStart(3, '0')}`, name,
        position: i === 0 ? 'Director' : i === 1 ? 'Supervisor' : 'Teacher',
        department: 'Education', salary: 2000 + i * 500,
        hireDate: new Date(Date.now() - Math.random() * 365 * 86400000).toISOString(),
        status: 'active',
      });
    });
  }

  getAllEmployees(): Employee[] { return this.employees; }

  addEmployee(data: { name: string; position: string; department: string; salary: number }): Employee {
    const emp: Employee = { id: `emp-${uuidv4().slice(0, 8)}`, ...data, hireDate: new Date().toISOString(), status: 'active' };
    this.employees.push(emp);
    return emp;
  }

  getPayroll(): PayrollRecord[] { return this.payroll; }

  processPayroll(period: string): PayrollRecord[] {
    this.payroll = this.employees.filter(e => e.status === 'active').map(e => ({
      id: `pay-${uuidv4().slice(0, 8)}`, employeeId: e.id, employeeName: e.name,
      baseSalary: e.salary, deductions: Math.round(e.salary * 0.1), netPay: Math.round(e.salary * 0.9),
      period, paidAt: new Date().toISOString(),
    }));
    return this.payroll;
  }
}
