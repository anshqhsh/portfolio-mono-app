import { api } from "../api";

export interface IUserProfile {
  id: number;
  avatar: string | null;
  country: string | null;
  created_at: number;
  documents_verified_status: string;
  email: string;
  phone: string;
  level: string;
  name: string;
  language: string;
  provider: string;
  referal_code: string;
  last_login_at: number;
  login_counts: number;
  role: string;
  balance: {
    [key: string]: number;
  };
}

export const usersApi = {
  getUserProfile: async (id: number) => {
    return api.get<IUserProfile>(`/api/v2/users/${id}/profile`);
  },
};
