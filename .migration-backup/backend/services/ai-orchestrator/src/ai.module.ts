import { Module } from '@nestjs/common';
import { AiController } from './ai.controller';
import { AiService } from './ai.service';
import { AiTeachingAssistant } from './teaching-assistant.service';
import { AiAntiCheatService } from './anticheat.service';
import { AiContentModerationService } from './moderation.service';

@Module({
  controllers: [AiController],
  providers: [AiService, AiTeachingAssistant, AiAntiCheatService, AiContentModerationService],
  exports: [AiService, AiAntiCheatService],
})
export class AiModule {}
