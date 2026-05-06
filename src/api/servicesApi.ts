const API_URL = import.meta.env.VITE_API_URL;

export interface Service {
  id: string;
  name: string;
  category: string;
}

// PUBLIC: Fetch all services
export const getPublicServicesApi = async (): Promise<{ success: boolean; services: Service[] }> => {
  const response = await fetch(`${API_URL}/public/services`);
  if (!response.ok) throw new Error("Failed to fetch services");
  return response.json();
};

// ADMIN: Fetch all services
export const getAdminServicesApi = async (): Promise<{ success: boolean; services: Service[] }> => {
  const token = localStorage.getItem("token");
  const response = await fetch(`${API_URL}/admin/services`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  if (!response.ok) throw new Error("Failed to fetch admin services");
  return response.json();
};

// ADMIN: Create a service
export const createServiceApi = async (data: { name: string; category: string }): Promise<{ success: boolean; service: Service }> => {
  const token = localStorage.getItem("token");
  const response = await fetch(`${API_URL}/admin/services`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(data),
  });
  if (!response.ok) throw new Error("Failed to create service");
  return response.json();
};

// ADMIN: Delete a service
export const deleteServiceApi = async (id: string): Promise<{ success: boolean; message: string }> => {
  const token = localStorage.getItem("token");
  const response = await fetch(`${API_URL}/admin/services/${id}`, {
    method: "DELETE",
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  if (!response.ok) throw new Error("Failed to delete service");
  return response.json();
};
