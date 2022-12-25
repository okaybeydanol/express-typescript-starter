export interface User {
  _id: string;
  email: string;
  password: string;
  createdAt: string;
  updatedAt: string;
  __v: number;
}

export interface UserResponse {
  _id: string;
  email: string;
}
