import {
  Controller,
  Get,
  Post,
  Body,
  Delete,
  Put,
  UseGuards,
  Request,
  ForbiddenException,
} from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { CartService } from './cart.service';
import { CreateCartDto } from './dto/create-cart.dto';
import { ChangeStatusDto } from './dto/change-status.dto';
import { DeleteCartsDto } from './dto/delete-carts.dto';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { RolesGuard } from '../auth/roles.guard';
import { Roles } from '../auth/roles.decorator';

@ApiTags('carts')
@Controller('carts')
export class CartController {
  constructor(private readonly cartService: CartService) {}

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('Admin', 'Employee')
  @Post('create')
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Create cart' })
  @ApiResponse({ status: 201, description: 'Cart created successfully' })
  create(@Body() createCartDto: CreateCartDto) {
    return this.cartService.create(createCartDto);
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('Admin')
  @Get('get-all')
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Get all carts' })
  @ApiResponse({ status: 200, description: 'List of carts' })
  findAll() {
    return this.cartService.findAll();
  }

  @UseGuards(JwtAuthGuard)
  @Post('get-by-employee')
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Get carts by employee' })
  @ApiResponse({ status: 200, description: 'List of carts for the employee' })
  findByEmployee(@Body('employee') employee: string, @Request() req) {
    if (req.user.username !== employee && req.user.role !== 'Admin') {
      throw new ForbiddenException('You do not have permission to view these carts');
    }
    return this.cartService.findByEmployee(employee);
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('Admin')
  @Post('get-by-reference')
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Get cart by reference' })
  @ApiResponse({ status: 200, description: 'Cart found' })
  findOne(@Body('reference') reference: string) {
    return this.cartService.findOne(reference);
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('Admin')
  @Put('change-status')
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Change cart status' })
  @ApiResponse({ status: 200, description: 'Cart status changed successfully' })
  changeStatus(@Body() changeStatusDto: ChangeStatusDto) {
    return this.cartService.changeStatus(changeStatusDto.reference, changeStatusDto);
  }

  @UseGuards(JwtAuthGuard)
  @Delete('remove-cart')
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Delete cart' })
  @ApiResponse({ status: 200, description: 'Cart deleted successfully' })
  remove(@Body('reference') reference: string, @Request() req) {
    return this.cartService.remove(reference, req.user);
  }

  @UseGuards(JwtAuthGuard)
  @Delete('remove-carts')
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Delete multiple carts' })
  @ApiResponse({ status: 200, description: 'Carts deleted successfully' })
  deleteMultipleCarts(@Body() deleteCartsDto: DeleteCartsDto, @Request() req) {
    return this.cartService.deleteMultipleCarts(deleteCartsDto, req.user);
  }
}