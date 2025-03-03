import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { UserPlus, UserPen, Search, Loader } from "lucide-react";
import { Form as FormProvider } from "@/components/ui/form";
import { SubmitHandler, useForm } from "react-hook-form";
import { FormInput } from "@/app/components/form/FormInput";
import { useToast } from "@/hooks/use-toast";
import { Dispatch, SetStateAction, useState } from "react";
import { handlerError } from "@/app/lib/error";
import { FormInputMask } from "@/app/components/form/FormInputMask";
import { IPaginationResponse } from "@/app/interfaces/pagination";
import { ICustomer } from "../interfaces/customer";

export default function CustomerDialog({
  customer,
  createCustomer,
  updateCustomer,
  setCustomers,
}: {
  customer?: ICustomer;
  createCustomer?: (user: ICustomer) => Promise<ICustomer>;
  updateCustomer?: (user: ICustomer) => Promise<ICustomer>;
  setCustomers: Dispatch<SetStateAction<IPaginationResponse<ICustomer> | null>>;
}) {
  const [open, setOpen] = useState(false);
  const [isPending, setIsPending] = useState(false);
  const controller = new AbortController(); // Crie o AbortController

  const form = useForm<ICustomer>({
    mode: "all",
    defaultValues: {
      name: customer?.name || "",
      document: customer?.document || "",
      email: customer?.email || "",
      phone: customer?.phone || "",
      address: customer?.address || "",
    },
  });

  const handleSearchAddress = async () => {
    setIsPending(true);

    const postalCode = form.getValues("postalCode");

    try {
      const signal = controller.signal; // Obtenha o signal do controller

      const response = await fetch(
        `https://viacep.com.br/ws/${postalCode.replace("-", "")}/json/`,
        { signal } // Passe o signal para o fetch
      );

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      console.log(data);
      form.setValue("address", data.logradouro);
      form.setValue("neighborhood", data.bairro);
      form.setValue("city", data.localidade);
      form.setValue("state", data.uf);
    } catch (error) {
      if (error instanceof Error && error.name === "AbortError") {
        console.log("Fetch aborted");
        return; // Não trate o erro se foi abortado
      }
      console.error("Erro ao consultar CEP:", error);
      // Trate outros erros
    } finally {
      setIsPending(false);
    }
  };

  const { toast } = useToast();

  const onSubmit: SubmitHandler<ICustomer> = async (data: ICustomer) => {
    if (customer) {
      try {
        setIsPending(true);
        if (updateCustomer) {
          const newCustomer = await updateCustomer({ ...customer, ...data });
          toast({
            title: "Sucesso",
            description: "Cliente salvo salva!",
          });

          if (newCustomer) {
            setCustomers((prev) => {
              if (!prev) return null;
              const updatedUsers = prev?.data.map((u) => {
                if (u.id === newCustomer.id) {
                  return newCustomer;
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
        if (createCustomer) {
          await createCustomer({ ...data });

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

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button className="ml-4 mb-1">
          {!customer ? (
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
      <DialogContent className="sm:max-w-[600px] md:max-w-[700px] lg:max-w-[800px] xl:max-w-[900px] 2xl:max-w-[1000px]">
        <DialogHeader>
          <DialogTitle>
            {customer ? `Cadastro do ${customer.name}` : `Novo Cadastro`}
          </DialogTitle>
          <DialogDescription>
            {customer && (
              <span>
                Última atualização{" "}
                {new Date(customer.updatedAt).toLocaleDateString("pt-BR")}
              </span>
            )}
          </DialogDescription>
        </DialogHeader>
        <FormProvider {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)}>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4">
              <div className="space-y-4">
                <div className="mb-4">
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
                  <FormInput
                    control={form.control}
                    name="document"
                    label="Documento"
                    type="text"
                    placeholder="Digite seu documento"
                    rules={{
                      required: "O documento é obrigatório",
                    }}
                    disabled={isPending}
                  />
                </div>
                <div className="mb-4">
                  <FormInput
                    control={form.control}
                    name="email"
                    label="Email"
                    type="email"
                    placeholder="Digite seu email"
                    rules={{
                      required: "O email é obrigatório",
                      pattern: {
                        value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
                        message: "Digite um email válido",
                      },
                    }}
                    disabled={isPending}
                  />
                </div>
                <div className="mb-4">
                  <FormInputMask
                    control={form.control}
                    name="phone"
                    label="Telefone"
                    mask="(99) 9 9999-9999"
                    placeholder="Digite seu Telefone"
                    rules={{
                      required: "O telefone é obrigatório",
                    }}
                    disabled={isPending}
                  />
                </div>
              </div>
              <div className="space-y-4">
                <div className="mb-4">
                  <FormInputMask
                    control={form.control}
                    name="postalCode"
                    label="CEP"
                    mask="99999-999"
                    placeholder="Digite seu cep"
                    rules={{
                      required: "O Endereço é obrigatório",
                    }}
                    disabled={isPending}
                  >
                    <Button
                      onClick={handleSearchAddress}
                      disabled={isPending}
                      className="mb-1"
                    >
                      {isPending ? (
                        <Loader className="h-4 w-4 animate-spin" size={16} />
                      ) : (
                        <Search className="h-4 w-4" size={16} />
                      )}
                    </Button>
                  </FormInputMask>
                </div>
                <div className="flex gap-2">
                <div className="mb-4 grow">
                  <FormInput
                    control={form.control}
                    name="address"
                    label="Endereço"
                    type="text"
                    placeholder="Digite seu endereço"
                    rules={{
                      required: "O Endereço é obrigatório",
                    }}
                    disabled={isPending}
                  />
                </div>
                <div className="mb-4 w-16">
                  <FormInput
                    control={form.control}
                    name="number"
                    label="Num."
                    type="text"
                    placeholder="123"
                    rules={{
                      required: "O Número é obrigatório",
                    }}
                    disabled={isPending}
                  />
                </div>
                </div>

                <div className="mb-4">
                  <FormInput
                    control={form.control}
                    name="neighborhood"
                    label="Bairro"
                    type="text"
                    placeholder="Digite seu bairro"
                    rules={{
                      required: "O Bairro é obrigatório",
                    }}
                    disabled={isPending}
                  />
                </div>
                <div className="flex gap-2">
                  <div className="mb-4 grow">
                    <FormInput
                      control={form.control}
                      name="city"
                      label="Cidade"
                      type="text"
                      placeholder="Digite sua cidade"
                      rules={{
                        required: "A Cidade é obrigatória",
                      }}
                      disabled={isPending}
                    />
                  </div>
                  <div className="mb-4 w-16">
                    <FormInput
                      control={form.control}
                      name="state"
                      label="Estado"
                      type="text"
                      placeholder="XX"
                      rules={{
                        required: "O Estado é obrigatório",
                      }}
                      disabled={isPending}
                    />
                  </div>
                </div>
              </div>
            </div>

            <div className="flex justify-end">
              <Button
                type="submit"
                className="w-full"
                disabled={!form.formState.isValid} // Desativa o botão
              >
                {isPending
                  ? "Aguarde..."
                  : customer
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
