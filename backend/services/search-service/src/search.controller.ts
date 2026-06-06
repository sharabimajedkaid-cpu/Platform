import { Controller, Get, Post, Param, Body, Query, Delete } from '@nestjs/common';
import { ApiTags, ApiOperation } from '@nestjs/swagger';
import { SearchService } from './search.service';

@ApiTags('search')
@Controller('search')
export class SearchController {
  constructor(private searchService: SearchService) {}

  @Get()
  @ApiOperation({ summary: 'Search across all indexed data' })
  async search(@Query('q') query: string, @Query('type') type?: string, @Query('limit') limit?: number) {
    const types = type ? type.split(',') : undefined;
    return this.searchService.search(query || '', types, limit);
  }

  @Post('index/:type')
  @ApiOperation({ summary: 'Index data for search' })
  async index(@Param('type') type: string, @Body() body: { id: string; data: Record<string, unknown> }) {
    await this.searchService.indexData(type, body.id, body.data);
    return { success: true };
  }

  @Delete('index/:type/:id')
  @ApiOperation({ summary: 'Remove from search index' })
  async delete(@Param('type') type: string, @Param('id') id: string) {
    await this.searchService.deleteIndex(type, id);
    return { success: true };
  }

  @Get('stats')
  @ApiOperation({ summary: 'Get search index stats' })
  getStats() { return this.searchService.getStats(); }
}
