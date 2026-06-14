import { Controller, Get, Post, Req, Res, HttpStatus } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { GatewayService } from './gateway.service';
import { Request, Response } from 'express';

@ApiTags('gateway')
@Controller()
export class GatewayController {
  constructor(private readonly gatewayService: GatewayService) {}

  @Get('health')
  @ApiOperation({ summary: 'Health check endpoint' })
  @ApiResponse({ status: 200, description: 'Service is healthy' })
  healthCheck() {
    return {
      status: 'ok',
      service: 'britishce44-api-gateway',
      version: '4.4.0',
      timestamp: new Date().toISOString(),
      uptime: process.uptime(),
    };
  }

  @Get('services')
  @ApiOperation({ summary: 'List all available services' })
  listServices() {
    return this.gatewayService.getAvailableServices();
  }

  @Get('metrics')
  getMetrics() {
    return this.gatewayService.getMetrics();
  }
}
