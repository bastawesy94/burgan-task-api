import { MovieEntity } from "../../movie/models/movie.entity";
import { UserEntity } from "../../user/models/user.entity";
import { BeforeInsert, Column, Entity, ManyToOne, OneToMany, PrimaryGeneratedColumn } from "typeorm";

@Entity("watch_lists")
export class WatchListEntity {

    @PrimaryGeneratedColumn()
    id: number;

    @ManyToOne(() => MovieEntity, (movieEntity) => movieEntity.watchList)
    movie: MovieEntity;

    @ManyToOne(() => UserEntity, (userEntity) => userEntity.watchList)
    user: UserEntity;
}