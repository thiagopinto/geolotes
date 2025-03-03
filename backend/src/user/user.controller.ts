import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
} from '@nestjs/common';
import { UserService } from './user.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiBody,
  ApiQuery,
  ApiParam,
  ApiOkResponse,
} from '@nestjs/swagger';
import { PaginationQueryDto } from 'src/common/dtos/pagination-query.dto';
import { Query } from '@nestjs/common';
import { User } from './entities/user.entity';
import { PaginationResponseDto } from 'src/common/dtos/pagination-response.dto';
@ApiTags('User')
@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Post()
  @ApiOperation({ summary: 'Create a user' })
  @ApiResponse({
    status: 201,
    description: 'The user has been successfully created',
  })
  @ApiResponse({
    status: 400,
    description: 'The user has not been created',
  })
  @ApiBody({ type: CreateUserDto })
  @ApiOkResponse({ type: User })
  async create(@Body() createUserDto: CreateUserDto): Promise<User> {
    return await this.userService.create(createUserDto);
  }

  @Get()
  @ApiOperation({ summary: 'Get pagination of users' })
  @ApiResponse({
    status: 200,
    description: 'The users have been successfully retrieved',
  })
  @ApiResponse({
    status: 400,
    description: 'The users have not been retrieved',
  })
  @ApiQuery({ type: PaginationQueryDto })
  @ApiOkResponse({ type: PaginationResponseDto<User> })
  async findAll(
    @Query() paginationQuery: PaginationQueryDto,
  ): Promise<PaginationResponseDto<User>> {
    return await this.userService.findAll(paginationQuery);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get a user by id' })
  @ApiResponse({
    status: 200,
    description: 'The user has been successfully retrieved',
  })
  @ApiResponse({
    status: 400,
    description: 'The user has not been retrieved',
  })
  @ApiOkResponse({ type: User })
  async findOne(@Param('id') id: string): Promise<User | null> {
    return await this.userService.findOne(+id);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Update a user by id' })
  @ApiResponse({
    status: 200,
    description: 'The user has been successfully updated',
  })
  @ApiResponse({
    status: 400,
    description: 'The user has not been updated',
  })
  @ApiBody({ type: UpdateUserDto })
  @ApiOkResponse({ type: User })
  @ApiParam({ name: 'id', type: String })
  async update(
    @Param('id') id: string,
    @Body() updateUserDto: UpdateUserDto,
  ): Promise<User> {
    return await this.userService.update(+id, updateUserDto);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete a user by id' })
  @ApiResponse({
    status: 200,
    description: 'The user has been successfully deleted',
  })
  @ApiResponse({
    status: 400,
    description: 'The user has not been deleted',
  })
  @ApiOkResponse({ type: User })
  @ApiParam({ name: 'id', type: String })
  async remove(@Param('id') id: string): Promise<User> {
    return await this.userService.remove(+id);
  }

  @Post(':userId/roles')
  @ApiOperation({ summary: 'Add a role to a user' })
  @ApiResponse({
    status: 200,
    description: 'The role has been successfully added to the user',
  })
  @ApiResponse({
    status: 400,
    description: 'The role has not been added to the user',
  })
  @ApiOkResponse({ type: User })
  async addRole(
    @Param('userId') userId: number,
    @Body('roleId') roleId: number,
  ): Promise<User> {
    return this.userService.addRole(userId, roleId);
  }

  @Delete(':userId/roles/:roleId')
  @ApiOperation({ summary: 'Remove a role from a user' })
  @ApiResponse({
    status: 200,
    description: 'The role has been successfully removed from the user',
  })
  @ApiResponse({
    status: 400,
    description: 'The role has not been removed from the user',
  })
  @ApiOkResponse({ type: User })
  async removeRole(
    @Param('userId') userId: number,
    @Param('roleId') roleId: number,
  ): Promise<User> {
    return this.userService.removeRole(userId, roleId);
  }
}
