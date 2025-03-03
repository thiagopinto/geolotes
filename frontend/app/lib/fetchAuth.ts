import { IFetchOptions } from "../interfaces/fetch";
import { getAccessToken } from "./auth";
import { buildQueryString } from "./params";

export async function fetchAuth<T>(
  url: string,
  options: IFetchOptions = {}
): Promise<T> {
  // Obtém o token de acordo com o ambiente
  const token = await getAccessToken();

  // Create a new Headers object
  const headers = new Headers(options.headers);

  // Definir "Content-Type" somente se não for FormData
  if (!(options.body instanceof FormData)) {
    headers.set("Content-Type", "application/json");
  }

  // Adiciona o token no header apenas se ele existir
  if (token) {
    headers.set("Authorization", `Bearer ${token}`);
  }

  let finalUrl = url;
  if (options.query) {
    // Convert query params to the expected format
    const convertedQuery: Record<string, string | string[]> = {};
    for (const [key, value] of Object.entries(options.query)) {
      if (value === null || value === undefined) {
        continue;
      }
      if (Array.isArray(value)) {
        convertedQuery[key] = value.map(String);
      } else {
        convertedQuery[key] = String(value);
      }
    }
    const queryString = buildQueryString(convertedQuery);
    finalUrl = `${url}?${queryString}`;
  }

  try {
    const response = await fetch(finalUrl, {
      ...options,
      headers,
    });

    return (await response.json()) as T;
  } catch (error) {
    throw error;
    ;
  }
}
