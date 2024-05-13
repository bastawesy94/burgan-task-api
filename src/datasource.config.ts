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
export default datasource;