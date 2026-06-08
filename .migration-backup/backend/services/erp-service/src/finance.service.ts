import { Injectable } from '@nestjs/common';
import { v4 as uuidv4 } from 'uuid';

export interface Invoice {
  id: string; studentName: string; amount: number; description: string;
  status: 'pending' | 'paid' | 'overdue' | 'cancelled';
  createdAt: string; paidAt?: string; paymentMethod?: string;
}

@Injectable()
export class FinanceService {
  private invoices: Invoice[] = [];

  getInvoices(): Invoice[] { return this.invoices; }

  createInvoice(data: { studentName: string; amount: number; description: string }): Invoice {
    const invoice: Invoice = {
      id: `inv-${uuidv4().slice(0, 8)}`, ...data,
      status: 'pending', createdAt: new Date().toISOString(),
    };
    this.invoices.push(invoice);
    return invoice;
  }

  recordPayment(invoiceId: string, amount: number, method: string): Invoice | null {
    const invoice = this.invoices.find(i => i.id === invoiceId);
    if (!invoice) return null;
    invoice.status = 'paid';
    invoice.paidAt = new Date().toISOString();
    invoice.paymentMethod = method;
    return invoice;
  }

  getRevenueReport(): { totalInvoiced: number; totalCollected: number; pending: number; overdue: number } {
    return {
      totalInvoiced: this.invoices.reduce((s, i) => s + i.amount, 0),
      totalCollected: this.invoices.filter(i => i.status === 'paid').reduce((s, i) => s + i.amount, 0),
      pending: this.invoices.filter(i => i.status === 'pending').length,
      overdue: this.invoices.filter(i => i.status === 'overdue').length,
    };
  }
}
