import { QueryClient, QueryFunction } from "@tanstack/react-query";

async function throwIfResNotOk(res: Response) {
  if (!res.ok) {
    let errorData;
    let errorMessage = res.statusText;
    
    try {
      // Try to parse the response as JSON
      const text = await res.text();
      try {
        errorData = JSON.parse(text);
        errorMessage = errorData.message || text || res.statusText;
      } catch (e) {
        // If parsing failed, use the text as is
        errorMessage = text || res.statusText;
      }
    } catch (e) {
      // If we couldn't get the text for some reason, just use the status text
      errorMessage = res.statusText;
    }
    
    // Create a custom error object with status and data
    const error: any = new Error(`${res.status}: ${errorMessage}`);
    error.status = res.status;
    error.data = errorData;
    throw error;
  }
}

export async function apiRequest(
  method: string,
  url: string,
  data?: unknown | undefined,
): Promise<Response> {
  const res = await fetch(url, {
    method,
    headers: data ? { "Content-Type": "application/json" } : {},
    body: data ? JSON.stringify(data) : undefined,
    credentials: "include",
  });

  await throwIfResNotOk(res);
  return res;
}

type UnauthorizedBehavior = "returnNull" | "throw";
export const getQueryFn: <T>(options: {
  on401: UnauthorizedBehavior;
}) => QueryFunction<T> =
  ({ on401: unauthorizedBehavior }) =>
  async ({ queryKey }) => {
    const res = await fetch(queryKey[0] as string, {
      credentials: "include",
    });

    if (unauthorizedBehavior === "returnNull" && res.status === 401) {
      return null;
    }

    await throwIfResNotOk(res);
    return await res.json();
  };

export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      queryFn: getQueryFn({ on401: "throw" }),
      refetchInterval: false,
      refetchOnWindowFocus: false,
      staleTime: Infinity,
      retry: false,
    },
    mutations: {
      retry: false,
    },
  },
});
