import { ApiResponse } from "@/types";

function isServer() {
  return typeof window === "undefined";
}

function getBaseUrl() {
  if (isServer()) {
    return process.env.API_URL || process.env.NEXT_PUBLIC_API_URL;
  }

  return process.env.NEXT_PUBLIC_API_URL;
}

async function refreshToken(): Promise<boolean> {
  try {
    const baseUrl = getBaseUrl();
    const refreshToken = localStorage.getItem("refreshToken");
    if (!refreshToken || !baseUrl) return false;

    const res = await fetch(`${baseUrl}/api/auth/refresh-token`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ refreshToken }),
      credentials: "include",
    });

    if (!res.ok) return false;
    const data = await res.json();
    if (data?.success && data?.data?.accessToken) {
      localStorage.setItem("accessToken", data.data.accessToken);
      if (data.data.refreshToken) {
        localStorage.setItem("refreshToken", data.data.refreshToken);
      }
      return true;
    }
    return false;
  } catch {
    return false;
  }
}

function getAccessToken(): string | null {
  if (typeof window === "undefined") return null;
  return window.localStorage.getItem("accessToken");
}

function clearAccessToken() {
  if (typeof window === "undefined") return;
  window.localStorage.removeItem("accessToken");
}

export async function apiFetch<T>(
  endpoint: string,
  options: RequestInit = {},
): Promise<ApiResponse<T>> {
  const baseUrl = getBaseUrl();

  if (!baseUrl) {
    throw new Error(
      isServer()
        ? "API_URL or NEXT_PUBLIC_API_URL is not configured"
        : "NEXT_PUBLIC_API_URL is not configured",
    );
  }

  const url = `${baseUrl}${endpoint}`;

  const token = getAccessToken();
  const serverSide = isServer();

  const makeRequest = async (withAuth: boolean): Promise<Response> => {
    const headers: Record<string, string> = {
      "Content-Type": "application/json",
      ...((options.headers as Record<string, string>) || {}),
    };

    if (withAuth && token) {
      headers["Authorization"] = `Bearer ${token}`;
    }

    return fetch(url, {
      ...options,
      headers,
      ...(serverSide
        ? {}
        : {
            credentials: "include" as RequestCredentials,
          }),
    });
  };

  let response = await makeRequest(true);

  if (!serverSide && response.status === 401) {
    const refreshed = await refreshToken();
    if (refreshed) {
      response = await makeRequest(true);
    } else {
      clearAccessToken();
      if (typeof window !== "undefined") {
        window.location.href = "/login";
      }
      throw new Error("Authentication expired. Redirecting to login.");
    }
  }

  if (!response.ok) {
    let message = `Request failed with status ${response.status}`;
    try {
      const json = await response.json();
      if (json?.message) message = json.message;
    } catch {
      // ignore
    }
    throw new Error(message);
  }

  return response.json() as Promise<ApiResponse<T>>;
}
