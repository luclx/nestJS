import { Injectable } from '@nestjs/common';
import { Connection, DeleteResult, UpdateResult } from 'typeorm';
import { UserEntity } from './entities/user.entity';
import { UsersRepository } from './users.repository';

@Injectable()
export class UsersService {
  // create(createUserDto: CreateUserDto) {
  //   return 'This action adds a new user';
  // }

  // findAll() {
  //   return `This action returns all users`;
  // }

  // findOne(id: number) {
  //   return `This action returns a #${id} user`;
  // }

  // update(id: number, updateUserDto: UpdateUserDto) {
  //   return `This action updates a #${id} user`;
  // }

  // remove(id: number) {
  //   return `This action removes a #${id} user`;
  // }

  private userRepository: UsersRepository;

  constructor(private readonly connection: Connection) {
    this.userRepository = this.connection.getCustomRepository(UsersRepository);
  }

  public async create(_fields): Promise<UserEntity> {
    const _item = Object.assign(new UserEntity(), _fields);
    return await this.userRepository.save(_item);
  }

  public async find(_fields): Promise<UserEntity[]> {
    return await this.userRepository.find(_fields);
  }

  public async findOne(_fields): Promise<UserEntity> {
    return await this.userRepository.findOne(_fields);
  }

  public async update(_findConditions, _updateFields): Promise<UpdateResult> {
    return await this.userRepository.update(_findConditions, _updateFields);
  }

  public async delete(_id: number): Promise<DeleteResult> {
    return await this.userRepository.delete(_id);
  }

  public async query(_fields): Promise<number> {
    return await this.userRepository.query(_fields);
  }
}
