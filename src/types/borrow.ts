export interface CreateBorrowDTO {
  memberId: string;
  inventoryItemId: string;
  days: number;
}

export interface Borrow {
  id: string;
  memberId: string;
  itemId: string;
  borrowedDate: string;
  dueDate: string;
  returned: boolean;
}
