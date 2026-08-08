import { PartialType } from '@nestjs/swagger';
import { CreateFrontendVersionDto } from './create-frontend-version.dto';

export class UpdateFrontendVersionDto extends PartialType(
  CreateFrontendVersionDto,
) {}
