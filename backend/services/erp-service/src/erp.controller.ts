import { Controller, Get, Post, Param, Body, HttpCode, HttpStatus, Query } from '@nestjs/common';
import { ApiTags, ApiOperation } from '@nestjs/swagger';
import { HrService } from './hr.service';
import { FinanceService } from './finance.service';
import { AdmissionsService } from './admissions.service';

@ApiTags('erp')
@Controller('erp')
export class ErpController {
  constructor(
    private hrService: HrService,
    private financeService: FinanceService,
    private admissionsService: AdmissionsService,
  ) {}

  @Get('hr/employees')
  @ApiOperation({ summary: 'Get all employees' })
  getEmployees() { return this.hrService.getAllEmployees(); }

  @Post('hr/employees')
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({ summary: 'Add employee' })
  addEmployee(@Body() body: { name: string; position: string; department: string; salary: number }) {
    return this.hrService.addEmployee(body);
  }

  @Get('hr/payroll')
  @ApiOperation({ summary: 'Get payroll records' })
  getPayroll() { return this.hrService.getPayroll(); }

  @Get('finance/invoices')
  @ApiOperation({ summary: 'Get all invoices' })
  getInvoices() { return this.financeService.getInvoices(); }

  @Post('finance/invoices')
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({ summary: 'Create invoice' })
  createInvoice(@Body() body: { studentName: string; amount: number; description: string }) {
    return this.financeService.createInvoice(body);
  }

  @Post('finance/payments/:invoiceId')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Record payment' })
  recordPayment(@Param('invoiceId') invoiceId: string, @Body() body: { amount: number; method: string }) {
    return this.financeService.recordPayment(invoiceId, body.amount, body.method);
  }

  @Get('finance/revenue')
  @ApiOperation({ summary: 'Get revenue report' })
  getRevenue() { return this.financeService.getRevenueReport(); }

  @Get('admissions/applications')
  @ApiOperation({ summary: 'Get all applications' })
  getApplications() { return this.admissionsService.getAll(); }

  @Post('admissions/applications')
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({ summary: 'Submit application' })
  submitApplication(@Body() body: { studentName: string; parentName: string; email: string; phone: string; grade: string }) {
    return this.admissionsService.submit(body);
  }

  @Post('admissions/applications/:id/process')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Process application (approve/reject)' })
  processApplication(@Param('id') id: string, @Body() body: { status: 'approved' | 'rejected'; notes?: string }) {
    return this.admissionsService.process(id, body.status, body.notes);
  }
}
