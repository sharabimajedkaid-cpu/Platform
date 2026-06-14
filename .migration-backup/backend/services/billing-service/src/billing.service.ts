import { Injectable, Logger } from '@nestjs/common';
import { v4 as uuidv4 } from 'uuid';

export interface Plan {
  id: string; name: string; tier: string; price: number; currency: string;
  features: string[]; isActive: boolean;
}

export interface Subscription {
  id: string; userId: string; planId: string; status: string;
  startDate: string; endDate: string; autoRenew: boolean;
}

@Injectable()
export class BillingService {
  private readonly logger = new Logger(BillingService.name);
  private plans: Plan[] = [
    { id: 'plan-lite', name: 'Lite', tier: 'lite', price: 0, currency: 'USD', features: ['Basic features', '1 classroom'], isActive: true },
    { id: 'plan-pro', name: 'Pro', tier: 'pro', price: 29, currency: 'USD', features: ['Full features', 'APK access', 'AI assistant'], isActive: true },
    { id: 'plan-enterprise', name: 'Enterprise', tier: 'enterprise', price: 99, currency: 'USD', features: ['All features', 'EXE + VR', 'AI companion', 'Priority support'], isActive: true },
  ];
  private subscriptions: Subscription[] = [];

  getPlans(): Plan[] { return this.plans; }

  createSubscription(userId: string, planId: string): Subscription {
    const plan = this.plans.find(p => p.id === planId);
    if (!plan) throw new Error('Invalid plan');
    const sub: Subscription = {
      id: `sub-${uuidv4().slice(0, 8)}`, userId, planId,
      status: 'active',
      startDate: new Date().toISOString(),
      endDate: new Date(Date.now() + 30 * 86400000).toISOString(),
      autoRenew: true,
    };
    this.subscriptions.push(sub);
    return sub;
  }

  getUserSubscription(userId: string): Subscription | undefined {
    return this.subscriptions.find(s => s.userId === userId && s.status === 'active');
  }

  cancelSubscription(id: string): boolean {
    const sub = this.subscriptions.find(s => s.id === id);
    if (sub) { sub.status = 'cancelled'; return true; }
    return false;
  }

  processPayment(userId: string, amount: number, method: string): { success: boolean; transactionId: string } {
    return { success: true, transactionId: `txn-${uuidv4().slice(0, 8)}` };
  }

  generateInvoice(subscriptionId: string): { invoiceUrl: string; amount: number } {
    return { invoiceUrl: `https://billing.britishce44.edu/invoices/${subscriptionId}.pdf`, amount: 29 };
  }
}
