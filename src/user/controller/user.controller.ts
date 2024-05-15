import { Controller, Get } from '@nestjs/common';
import { Observable } from 'rxjs';
import { UserI } from '../models/user.interface';
import { UserService } from '../service/user.service';

@Controller('users')
export class UserController {
  constructor(private userService: UserService) {}

  @Get()
  findAll(): Observable<UserI[]> {
    return this.userService.findAll();
  }
}
