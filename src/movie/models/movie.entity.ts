import { WatchListEntity } from "../../watch-list/models/watch-list.entity";
import { Column, Entity, ManyToMany, ManyToOne, OneToMany, PrimaryGeneratedColumn } from "typeorm";

@Entity({name: "movies"})
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

    @OneToMany(() => WatchListEntity, (watchListEntity) => watchListEntity.movie)
    watchList: WatchListEntity [];
}