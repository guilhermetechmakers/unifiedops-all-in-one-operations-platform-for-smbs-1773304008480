export interface AuthResponse {
  token?: string
  user?: { id: string; email: string; full_name?: string }
}

export interface SignInInput {
  email: string
  password: string
  remember?: boolean
}

export interface SignUpInput {
  email: string
  password: string
  full_name?: string
}
