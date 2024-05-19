import { Body, Controller, Get, Param, Post } from '@nestjs/common';
import { Observable } from 'rxjs';
import { ApiTags, ApiOperation, ApiResponse, ApiBody,ApiParam } from '@nestjs/swagger';
import { WatchListService } from '../service/watch-list.service';
import { WatchListEntity } from '../models/watch-list.entity';
import { CreateWatchListDto } from '../models/dto/CreateWatchList.dto';

@ApiTags('watchList')
@Controller('watchList')
export class WatchListController {
  constructor(private watchListService: WatchListService) {}

  @Get()
  @ApiOperation({ summary: 'Get all watch list entries with user and movie information' })
  @ApiResponse({ status: 200, description: 'Returns all watch list entries with user and movie information.' })
  async findAll() {
    return await this.watchListService.findAll();
  }
  
  @Post()
  @ApiOperation({ summary: 'Add a movie to the watch list' })
  @ApiResponse({ status: 201, description: 'Movie added to the watch list.' })
  @ApiBody({ type: CreateWatchListDto, description: 'Details of the movie to be added to the watch list' })
  async addToWatchList(@Body() createWatchListDto: CreateWatchListDto): Promise<WatchListEntity> {
    console.log("createWatchListDto -->", createWatchListDto);
    return this.watchListService.addToWatchList(createWatchListDto);
  }

  @Post('add-value')
  @ApiOperation({ summary: 'Add additional values to the movies in the watch list' })
  @ApiResponse({ status: 200, description: 'Additional values added to the movies in the watch list.' })
  @ApiBody({ description: 'User ID to fetch the watch list for', schema: { example: { userId: 1 } } })
  async addValueToMyWatchList(@Body() userBody: any): Promise<void> {
    return this.watchListService.addValueToMyWatchList(userBody);
  }

  @Get('user/:userId')
  @ApiOperation({ summary: 'Get watch list by user ID' })
  @ApiResponse({ status: 200, description: 'Returns the watch list for the specified user.' })
  @ApiParam({ name: 'userId', description: 'ID of the user' })
  async getWatchListByUserId(@Param('userId') userId: number): Promise<WatchListEntity[]> {
    return this.watchListService.getWatchListByUserId(userId);
  }
}

