import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  CreateDateColumn,
  UpdateDateColumn,
} from 'typeorm';
import { Subdivision } from '../../subdivision/entities/subdivision.entity';
import { ApiProperty } from '@nestjs/swagger';
import { Contract } from '../../contract/entities/contract.entity';
import { IGeometry } from 'src/common/interfaces/geojson';

@Entity()
export class Unit {
  @ApiProperty({ description: 'The id of the unit' })
  @PrimaryGeneratedColumn()
  id: number;

  @ApiProperty({ description: 'The identifier of the unit' })
  @Column()
  identifier: string; // Número do lote, ex: "Lote 12"

  @ApiProperty({ description: 'The geojson of the subdivision' })
  @Column('geometry', { spatialFeatureType: 'Polygon', srid: 4326 }) // GeoJSON para a área do loteamento
  geojson: IGeometry;

  @Column()
  subdivisionId: number;

  @ApiProperty({ description: 'The created at date of the unit' })
  @CreateDateColumn()
  createdAt: Date;

  @ApiProperty({ description: 'The updated at date of the unit' })
  @UpdateDateColumn()
  updatedAt: Date;

  @ManyToOne(() => Subdivision, (subdivision) => subdivision.units)
  subdivision: Subdivision;

  @ManyToOne(() => Contract, (contract) => contract.units)
  contract: Contract;
}
