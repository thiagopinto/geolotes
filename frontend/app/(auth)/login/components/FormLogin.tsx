"use client";

import { IFormLoginValues, IState } from "@/app/interfaces/auth";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
} from "@/components/ui/card";
import { Form as FormProvider } from "@/components/ui/form";
import React, { useActionState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { signin } from "../actions";
import { toast } from "@/hooks/use-toast";
import { FormInput } from "@/app/components/form/FormInput";

export default function FormLogin() {
  const form = useForm<IFormLoginValues>({
    mode: "all",
  });

  // Estado da requisição (isPending indica se está carregando)
  const [state, actionSignin, isPending] = useActionState<IState, FormData>(
    signin,
    null
  );

  useEffect(() => {
    if (state?.status === "error") {
      toast({
        title: "Error",
        description: state.message,
        variant: "destructive",
      });
    }
  }, [form.formState.errors, state]);

  return (
    <FormProvider {...form}>
      <form action={actionSignin}>
        <Card className="w-96">
          <CardHeader>
            <h2 className="text-2xl font-bold">Login</h2>
          </CardHeader>
          <CardContent>
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
              <FormInput
                control={form.control}
                name="password"
                label="Senha"
                type="password"
                placeholder="Digite sua senha"
                rules={{
                  required: "A senha é obrigatória",
                  minLength: {
                    value: 6,
                    message: "A senha deve ter pelo menos 6 caracteres",
                  },
                }}
                disabled={isPending}
              />
            </div>
          </CardContent>
          <CardFooter>
            <Button
              type="submit"
              className="w-full"
              disabled={!form.formState.isValid || isPending} // Desativa o botão
            >
              {isPending ? "Aguarde..." : "Login"}
            </Button>
          </CardFooter>
        </Card>
      </form>
    </FormProvider>
  );
}
