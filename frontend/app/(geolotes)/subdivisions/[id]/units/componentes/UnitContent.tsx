"use client";

import { Card, CardContent } from "@/components/ui/card";
import { IUnit, IQueryUnitParams } from "../interfaces/unit";
import { useToast } from "@/hooks/use-toast";
import useUnitsService from "../service/use-units-service";
import { ISubdivision } from "../../../interfaces/subdivisions";
import UnitMap from "./UnitMap";
import { useEffect } from "react";

interface IUnitContentProps {
  subdivision: ISubdivision;
  initialData: IUnit[];
  initialQuery: IQueryUnitParams;
}

export default function UnitContent({
  subdivision,
  initialData,
  initialQuery,
}: IUnitContentProps) {
  const { units, error, deleteUnit, createUnit, updateUnit } =
    useUnitsService({
      initialData,
      initialQuery,
    });
  const { toast } = useToast();

  const handleChangeGeoJson = (value: IUnit[]) => {
    for (const unit of value) {
      console.log(unit);
      if (unit.id) {
        updateUnit(unit);
      } else {
        createUnit({
          ...unit,
          subdivisionId: subdivision.id,
        });
      }
    }
  };

  useEffect(() => {
    if (error) {
      toast({
        title: "Erro",
        description: error,
      });
    }

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [error]);

  if (!units || !initialData) return <p>Api indisponível.</p>;

  return (
    <Card className="w-full bg-white p-2">
      <CardContent className="flex justify-between">
        <UnitMap
          subdivision={subdivision}
          handleChangeGeoJson={handleChangeGeoJson}
          units={units}
          deleteUnit={deleteUnit}
        />
      </CardContent>
    </Card>
  );
}
