import { Controller, Get, Post, Param, Body, HttpCode, HttpStatus } from '@nestjs/common';
import { ApiTags, ApiOperation } from '@nestjs/swagger';
import { BillingService } from './billing.service';

@ApiTags('billing')
@Controller('billing')
export class BillingController {
  constructor(private billingService: BillingService) {}

  @Get('plans')
  @ApiOperation({ summary: 'Get all subscription plans' })
  getPlans() { return this.billingService.getPlans(); }

  @Post('subscribe')
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({ summary: 'Create subscription' })
  subscribe(@Body() body: { userId: string; planId: string }) {
    return this.billingService.createSubscription(body.userId, body.planId);
  }

  @Get('subscription/:userId')
  @ApiOperation({ summary: 'Get user subscription' })
  getUserSubscription(@Param('userId') userId: string) {
    return this.billingService.getUserSubscription(userId);
  }

  @Post('cancel/:id')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Cancel subscription' })
  cancel(@Param('id') id: string) {
    return { cancelled: this.billingService.cancelSubscription(id) };
  }

  @Post('pay')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Process payment' })
  pay(@Body() body: { userId: string; amount: number; method: string }) {
    return this.billingService.processPayment(body.userId, body.amount, body.method);
  }
}
