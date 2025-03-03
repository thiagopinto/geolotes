import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  OneToMany,
  CreateDateColumn,
  UpdateDateColumn,
} from 'typeorm';
import { Unit } from '../../unit/entities/unit.entity';
import { ApiProperty } from '@nestjs/swagger';
import { IGeometry } from 'src/common/interfaces/geojson';
@Entity()
export class Subdivision {
  @ApiProperty({ description: 'The id of the subdivision' })
  @PrimaryGeneratedColumn()
  id: number;

  @ApiProperty({ description: 'The name of the subdivision' })
  @Column()
  name: string;

  @ApiProperty({ description: 'The geojson of the subdivision' })
  @Column('geometry', { spatialFeatureType: 'Polygon', srid: 4326 }) // GeoJSON para a área do loteamento
  geojson: IGeometry;

  @ApiProperty({ description: 'The created at date of the subdivision' })
  @CreateDateColumn()
  createdAt: Date;

  @ApiProperty({ description: 'The updated at date of the subdivision' })
  @UpdateDateColumn()
  updatedAt: Date;

  @OneToMany(() => Unit, (unit) => unit.subdivision)
  units: Unit[];
}
