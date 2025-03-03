import { IsNotEmpty, IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { IGeometry } from 'src/common/interfaces/geojson';
export class CreateSubdivisionDto {
  @ApiProperty({
    description: 'The name of the subdivision',
    example: 'Subdivision 1',
  })
  @IsString()
  @IsNotEmpty()
  name: string;

  @ApiProperty({
    description: 'The geojson of the subdivision',
    example:
      '{"type": "FeatureCollection", "features": [{"type": "Feature", "geometry": {"type": "Polygon", "coordinates": [[[100, 0], [101, 0], [101, 1], [100, 1], [100, 0]]]}, "properties": {}}]}',
  })
  @IsNotEmpty()
  geojson: IGeometry;
}
