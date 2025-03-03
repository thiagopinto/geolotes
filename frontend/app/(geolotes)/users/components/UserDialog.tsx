import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { IUser } from "@/app/interfaces/auth";
import { UserPlus, UserPen } from "lucide-react";
import { Form as FormProvider } from "@/components/ui/form";
import { SubmitHandler, useForm } from "react-hook-form";
import { FormInput } from "@/app/components/form/FormInput";
import { useToast } from "@/hooks/use-toast";
import { Dispatch, SetStateAction, useState } from "react";
import { handlerError } from "@/app/lib/error";
import { FormSwitch } from "@/app/components/form/FormSwitch";
import { FormInputMask } from "@/app/components/form/FormInputMask";
import { IPaginationResponse } from "@/app/interfaces/pagination";

export default function UserDialog({
  user,
  createUser,
  updateUser,
  setUsers,
}: {
  user?: IUser;
  createUser?: (user: IUser) => Promise<IUser>;
  updateUser?: (user: IUser) => Promise<IUser>;
  setUsers: Dispatch<SetStateAction<IPaginationResponse<IUser> | null>>;
}) {
  const [open, setOpen] = useState(false);
  const [isPending, setIsPending] = useState(false);

  const form = useForm<
    IUser & { password: string } & { confirmPassword: string }
  >({
    mode: "all",
    defaultValues: {
      name: user?.name || "",
      email: user?.email || "",
      phone: user?.phone || "",
      isActive: user?.isActive || false,
    },
  });

  const { toast } = useToast();

  const onSubmit: SubmitHandler<IUser> = async (data: IUser) => {
    if (user) {
      try {
        setIsPending(true);
        if (updateUser) {
          const newUser = await updateUser({ ...user, ...data });
          toast({
            title: "Sucesso",
            description: "Usuário salvo salva!",
          });

          if (newUser) {
            setUsers((prev) => {
              if (!prev) return null;
              const updatedUsers = prev?.data.map((u) => {
                if (u.id === newUser.id) {
                  return newUser;
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
        if (createUser) {
          await createUser({ ...data });

          toast({
            title: "Sucesso",
            description: "Usuário salvo salva!",
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
          {!user ? (
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
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>
            {user ? `Cadastro do ${user.name}` : `Novo Cadastro`}
          </DialogTitle>
          <DialogDescription>
            {user && (
              <span>
                Última atualização
                {new Date(user.updatedAt).toLocaleDateString("pt-BR")}
              </span>
            )}
          </DialogDescription>
        </DialogHeader>
        <FormProvider {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)}>
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
            {!user && (
              <>
                <div className="mb-4">
                  <FormInput
                    control={form.control}
                    name="password"
                    label="Senha"
                    type="password"
                    placeholder="Digite sua melhor senha"
                    rules={{
                      required: "A senha é obrigatória",
                    }}
                    disabled={isPending}
                  />
                </div>
                <div className="mb-4">
                  <FormInput
                    control={form.control}
                    name="confirmPassword"
                    label="Confirmar Senha"
                    type="password"
                    placeholder="Digite seu Telefone"
                    rules={{
                      required: "A confirmação é obrigatória",
                      validate: (value) =>
                        value === form.getValues("password") ||
                        "As senhas não coincidem",
                    }}
                    disabled={isPending}
                  />
                </div>
              </>
            )}
            <div className="mb-4">
              <FormSwitch
                control={form.control}
                name="isActive"
                label="Ativo"
              />
            </div>
            <div className="flex justify-end">
              <Button
                type="submit"
                className="w-full"
                disabled={!form.formState.isValid} // Desativa o botão
              >
                {isPending ? "Aguarde..." : user ? "Atualizar" : "Cadastrar"}
              </Button>
            </div>
          </form>
        </FormProvider>
      </DialogContent>
    </Dialog>
  );
}
