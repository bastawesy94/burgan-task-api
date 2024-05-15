import { MigrationInterface, QueryRunner } from "typeorm";
let csvToJson = require('convert-csv-to-json');
import { MovieEntity } from "../../src/movie/models/movie.entity";
import * as fs from 'fs';
import * as csvParser from 'csv-parser';
import { MovieI } from "@src/movie/models/movie.interface";
const csv = require('csvtojson')

export class SyncDataIntoMoviesTable1715614449524 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<void> {
        // let movies = [];
        // fs.createReadStream('src/database/seeders/GreatestFilms.csv')
        // .pipe(csvParser())
        // .on('data', async (row) => {
        //     try {
        //         const movie:MovieI =  {
        //             title : row.Title, // Map 'Title' from CSV to 'title' in Movie entity
        //             director : row.Director, // Map 'Director' from CSV to 'director' in Movie entity
        //             year : row.Year, // Map 'Year' from CSV to 'year' in Movie entity
        //             country : row.Country, // Map 'Country' from CSV to 'country' in Movie entity
        //             genre : row.Genre, // Map 'Genre' from CSV to 'genre' in Movie entity
        //             colour : row.Colour, // Map 'Colour' from CSV to 'colour' in Movie entity
        //         }
        //         // console.log("movie --> ",movie)
        //         // const result = await queryRunner.manager.insert(MovieEntity, movie);
        //         // await entityManager.save('Movie', movie);
        //         movies.push(movie);
        //     } catch (error) {
        //         console.error(`Error inserting movie: ${error.message}`);
        //     }
        // })
        // .on('end', async () => {
        //     console.log(movies)
        //     const result = await queryRunner.manager.insert(MovieEntity, movies);
        //     console.log('CSV file successfully processed',movies);
        // });
        const csvFilePath = 'src/database/seeders/GreatestFilms.csv'
        csv()
            .fromFile(csvFilePath)
            .then((jsonObj) => {
                console.log(jsonObj);
            })

        // Async / await usage
        const jsonArray: any = await csv().fromFile(csvFilePath);
        for (let i = 0; i < jsonArray.length; i++) {
            const movie: MovieI = {
                title: jsonArray[i].Title, // Map 'Title' from CSV to 'title' in Movie entity
                director: jsonArray[i].Director, // Map 'Director' from CSV to 'director' in Movie entity
                year: jsonArray[i].Year, // Map 'Year' from CSV to 'year' in Movie entity
                country: jsonArray[i].Country, // Map 'Country' from CSV to 'country' in Movie entity
                genre: jsonArray[i].Genre, // Map 'Genre' from CSV to 'genre' in Movie entity
                colour: jsonArray[i].Colour, // Map 'Colour' from CSV to 'colour' in Movie entity
            }
            await queryRunner.manager.insert(MovieEntity, movie);
            console.log("Done.")
        }
    }
    public async down(queryRunner: QueryRunner): Promise<void> {
        // Rollback logic if needed
    }
}