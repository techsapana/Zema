import axios from "axios";

const API_URL = import.meta.env.VITE_API_URL;

const communityApiClient = axios.create({
  baseURL: API_URL,
});

export interface CommunityProgram {
  id: number;
  title: string;
  description: string;
  images: string[];
}

export interface CommunityProgramsResponse {
  success: boolean;
  programs: CommunityProgram[];
}

export interface CommunityProgramResponse {
  success: boolean;
  program: CommunityProgram;
}

export const getCommunityProgramsApi = async (): Promise<
  CommunityProgram[]
> => {
  const response = await communityApiClient.get<CommunityProgramsResponse>(
    "/public/community-programs",
  );
  return response.data.programs;
};

export const getCommunityProgramByIdApi = async (
  id: number,
): Promise<CommunityProgram> => {
  const response = await communityApiClient.get<CommunityProgramResponse>(
    `/public/community-programs/${id}`,
  );
  return response.data.program;
};

export interface CreateCommunityProgramPayload {
  title: string;
  description: string;
  images: string[];
}

export const createCommunityProgramApi = async (
  payload: CreateCommunityProgramPayload,
): Promise<CommunityProgram> => {
  const token = localStorage.getItem("token");
  const response = await communityApiClient.post<CommunityProgramResponse>(
    "/admin/community-programs",
    payload,
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    },
  );
  return response.data.program;
};

export const deleteCommunityProgramApi = async (id: number): Promise<void> => {
  const token = localStorage.getItem("token");
  await communityApiClient.delete(`/admin/community-programs/${id}`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
};

export default communityApiClient;
