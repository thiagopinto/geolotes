import { IsNotEmpty, IsString, IsNumber } from 'class-validator';
import { IGeometry } from 'src/common/interfaces/geojson';

export class CreateUnitDto {
  @IsNotEmpty()
  @IsString()
  identifier: string;

  @IsNotEmpty()
  geojson: IGeometry;

  @IsNotEmpty()
  @IsNumber()
  subdivisionId: number;
}
