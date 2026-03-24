import axios from "axios";

const API_URL = import.meta.env.VITE_API_URL;

const appointmentApiClient = axios.create({
  baseURL: API_URL,
});

export interface AvailableSlotsResponse {
  success: boolean;
  page: number;
  limit: number;
  slots: string[];
}

export interface BookAppointmentPayload {
  name: string;
  phone: string;
  appointment: string;
}

export interface Appointment {
  id: string;
  name: string;
  phone: string;
  appointment: string;
  done: boolean;
  createdAt: string;
}

export interface BookAppointmentResponse {
  success: boolean;
  appointment: Appointment;
}

export interface AdminAppointmentsResponse {
  success: boolean;
  appointments: Appointment[];
}

export interface DeleteAppointmentResponse {
  success: boolean;
  message: string;
}

export const getAvailableSlotsApi = async (
  page: number = 1,
  limit: number = 20,
): Promise<AvailableSlotsResponse> => {
  const response = await appointmentApiClient.get<AvailableSlotsResponse>(
    "/public/available/appointments",
    { params: { page, limit } },
  );
  return response.data;
};

export const bookAppointmentApi = async (
  payload: BookAppointmentPayload,
): Promise<BookAppointmentResponse> => {
  const response = await appointmentApiClient.post<BookAppointmentResponse>(
    "/public/appointments",
    payload,
  );
  return response.data;
};

export interface GetAdminAppointmentsParams {
  done?: boolean;
  from?: string;
  to?: string;
}

// GET ADMIN APPOINTMENTS
export const getAdminAppointmentsApi = async (
  params?: GetAdminAppointmentsParams,
): Promise<AdminAppointmentsResponse> => {
  const token = localStorage.getItem("token");

  const response = await appointmentApiClient.get<AdminAppointmentsResponse>(
    "/admin/appointment",
    {
      params,
      headers: {
        Authorization: `Bearer ${token}`,
      },
    },
  );

  return response.data;
};

// DELETE APPOINTMENT
export const deleteAppointmentApi = async (
  id: string,
): Promise<DeleteAppointmentResponse> => {
  const token = localStorage.getItem("token");

  const response = await appointmentApiClient.delete<DeleteAppointmentResponse>(
    `/admin/appointment/${id}`,
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    },
  );

  return response.data;
};

export default appointmentApiClient;
