
export interface Member {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
}

export interface CreateMemberDTO {
  firstName: string;
  lastName: string;
  email: string;
}
