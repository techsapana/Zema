const API_URL = import.meta.env.VITE_API_URL;

export interface BookingSlot {
  id: string;
  time: string;
}

// PUBLIC: Fetch all slots
export const getPublicSlotsApi = async (): Promise<{ success: boolean; slots: BookingSlot[] }> => {
  const response = await fetch(`${API_URL}/public/slots`);
  if (!response.ok) throw new Error("Failed to fetch slots");
  return response.json();
};

// ADMIN: Fetch all slots
export const getAdminSlotsApi = async (): Promise<{ success: boolean; slots: BookingSlot[] }> => {
  const token = localStorage.getItem("token");
  const response = await fetch(`${API_URL}/admin/slots`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  if (!response.ok) throw new Error("Failed to fetch admin slots");
  return response.json();
};

// ADMIN: Create a slot
export const createSlotApi = async (time: string): Promise<{ success: boolean; slot: BookingSlot }> => {
  const token = localStorage.getItem("token");
  const response = await fetch(`${API_URL}/admin/slots`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({ time }),
  });
  if (!response.ok) throw new Error("Failed to create slot");
  return response.json();
};

// ADMIN: Delete a slot
export const deleteSlotApi = async (id: string): Promise<{ success: boolean; message: string }> => {
  const token = localStorage.getItem("token");
  const response = await fetch(`${API_URL}/admin/slots/${id}`, {
    method: "DELETE",
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  if (!response.ok) throw new Error("Failed to delete slot");
  return response.json();
};
