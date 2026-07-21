import { ApiProperty } from '@nestjs/swagger';
import { Transform } from 'class-transformer';
import { IsArray, IsOptional, IsString } from 'class-validator';

// Absent -> undefined (caller applies the default exclusion list).
// Present but empty (`exclude[]=`) -> [] (explicitly exclude nothing).
// Accepts exclude[]=a&exclude[]=b, exclude=a&exclude=b, and exclude=a,b.
const normalizeExclude = (value: unknown): string[] | undefined => {
  if (value === undefined) return undefined;
  const raw = Array.isArray(value) ? value : [value];
  return raw
    .flatMap((item) => (typeof item === 'string' ? item.split(',') : []))
    .map((item) => item.trim())
    .filter((item) => item.length > 0);
};

export class QueryStatisticDto {
  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  @Transform(({ value }) => normalizeExclude(value))
  @ApiProperty({
    required: false,
    type: [String],
    description:
      'Language names to exclude from the languages breakdown. ' +
      'Defaults to ["JSON"] when omitted; pass exclude[]= to disable the default.',
  })
  exclude?: string[];
}
