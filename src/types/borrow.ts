
export interface CreateBorrowDTO {
  memberId: string;
  inventoryItemId: string;
  days: number;
}

export interface Borrow {
  id: string;
  memberId: string;
  inventoryItemId: string;
  days: number;
  createdAt: string;
}
