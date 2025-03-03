"use server";
import { IState } from "@/app/interfaces/auth";
import { createSession, deleteSession } from "../lib/session";
import { redirect } from "next/navigation";
import { fetchAuth } from "@/app/lib/fetchAuth";
const url = process.env.API_URL ? process.env.API_URL : "";

export async function signin(
  prevState: IState | null,
  formData: FormData
): Promise<IState> {
  const credentials = Object.fromEntries(formData.entries());
  const { email, password } = credentials;

  if (!email || !password) {
    return {
      status: "error",
      message: "The email or password field is not present",
    };
  }

  const response = await fetch(`${url}/auth/signin`, {
    method: "POST",
    body: JSON.stringify({ email, password }),
    headers: {
      "Content-Type": "application/json",
    },
  });

  // Verifica se a resposta está ok (status 200-299)
  if (!response.ok) {
    const responseJson = await response.json();
    return {
      status: "error",
      message: responseJson.message,
    };
  }

  const payload = await response.text();

  //payload.user = await getUser(payload);
  await createSession(payload);
  redirect("/");
}

export async function logout() {
  await fetchAuth(`${url}/v1/auth/logout`, {
    method: "POST",
  });
  await deleteSession();
  redirect("/login");
}
