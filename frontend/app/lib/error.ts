"use client";
import { toast } from "@/hooks/use-toast";

export function handlerError(error: Array<{ message: string }> | { message: string } | Error | unknown) {
  if (Array.isArray(error)) {
    error.map((e) => {
      toast({
        title: "Error",
        description: e.message,
        variant: "destructive",
      });
    });
  } else if (error instanceof Error) {

    toast({
      title: "Error",
      description: (error as { message: string }).message,
      variant: "destructive",
    });
  } else if (typeof error === 'object' && error !== null && 'message' in error) {

    toast({
      title: "Error",
      description: (error as { message: string }).message,
      variant: "destructive",
    });
  } else {
    // Caso o erro não seja uma instância de Error
    // console.log("Erro desconhecido", error);
    toast({
      title: "Error",
      description: JSON.stringify(error),
      variant: "destructive",
    });
  }
}
