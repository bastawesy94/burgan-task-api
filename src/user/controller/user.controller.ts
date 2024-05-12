import { Body, Controller, Get, Post, Req } from '@nestjs/common';
import { Observable } from 'rxjs';
import { CreateUserDto } from '../models/dto/CreateUser.dto';
import { UserI } from '../models/user.interface';
import { UserService } from '../service/user.service';

@Controller('users')
export class UserController {

    constructor(private userService: UserService) {}

    @Get()
    findAll(@Req() request): Observable<UserI[]> {
        return this.userService.findAll();
    }

}
