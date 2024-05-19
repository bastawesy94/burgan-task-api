import { MovieEntity } from '../../src/movie/models/movie.entity';
import { MovieI } from '@src/movie/models/movie.interface';
import { MigrationInterface, QueryRunner } from 'typeorm';
/* eslint @typescript-eslint/no-var-requires: "off" */
const csv = require('csvtojson');

export class SyncDataIntoMoviesTable1715614449524
  implements MigrationInterface
{
  public async up(queryRunner: QueryRunner): Promise<void> {
    const csvFilePath = 'src/database/seeders/GreatestFilms.csv';
    csv()
      .fromFile(csvFilePath)
      .then((jsonObj) => {
        console.log(jsonObj);
      });

    // Async / await usage
    const jsonArray: any = await csv().fromFile(csvFilePath);
    for (let i = 0; i < jsonArray.length; i++) {
      const movie: MovieI = {
        title: jsonArray[i].Title,
        director: jsonArray[i].Director,
        year: this.extractYear(jsonArray[i].Year),
        country: jsonArray[i].Country,
        genre: jsonArray[i].Genre,
        colour: jsonArray[i].Colour,
      };
      await queryRunner.manager.insert(MovieEntity, movie);
      console.log('Done.');
    }
  }
  extractYear(yearStr: string): number {
    if(yearStr && yearStr.includes('-')){
      const year = yearStr.split('-')[0];
      return parseInt(year, 10);
    }return parseInt(yearStr);
  }
  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.manager.clear(MovieEntity);
  }
}
