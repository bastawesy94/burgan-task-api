import { WatchListEntity } from "../../watch-list/models/watch-list.entity";
import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from "typeorm";

@Entity({name: "users"})
export class UserEntity {

    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    userName: string;

    @Column({select: false})
    password: string;

    @OneToMany(() => WatchListEntity, (watchListEntity) => watchListEntity.movie)
    watchList: WatchListEntity [];
}