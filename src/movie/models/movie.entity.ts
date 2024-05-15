import { Column, Entity, PrimaryGeneratedColumn } from "typeorm";

@Entity()
export class MovieEntity {

    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    title: string;

    @Column()
    director: string;

    @Column()
    year: string;

    @Column()
    country: string;

    @Column()
    genre: string;

    @Column()
    colour: string;
}