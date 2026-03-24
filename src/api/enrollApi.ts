import axios from "axios";

const API_URL = import.meta.env.VITE_API_URL;

const enrollmentApiClient = axios.create({
  baseURL: API_URL,
});

export interface CreateEnrollmentPayload {
  fullName: string;
  address: string;
  email: string;
  courseId: number;
}

export interface Course {
  id: number;
  title: string;
}

export interface Enrollment {
  id: number;
  fullName: string;
  address: string;
  email: string;
  status: "pending" | "accepted" | "rejected";
  courseId: number;
  course: Course;
  createdAt: string;
  updatedAt: string;
}

export interface CreateEnrollmentResponse {
  success: boolean;
  enrollment: Enrollment;
}

export interface AdminEnrollmentsResponse {
  success: boolean;
  enrollments: Enrollment[];
}

export interface DeleteEnrollmentResponse {
  success: boolean;
  message: string;
}

export const createEnrollmentApi = async (
  payload: CreateEnrollmentPayload,
): Promise<CreateEnrollmentResponse> => {
  const response = await enrollmentApiClient.post<CreateEnrollmentResponse>(
    "/public/enrollment",
    payload,
  );

  return response.data;
};

export interface GetAdminEnrollmentsParams {
  status?: "pending" | "accepted" | "rejected";
  courseId?: number;
}

export const getAdminEnrollmentsApi = async (
  params?: GetAdminEnrollmentsParams,
): Promise<AdminEnrollmentsResponse> => {
  const token = localStorage.getItem("token");

  const response = await enrollmentApiClient.get<AdminEnrollmentsResponse>(
    "/admin/enrollment",
    {
      params,
      headers: {
        Authorization: `Bearer ${token}`,
      },
    },
  );

  return response.data;
};

// DELETE ENROLLMENT
export const deleteEnrollmentApi = async (
  id: number,
): Promise<DeleteEnrollmentResponse> => {
  const token = localStorage.getItem("token");

  const response = await enrollmentApiClient.delete<DeleteEnrollmentResponse>(
    `/admin/enrollment/${id}`,
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    },
  );

  return response.data;
};

export default enrollmentApiClient;
