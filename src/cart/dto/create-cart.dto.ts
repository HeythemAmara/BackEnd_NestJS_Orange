import { IsString, IsArray, IsNumber, ValidateNested } from 'class-validator';
import { Type } from 'class-transformer';

class PriminiPhoneDto {
  @IsString()
  ad_href: string;

  @IsString()
  ad_image: string;

  @IsString()
  titre_article: string;

  @IsString()
  description_article: string;

  @IsNumber()
  min_price: number;

  @IsNumber()
  max_price: number;

  @IsArray()
  prix_detail: number[];

  @IsArray()
  shop: string[];

  @IsArray()
  ad_titles: string[];

  @IsArray()
  stocks: string[];

  @IsString()
  marque: string;

  @IsString()
  couleur: string;

  @IsString()
  modele: string;
}

class ItemCartDto {
  @ValidateNested()
  @Type(() => PriminiPhoneDto)
  phone: PriminiPhoneDto;

  @IsNumber()
  quantity: number;
}

export class CreateCartDto {
  @IsString()
  employee: string;

  @ValidateNested({ each: true })
  @Type(() => ItemCartDto)
  @IsArray()
  phones: ItemCartDto[];

  @IsNumber()
  total: number;

  @IsString()
  status: string;
}
