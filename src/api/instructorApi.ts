import axios from "axios";

const API_URL = import.meta.env.VITE_API_URL;

const instructorApiClient = axios.create({
  baseURL: API_URL,
});

export interface Instructor {
  id: number;
  name: string;
  bio: string;
  photo: string;
}

export interface InstructorsResponse {
  success: boolean;
  data: Instructor[];
}

export const getInstructorsApi = async (): Promise<Instructor[]> => {
  const response =
    await instructorApiClient.get<InstructorsResponse>("/public/instructor");
  return response.data.data;
};

export interface CreateInstructorPayload {
  name: string;
  bio: string;
  photo: string; // base64
}

export interface InstructorResponse {
  success: boolean;
  data: Instructor;
}

export const createInstructorApi = async (
  payload: CreateInstructorPayload,
): Promise<Instructor> => {
  const token = localStorage.getItem("token");
  const response = await instructorApiClient.post<InstructorResponse>(
    "/admin/instructor",
    payload,
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    },
  );
  return response.data.data;
};

export const deleteInstructorApi = async (id: number): Promise<void> => {
  const token = localStorage.getItem("token");
  console.log("this is the id form the deltedInstuctorId Api ", id);
  await instructorApiClient.delete(`/admin/instructor/${id}`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
};

export default instructorApiClient;
