INSERT INTO "subdivision"("name", "geojson", "createdAt", "updatedAt")
VALUES (
        $1,
        ST_SetSRID(ST_GeomFromGeoJSON($2), 4326)::geometry,
        DEFAULT,
        DEFAULT
    )
RETURNING "id",
    "createdAt",
    "updatedAt" -- PARAMETERS: ["saofrancisco","\"{\\\"type\\\":\\\"FeatureCollection\\\",\\\"features\\\":[{\\\"type\\\":\\\"Feature\\\",\\\"geometry\\\":{\\\"type\\\":\\\"Polygon\\\",\\\"coordinates\\\":[[[-43.38399234809876,-4.849457283163071],[-43.368312154197696,-4.862223927521706],[-43.34574471809864,-4.850550953888893],[-43.38399234809876,-4.849457283163071]]]},\\\"properties\\\":null}]}\""]