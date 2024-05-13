import { Column, Entity, PrimaryGeneratedColumn } from "typeorm";

@Entity()
export class MovieEntity {

    @PrimaryGeneratedColumn()
    id: number;

    @Column({length:50})
    title: string;

    @Column({length:50})
    director: string;

    @Column()
    year: Date;

    @Column({length:50})
    country: string;

    @Column({length:50})
    genre: string;
    
    @Column({length:50})
    colour: string;
}