import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { UserPlus, UserPen } from "lucide-react";
import {
  Form as FormProvider,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { SubmitHandler, useForm } from "react-hook-form";
import { FormInput } from "@/app/components/form/FormInput";
import { useToast } from "@/hooks/use-toast";
import { Dispatch, SetStateAction, useState } from "react";
import { handlerError } from "@/app/lib/error";
import { IPaginationResponse } from "@/app/interfaces/pagination";
import { ISubdivision } from "../interfaces/subdivisions";
import SubdivisionMap from "./SubdivisionMap";
import { IGeometry } from "@/app/interfaces/geojson";

export default function SubdivisionDialog({
  subdivision,
  createSubdivision,
  updateSubdivision,
  setSubdivisions,
}: {
  subdivision?: ISubdivision;
  createSubdivision?: (user: ISubdivision) => Promise<ISubdivision>;
  updateSubdivision?: (user: ISubdivision) => Promise<ISubdivision>;
  setSubdivisions: Dispatch<
    SetStateAction<IPaginationResponse<ISubdivision> | null>
  >;
}) {
  const [open, setOpen] = useState(false);
  const [isPending, setIsPending] = useState(false);

  const form = useForm<ISubdivision>({
    mode: "all",
    defaultValues: {
      name: subdivision?.name || "",
      geojson: subdivision?.geojson || "",
    },
  });

  const { toast } = useToast();

  const onSubmit: SubmitHandler<ISubdivision> = async (data: ISubdivision) => {
    if (subdivision) {
      try {
        setIsPending(true);
        if (updateSubdivision) {
          const newSubdivision = await updateSubdivision({
            ...subdivision,
            ...data,
            geojson: JSON.parse(`${data.geojson}`),
          });
          toast({
            title: "Sucesso",
            description: "Cliente salvo salva!",
          });

          if (newSubdivision) {
            setSubdivisions((prev) => {
              if (!prev) return null;
              const updatedUsers = prev?.data.map((u) => {
                if (u.id === newSubdivision.id) {
                  return newSubdivision;
                }
                return u;
              });
              return { ...prev, data: updatedUsers };
            });

            setOpen(false);
          }
        }
      } catch (error) {
        handlerError(error);
      } finally {
        setIsPending(false);
      }
    } else {
      try {
        setIsPending(true);
        if (createSubdivision) {
          const newSubdivision = await createSubdivision({
            ...data,
            geojson: JSON.parse(`${data.geojson}`),
          });

          setSubdivisions((prev) => {
            if (!prev) return null;
            return { ...prev, data: [newSubdivision, ...prev.data] };
          });

          toast({
            title: "Sucesso",
            description: "Cliente salvo salva!",
          });

          setOpen(false);
        }
      } catch (error) {
        handlerError(error);
      } finally {
        setIsPending(false);
      }
    }
  };

  const handleChangeGeoJson = (value: IGeometry) => {
    form.setValue("geojson", JSON.stringify(value));
    form.trigger("geojson");
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button className="ml-4 mb-1">
          {!subdivision ? (
            <>
              <UserPlus className="h-4 w-4 mr-2" />
              Adicionar
            </>
          ) : (
            <>
              <UserPen className="h-4 w-4" />
            </>
          )}
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[600px] md:max-w-[800px] lg:max-w-[1000px] xl:max-w-[1200px] 2xl:max-w-[1400px]">
        <DialogHeader>
          <DialogTitle>
            {subdivision ? `Cadastro do ${subdivision.name}` : `Novo Cadastro`}
          </DialogTitle>
          <DialogDescription>
            {subdivision && (
              <span>
                Última atualização{" "}
                {new Date(subdivision.updatedAt).toLocaleDateString("pt-BR")}
              </span>
            )}
          </DialogDescription>
        </DialogHeader>
        <FormProvider {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)}>
            <div className="">
              <FormInput
                control={form.control}
                name="name"
                label="Nome"
                type="text"
                placeholder="Digite seu nome"
                rules={{
                  required: "O nome é obrigatório",
                }}
                disabled={isPending}
              />
            </div>
            <div className="mb-4">
              <FormField
                control={form.control}
                name="geojson"
                rules={{
                  required: "O mapa é obrigatório",
                }}
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Map</FormLabel>
                    <FormControl>
                      <div>
                        <input
                          type="hidden"
                          {...field}
                          value={JSON.stringify(field.value)}
                          disabled={isPending}
                        />
                        <SubdivisionMap
                          handleChangeGeoJson={handleChangeGeoJson}
                          subdivision={subdivision}
                        />
                      </div>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            <div className="flex justify-end">
              <Button
                type="submit"
                className="w-full"
                disabled={!form.formState.isValid} // Desativa o botão
              >
                {isPending
                  ? "Aguarde..."
                  : subdivision
                  ? "Atualizar"
                  : "Cadastrar"}
              </Button>
            </div>
          </form>
        </FormProvider>
      </DialogContent>
    </Dialog>
  );
}
