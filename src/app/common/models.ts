export type PaginationInfo = {
  page: number,
  totalPages: number | null,
  itemsPerPage: number
};

export type AuthenticationResponse = {
  accessToken: string
}

export type UserResponse = {
  id: number
  username: string
  role: string
}
