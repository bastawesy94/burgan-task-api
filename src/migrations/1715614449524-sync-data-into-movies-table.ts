import { MigrationInterface, QueryRunner } from "typeorm";
import fs from "fs";
import csvParser from "csv-parser";

export class SyncDataIntoMoviesTable1715614449524 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<void> {
        // Read CSV file and print contents in console
        fs.createReadStream('1000GreatestFilms.csv')
            .pipe(csvParser())
            .on('data', (row) => {
                console.log("-------------->",row); // Print each row in console
            })
            .on('end', () => {
                console.log('CSV file successfully processed');
            });
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        // Rollback logic if needed
    }
}