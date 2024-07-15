import { IsString } from 'class-validator';

export class ChangeStatusDto {
  @IsString()
  reference: string;

  @IsString()
  status: string;
}
