import { WatchListEntity } from '../../watch-list/models/watch-list.entity';
import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm';

@Entity({ name: 'movies' })
export class MovieEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  title: string;

  @Column()
  director: string;

  @Column()
  year: number;

  @Column()
  country: string;

  @Column()
  genre: string;

  @Column()
  colour: string;

  @Column({ nullable: true })
  overview: string;

  @Column({ nullable: true })
  adult: boolean;

  @Column({ nullable: true })
  poster_path: string;

  @Column('decimal', { precision: 6, scale: 2, nullable: true })
  vote_average: number;

  @Column({ nullable: true })
  vote_count: number;

  @Column('decimal', { precision: 6, scale: 2, nullable: true })
  popularity: number;

  @OneToMany(() => WatchListEntity, (watchListEntity) => watchListEntity.movie)
  watchList: WatchListEntity[];
}
