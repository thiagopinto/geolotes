import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
} from '@nestjs/common';
import { RoleService } from './role.service';
import { CreateRoleDto } from './dto/create-role.dto';
import { UpdateRoleDto } from './dto/update-role.dto';
import {
  ApiBody,
  ApiOkResponse,
  ApiOperation,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { Role } from './entities/role.entity';

@ApiTags('Role')
@Controller('role')
export class RoleController {
  constructor(private readonly roleService: RoleService) {}

  @ApiOperation({ summary: 'Create a role' })
  @ApiResponse({
    status: 201,
    description: 'The role has been successfully created',
  })
  @ApiResponse({
    status: 400,
    description: 'The role has not been created',
  })
  @ApiOkResponse({ type: Role })
  @ApiBody({ type: CreateRoleDto })
  @Post()
  async create(@Body() createRoleDto: CreateRoleDto): Promise<Role> {
    return await this.roleService.create(createRoleDto);
  }

  @ApiOperation({ summary: 'Get all roles' })
  @ApiResponse({
    status: 200,
    description: 'The roles have been successfully retrieved',
  })
  @ApiResponse({
    status: 404,
    description: 'The roles have not been retrieved',
  })
  @ApiOkResponse({ type: [Role] })
  @Get()
  async findAll(): Promise<Role[]> {
    return await this.roleService.findAll();
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get a role by id' })
  @ApiResponse({
    status: 200,
    description: 'The role has been successfully retrieved',
  })
  @ApiResponse({
    status: 404,
    description: 'The role has not been retrieved',
  })
  @ApiOkResponse({ type: Role })
  async findOne(@Param('id') id: string): Promise<Role> {
    return await this.roleService.findOne(+id);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Update a role by id' })
  @ApiResponse({
    status: 200,
    description: 'The role has been successfully updated',
  })
  @ApiResponse({
    status: 404,
    description: 'The role has not been updated',
  })
  @ApiOkResponse({ type: Role })
  async update(
    @Param('id') id: string,
    @Body() updateRoleDto: UpdateRoleDto,
  ): Promise<Role> {
    return await this.roleService.update(+id, updateRoleDto);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete a role by id' })
  @ApiResponse({
    status: 200,
    description: 'The role has been successfully deleted',
  })
  @ApiResponse({
    status: 404,
    description: 'The role has not been deleted',
  })
  @ApiOkResponse({ type: Role })
  async remove(@Param('id') id: string): Promise<Role> {
    return await this.roleService.remove(+id);
  }
}
