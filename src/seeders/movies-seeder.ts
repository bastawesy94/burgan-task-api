import * as fs from 'fs';
import * as csvParser from 'csv-parser';
import { EntityManager } from 'typeorm';
import { MovieI } from 'src/movie/models/movie.interface';

import { TypeOrmModuleOptions } from '@nestjs/typeorm';
import {DataSourceOptions} from 'typeorm';
import * as dotenv from 'dotenv';
import { DataSource } from "typeorm";

dotenv.config();

console.log("################### CONFIG ", process.env.DB_URL);
const typeOrmConfig: TypeOrmModuleOptions = {
    type: 'postgres',
    url:process.env.DB_URL,
    synchronize: false,
    migrations: [__dirname + '/../../typeorm-migrations/*.{ts,js}'],  
    entities: [__dirname + '/**/*.entity{.ts,.js}'],
};
const datasource = new DataSource(typeOrmConfig as DataSourceOptions) ; // config is one that is defined in datasource.config.ts file
datasource.initialize();

async function seed() {
    const entityManager = new EntityManager(datasource); // Create a new instance of EntityManager

    fs.createReadStream('src/seeders/GreatestFilms.csv')
        .pipe(csvParser())
        .on('data', async (row) => {
            try {
                const movie:MovieI =  {
                    title : row.Title, // Map 'Title' from CSV to 'title' in Movie entity
                    director : row.Director, // Map 'Director' from CSV to 'director' in Movie entity
                    year : new Date(row.Year), // Map 'Year' from CSV to 'year' in Movie entity
                    country : row.Country, // Map 'Country' from CSV to 'country' in Movie entity
                    genre : row.Genre, // Map 'Genre' from CSV to 'genre' in Movie entity
                    colour : row.Colour, // Map 'Colour' from CSV to 'colour' in Movie entity
                }
                // console.log("movie --> ",movie)
                const query = `
                    INSERT INTO movie_entity (title, director, year, country, genre, colour)
                    VALUES ($1, $2, $3, $4, $5, $6)
                `;
                await entityManager.query(query, [movie]);
                // await entityManager.save('Movie', movie);
                // console.log(`Inserted movie: ${movie.title}`);
            } catch (error) {
                console.error(`Error inserting movie: ${error.message}`);
            }
        })
        .on('end', () => {
            console.log('CSV file successfully processed');
        });
}

seed();
