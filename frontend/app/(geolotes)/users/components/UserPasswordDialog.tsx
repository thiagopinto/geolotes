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
import { KeyRound } from "lucide-react";
import { Form as FormProvider } from "@/components/ui/form";
import { SubmitHandler, useForm } from "react-hook-form";
import { FormInput } from "@/app/components/form/FormInput";
import { useToast } from "@/hooks/use-toast";
import { useState } from "react";
import { handlerError } from "@/app/lib/error";

export default function UserPasswordDialog({
  user,
  updateUser,
}: {
  user: IUser;
  updateUser?: (user: IUser) => Promise<IUser>;
}) {
  const [open, setOpen] = useState(false);
  const [isPending, setIsPending] = useState(false);

  const form = useForm<{ password: string; confirmPassword: string }>({
    mode: "all",
  });

  const { toast } = useToast();

  const onSubmit: SubmitHandler<{
    password: string;
    confirmPassword: string;
  }> = async (data: { password: string; confirmPassword: string }) => {
    try {
      setIsPending(true);
      if (updateUser) {
        await updateUser({ ...user, password: data.password });
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
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button className="ml-4">
          <KeyRound className="h-4 w-4" />
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>`Atualizar senha ${user.name}`</DialogTitle>
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
            <div className="mb-4 mb-1">
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

            <div className="flex justify-end">
              <Button
                type="submit"
                className="w-full"
                disabled={!form.formState.isValid} // Desativa o botão
              >
                {isPending ? "Aguarde..." : "Atualizar"}
              </Button>
            </div>
          </form>
        </FormProvider>
      </DialogContent>
    </Dialog>
  );
}
