import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';

@Schema()
export class PriminiPhone {
  @Prop({ required: true })
  ad_href: string;

  @Prop({ required: true })
  ad_image: string;

  @Prop({ required: true })
  titre_article: string;

  @Prop({ required: true })
  description_article: string;

  @Prop({ required: true })
  min_price: number;

  @Prop({ required: true })
  max_price: number;

  @Prop({ required: true })
  prix_detail: number[];

  @Prop({ required: true })
  shop: string[];

  @Prop({ required: true })
  ad_titles: string[];

  @Prop({ required: true })
  stocks: string[];

  @Prop({ required: true })
  marque: string;

  @Prop({ required: true })
  couleur: string;

  @Prop({ required: true })
  modele: string;
}

export const PriminiPhoneSchema = SchemaFactory.createForClass(PriminiPhone);

@Schema()
export class ItemCart {
  @Prop({ type: Types.ObjectId, ref: 'PriminiPhone', required: true })
  phone: PriminiPhone;

  @Prop({ required: true })
  quantity: number;
}

export const ItemCartSchema = SchemaFactory.createForClass(ItemCart);

@Schema()
export class Cart {
  @Prop({ required: true, unique: true })
  reference: string;

  @Prop({ required: true })
  employee: string;

  @Prop({ type: [ItemCartSchema], required: true })
  phones: ItemCart[];

  @Prop({ required: true })
  total: number;

  @Prop({ required: true })
  status: string;
}

export type CartDocument = Cart & Document;
export const CartSchema = SchemaFactory.createForClass(Cart);
