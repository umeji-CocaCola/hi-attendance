import { IsOptional, Matches } from 'class-validator';

/**
 * month: "YYYY-MM" 形式（例: 2025-09）
 * 省略時はサーバーの現在月
 */
export class GetSummaryDto {
  @IsOptional()
  @Matches(/^\d{4}-(0[1-9]|1[0-2])$/, { message: 'month must be like YYYY-MM' })
  month?: string;
}
