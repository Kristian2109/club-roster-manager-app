
import { API_BASE_URL } from "@/config/api";
import { CreateMemberDTO, Member } from "@/types/member";

export const membersApi = {
  getAll: async (): Promise<Member[]> => {
    const response = await fetch(`${API_BASE_URL}/api/members`);
    if (!response.ok) throw new Error('Failed to fetch members');
    return response.json();
  },

  create: async (data: CreateMemberDTO): Promise<Member> => {
    const response = await fetch(`${API_BASE_URL}/api/members`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    });
    if (!response.ok) throw new Error('Failed to create member');
    return response.json();
  },

  delete: async (id: string): Promise<void> => {
    const response = await fetch(`${API_BASE_URL}/api/members/${id}`, {
      method: 'DELETE',
    });
    if (!response.ok) throw new Error('Failed to delete member');
  },
};
