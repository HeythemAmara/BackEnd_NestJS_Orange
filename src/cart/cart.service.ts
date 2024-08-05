import { Injectable, NotFoundException, ForbiddenException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Cart, CartDocument } from '../schemas/cart.schema';
import { CreateCartDto } from './dto/create-cart.dto';
import { ChangeStatusDto } from './dto/change-status.dto';
import { DeleteCartsDto } from './dto/delete-carts.dto';
import { ChangeQuantityDto  } from './dto/change-quantity.dto';

@Injectable()
export class CartService {
  constructor(@InjectModel(Cart.name) private cartModel: Model<CartDocument>) {}

  async create(createCartDto: CreateCartDto): Promise<Cart> {
    const reference = await this.generateReference(createCartDto.employee);
    const createdCart = new this.cartModel({ ...createCartDto, reference });
    return createdCart.save();
  }

  async findAll(): Promise<Cart[]> {
    return this.cartModel.find().sort('employee').exec();
  }

  async findByEmployee(employee: string): Promise<Cart[]> {
    return this.cartModel.find({ employee }).exec();
  }

  async findOne(reference: string): Promise<Cart> {
    const cart = await this.cartModel.findOne({ reference }).exec();
    if (!cart) {
      throw new NotFoundException(`Cart with reference "${reference}" not found`);
    }
    return cart;
  }

  async changeStatus(reference: string, changeStatusDto: ChangeStatusDto): Promise<Cart> {
    const updatedCart = await this.cartModel
      .findOneAndUpdate({ reference }, { status: changeStatusDto.status }, { new: true })
      .exec();
    if (!updatedCart) {
      throw new NotFoundException(`Cart with reference "${reference}" not found`);
    }
    return updatedCart;
  }

  async remove(reference: string, user: any): Promise<Cart> {
    const cart = await this.cartModel.findOne({ reference }).exec();
    if (!cart) {
      throw new NotFoundException(`Cart with reference "${reference}" not found`);
    }
    if (user.role !== 'Admin' && user.username !== cart.employee) {
      throw new ForbiddenException('You do not have permission to delete this cart');
    }
    await this.cartModel.deleteOne({ reference }).exec();
    return cart;
  }

  async deleteMultipleCarts(deleteCartsDto: DeleteCartsDto, user: any): Promise<{ deletedCount: number }> {
    const condition = user.role === 'Admin'
      ? { reference: { $in: deleteCartsDto.reference } }
      : { reference: { $in: deleteCartsDto.reference, $eq: user.username } };

    const result = await this.cartModel.deleteMany(condition).exec();
    return { deletedCount: result.deletedCount };
  }

  async changeQuantity(changeQuantityDto: ChangeQuantityDto): Promise<Cart> {
    const cart = await this.cartModel.findOne({ reference: changeQuantityDto.reference }).exec();
    if (!cart) {
      throw new NotFoundException(`Cart with reference "${changeQuantityDto.reference}" not found`);
    }

    changeQuantityDto.items.forEach(item => {
      const cartItem = cart.phones.find(cartItem => cartItem.phone.titre_article === item.titre_article);
      if (cartItem) {
        cartItem.quantity = item.quantity;
      }
    });

    return cart.save();
  }

  private async generateReference(employee: string): Promise<string> {
    const lastCart = await this.cartModel.findOne({ employee }).sort({ reference: -1 }).exec();
    let nextNumber = 1;
    if (lastCart) {
      const lastReference = lastCart.reference;
      const match = lastReference.match(/(\d+)$/);
      if (match) {
        nextNumber = parseInt(match[1], 10) + 1;
      }
    }
    return `${employee}:${nextNumber}`;
  }
}