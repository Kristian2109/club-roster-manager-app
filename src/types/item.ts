export interface Item {
  id: string;
  name: string;
  description: string;
  quantity: number;
  serialNumber: string;
  unitOfMeasurement: string;
  category: string;
  borrowable: boolean;
}

export interface CreateItemDTO {
  name: string;
  description: string;
  quantity: number;
  serialNumber: string;
  unit: string;
  category: string;
  borrowable: boolean;
}
