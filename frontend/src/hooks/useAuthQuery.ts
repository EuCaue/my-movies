import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

const fetchData = async (endpoint: string, token?: string) => {
  if (!token) throw new Error("Invalid Token");

  const response = await fetch(`/api/fetchProxy?endpoint=${endpoint}`, {
    headers: { Authorization: `Bearer ${token}` },
  });

  if (!response.ok) throw new Error("Error whille fetching data...");

  return response.json();
};

type SendData = {
  endpoint: string;
  method: "POST" | "PUT" | "DELETE";
  body?: any;
  token?: string;
  id?: string;
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

  if (!response.ok) throw new Error(`Error on ${method}`);

  return response.json();
}

export function useAuthQuery(endpoint: string, token?: string) {
  const queryClient = useQueryClient();

  // GET
  const query = useQuery({
    queryKey: [endpoint],
    queryFn: () => fetchData(endpoint, token),
    enabled: !!token, 
  });

  // POST
  const postMutation = useMutation({
    mutationFn: (body: any) =>
      sendData({ endpoint, method: "POST", body, token }),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: [endpoint] }),
  });

  // PUT
  const updateMutation = useMutation({
    mutationFn: ({ id, ...data }: { id: string; [key: string]: any }) =>
      sendData({ endpoint, method: "PUT", body: data, token, id }),
    onSuccess: () => query.refetch(),
  });

  // DELETE
  const deleteMutation = useMutation({
    mutationFn: ({ id, ...data }: { id: string; [key: string]: any }) =>
      sendData({ endpoint, method: "DELETE", body: data, token, id }),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: [endpoint] }),
    onError: (err) => console.error(err),
  });

  return { query, postMutation, updateMutation, deleteMutation };
}
