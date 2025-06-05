import axios, { AxiosRequestConfig, AxiosResponse, Method } from "axios";
import * as SecureStore from "expo-secure-store";
import Constants from "expo-constants";

const apiUrl = Constants.expoConfig?.extra?.API_URL;

export interface ApiRequestOptions
  extends Omit<
    AxiosRequestConfig,
    "url" | "method" | "headers" | "data" | "params"
  > {
  url: string;
  method?: Method;
  data?: any;
  params?: Record<string, any>;
  headers?: Record<string, string>;
  config?: AxiosRequestConfig;
}

export async function apiRequest<T = any>({
  url,
  method = "get",
  data,
  params,
  headers = {},
  config = {},
}: ApiRequestOptions): Promise<AxiosResponse<T>> {
  let token = await SecureStore.getItemAsync("token");

  if (isTokenExpired(token)) {
    const uuid = await SecureStore.getItemAsync("uuid");
    if (uuid) {
      const res = await axios.post(apiUrl + "/auth/create-token", { uuid });
      token = res.data.accessToken as string;
      await SecureStore.setItemAsync("token", token);
    }
  }

  const mergedHeaders: Record<string, string> = {
    "Content-Type": "application/json",
    ...headers,
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
  };

  const requestConfig: AxiosRequestConfig = {
    url: apiUrl + url,
    method,
    data,
    params,
    headers: mergedHeaders,
    ...config,
  };

  return await axios<T>(requestConfig);
}

function isTokenExpired(token: string | null): boolean {
  if (!token) return true;
  try {
    const payload = token.split(".")[1];
    if (!payload) return true;

    const decoded = JSON.parse(
      atob(payload.replace(/-/g, "+").replace(/_/g, "/")),
    );

    const exp = decoded.exp;
    if (!exp) return true;

    const now = Math.floor(Date.now() / 1000);

    return now >= exp;
  } catch (e) {
    return true;
  }
}
