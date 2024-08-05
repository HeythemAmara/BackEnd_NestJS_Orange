import { IsString, IsNumber, IsArray, ValidateNested } from 'class-validator';
import { Type } from 'class-transformer';

class ItemQuantityDto {
  @IsString()
  titre_article: string;

  @IsNumber()
  quantity: number;
}

export class ChangeQuantityDto {
  @IsString()
  reference: string;

  @ValidateNested({ each: true })
  @Type(() => ItemQuantityDto)
  @IsArray()
  items: ItemQuantityDto[];
}
