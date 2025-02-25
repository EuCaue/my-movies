import {
  useMutation,
  useQuery,
  useQueryClient,
  UseMutationOptions,
  UseQueryOptions,
} from "@tanstack/react-query";

async function fetchData(endpoint: string, token?: string) {
  if (!token) throw new Error("Invalid Token");

  const response = await fetch(`/api/fetchProxy?endpoint=${endpoint}`, {
    headers: { Authorization: `Bearer ${token}` },
  });

  if (!response.ok) throw new Error("Error while fetching data...");

  return response.json();
}

type SendData = {
  endpoint: string;
  method: "POST" | "PUT" | "DELETE";
  body?: any;
  token?: string;
  id?: number;
};

async function sendData({ endpoint, method, body, token, id }: SendData) {
  if (!token) throw new Error("Invalid Token");
  const url = id
    ? `/api/fetchProxy?endpoint=${endpoint}/${id}`
    : `/api/fetchProxy?endpoint=${endpoint}`;
  const response = await fetch(url, {
    method,
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(body) ?? {},
  });

  if (!response.ok) {
    const errorData = await response.json();
    throw { message: "Request failed", details: errorData };
  }

  return response.json();
}

type UseAuthQueryOptions = {
  queryOptions?: Omit<
    UseQueryOptions<any, any, any, any>,
    "queryFn" | "queryKey"
  >;
  postOptions?: UseMutationOptions<any, any, any, any>;
  updateOptions?: UseMutationOptions<any, any, any, any>;
  deleteOptions?: UseMutationOptions<any, any, any, any>;
};

export function useAuthQuery(
  endpoint: string,
  token?: string,
  options?: UseAuthQueryOptions,
) {
  const queryClient = useQueryClient();

  const query = useQuery({
    queryKey: [endpoint, token],
    queryFn: () => fetchData(endpoint, token),
    enabled: !!token,
    ...options?.queryOptions,
  });

  const postMutation = useMutation({
    mutationFn: (body: any) =>
      sendData({ endpoint, method: "POST", body, token }),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: [endpoint] }),
    ...options?.postOptions,
  });

  const updateMutation = useMutation({
    mutationFn: ({ id, ...data }: { id: number; [key: string]: any }) =>
      sendData({ endpoint, method: "PUT", body: data, token, id }),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: [endpoint] }),
    ...options?.updateOptions,
  });

  const deleteMutation = useMutation({
    mutationFn: ({ id, ...data }: { id: number; [key: string]: any }) =>
      sendData({ endpoint, method: "DELETE", body: data, token, id }),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: [endpoint] }),
    ...options?.deleteOptions,
  });

  return { query, postMutation, updateMutation, deleteMutation };
}
