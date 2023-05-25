import { User } from "./User";

export interface UsersResponse {
  total_users: number,
  total_pages: number,
  users: User[],
}