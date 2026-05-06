import axios from "axios";

const API_URL = import.meta.env.VITE_API_URL;

const academyApiClient = axios.create({
  baseURL: API_URL,
});

export interface Course {
  id: number;
  title: string;
  description: string;
  duration: string;
  image: string;
  fees: number;
  discountPrice?: number;
  curriculum: string;
  instructorId: number;
  createdAt: string;
  updatedAt: string;
}

export interface CoursesResponse {
  success: boolean;
  data: Course[];
}

export interface CourseResponse {
  success: boolean;
  data: Course;
}

export interface CreateCoursePayload {
  title: string;
  description: string;
  duration: string;
  fees: number;
  discountPrice?: number;
  curriculum: string;
  image: string;
  instructorId: number;
}

export const createCourseApi = async (
  payload: CreateCoursePayload,
): Promise<Course> => {
  const token = localStorage.getItem("token");
  console.log("the course response is", payload);
  const response = await academyApiClient.post<CourseResponse>(
    "/admin/course",
    payload,
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    },
  );
  return response.data?.data ?? ({} as Course);
};

export const deleteCourseApi = async (id: number): Promise<void> => {
  const token = localStorage.getItem("token");
  await academyApiClient.delete(`/admin/course/${id}`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
};

export const updateCourseApi = async ({ id, payload }: { id: number; payload: CreateCoursePayload }): Promise<Course> => {
  const token = localStorage.getItem("token");
  const response = await academyApiClient.put<CourseResponse>(
    `/admin/course/${id}`,
    payload,
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );
  return response.data?.data ?? ({} as Course);
};

export interface CourseWithInstructor extends Course {
  instructor?: {
    id: number;
    name: string;
    bio: string;
    photo: string;
  };
}

export interface CoursesWithInstructorResponse {
  success: boolean;
  data: CourseWithInstructor[];
}

export const getCoursesApi = async (): Promise<CourseWithInstructor[]> => {
  const response =
    await academyApiClient.get<CoursesWithInstructorResponse>("/public/course");
  return response.data?.data ?? [];
};

export const getCourseByIdApi = async (
  id: number,
): Promise<CourseWithInstructor> => {
  const response = await academyApiClient.get<{
    success: boolean;
    data: CourseWithInstructor;
  }>(`/public/course/${id}`);
  return response.data?.data ?? ({} as CourseWithInstructor);
};

export default academyApiClient;
