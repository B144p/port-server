import { PartialType } from '@nestjs/mapped-types';
import { CreateAboutMeDto } from './create-about-me.dto';

export class UpdateAboutMeDto extends PartialType(CreateAboutMeDto) {}
