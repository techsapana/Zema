import axios from "axios";

const API_URL = import.meta.env.VITE_API_URL;

const teamApiClient = axios.create({
  baseURL: API_URL,
});

export interface TeamMember {
  id: string;
  name: string;
  role: string;
  description: string;
  image: string;
  createdAt: string;
}

export interface TeamResponse {
  success: boolean | string;
  data: TeamMember[];
  message?: string;
}

export interface CreateTeamMemberPayload {
  name: string;
  role: string;
  description: string;
  image: string; // base64 or URL
}

export interface CreateTeamMemberResponse {
  success: boolean | string;
  data: TeamMember;
  message?: string;
}

export interface DeleteTeamMemberResponse {
  success: boolean | string;
  message: string;
}

// GET TEAM MEMBERS
export const getTeamMembersApi = async (): Promise<TeamResponse> => {
  const response = await teamApiClient.get<TeamResponse>("/public/team");
  return response.data;
};

// CREATE TEAM MEMBER
export const createTeamMemberApi = async (
  payload: CreateTeamMemberPayload,
): Promise<CreateTeamMemberResponse> => {
  const token = localStorage.getItem("token");

  const response = await teamApiClient.post<CreateTeamMemberResponse>(
    "/admin/team",
    payload,
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    },
  );

  return response.data;
};

// DELETE TEAM MEMBER
export const deleteTeamMemberApi = async (
  id: string,
): Promise<DeleteTeamMemberResponse> => {
  const token = localStorage.getItem("token");

  const response = await teamApiClient.delete<DeleteTeamMemberResponse>(
    `/admin/team/${id}`,
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    },
  );

  return response.data;
};

export default teamApiClient;
