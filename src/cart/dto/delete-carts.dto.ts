import { IsArray, IsString } from 'class-validator';

export class DeleteCartsDto {
  @IsArray()
  @IsString({ each: true })
  reference: string[];
}
