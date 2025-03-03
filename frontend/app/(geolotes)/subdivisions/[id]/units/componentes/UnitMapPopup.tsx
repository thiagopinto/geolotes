"use client";

import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Feature } from "ol";
import { Geometry } from "ol/geom";
import Fill from "ol/style/Fill";
import Stroke from "ol/style/Stroke";
import Style from "ol/style/Style";
import Text from "ol/style/Text";
import React from "react";

interface PopupProps {
  coordinate: [number, number] | null;
  feature: Feature<Geometry> | null;
  onClose: () => void;
  position: "top" | "bottom" | "left" | "right";
}

const UnitMapPopup = ({
  coordinate,
  feature,
  onClose,
  position,
}: PopupProps) => {
  if (!coordinate || !feature) return null;

  const handleChangeName = (event: React.ChangeEvent<HTMLInputElement>) => {
    const name = event.target.value;
    feature.set("name", name);

    feature.setStyle(
      new Style({
        fill: new Fill({ color: "rgba(0, 255, 0, 0.3)" }),
        stroke: new Stroke({ color: "green", width: 2 }),
        text: new Text({
          text: name,
          font: "14px Arial",
          fill: new Fill({ color: "#000" }),
          stroke: new Stroke({ color: "#fff", width: 2 }),
        }),
      })
    );
  };
  return (
    <div className="relative w-fit">
      {/* Seta */}
      {/*       <div className="absolute left-1 top-0 -translate-x-1/2 -translate-y-1 w-4 h-4 bg-white rotate-45 shadow-md"></div>
       */}{" "}
      <div
        className={`absolute w-4 h-4 bg-white rotate-45
            ${
              position === "top"
                ? "left-1/2 -bottom-0 transform -translate-x-1/2"
                : ""
            }
            ${
              position === "bottom"
                ? "left-1/2 -top-0 transform -translate-x-1/2"
                : ""
            }
            ${
              position === "left"
                ? "top-1/2 -right-0 transform -translate-y-1/2"
                : ""
            }
            ${
              position === "right"
                ? "top-1/2 -left-0 transform -translate-y-1/2"
                : ""
            }
          `}
      ></div>
      {/* Card */}
      <Card
        className={`w-48 absolute ${
          position === "top"
            ? "bottom-full left-1/2 transform -translate-x-1/2 mb-2"
            : ""
        }
          ${
            position === "bottom"
              ? "top-full left-1/2 transform -translate-x-1/2 mt-2"
              : ""
          }
          ${
            position === "left"
              ? "right-full top-1/2 transform -translate-y-1/2 mr-2"
              : ""
          }
          ${
            position === "right"
              ? "left-full top-1/2 transform -translate-y-1/2 ml-2"
              : ""
          }
        `}
      >
        <div className="flex justify-between items-center p-1">
          <span>Title</span>
          <Button
            className="rounded-full"
            size="sm"
            variant="ghost"
            onClick={onClose}
          >
            X
          </Button>
        </div>
        <div className="p-1">
          <p className="text-gray-700">
            <Label>
              Identificação:
              <Input
                defaultValue={feature.get("name")}
                onChange={(e) => handleChangeName(e)}
              />
            </Label>
          </p>
        </div>
      </Card>
    </div>
  );
};

export default UnitMapPopup;
