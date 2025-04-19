import { API_BASE_URL } from "@/config/api";
import { CreateMemberDTO, Member } from "@/types/member";
import { CreateItemDTO, Item } from "@/types/item";
import { CreateBorrowDTO, Borrow } from "@/types/borrow";

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

export const itemsApi = {
  getAll: async (): Promise<Item[]> => {
    const response = await fetch(`${API_BASE_URL}/api/items`);
    if (!response.ok) throw new Error('Failed to fetch items');
    return response.json();
  },

  create: async (data: CreateItemDTO): Promise<Item> => {
    const response = await fetch(`${API_BASE_URL}/api/items`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    });
    if (!response.ok) throw new Error('Failed to create item');
    return response.json();
  },
};

export const borrowApi = {
  getAll: async (): Promise<Borrow[]> => {
    const response = await fetch(`${API_BASE_URL}/api/transactions`);
    if (!response.ok) throw new Error('Failed to fetch borrowings');
    return response.json();
  },

  create: async (data: CreateBorrowDTO): Promise<Borrow> => {
    const response = await fetch(`${API_BASE_URL}/api/transactions/borrow`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    });
    if (!response.ok) throw new Error('Failed to create borrow transaction');
    return response.json();
  },

  return: async (borrowId: string): Promise<void> => {
    const response = await fetch(`${API_BASE_URL}/api/transactions/${borrowId}/return`, {
      method: 'POST',
    });
    if (!response.ok) throw new Error('Failed to return item');
  },
};
