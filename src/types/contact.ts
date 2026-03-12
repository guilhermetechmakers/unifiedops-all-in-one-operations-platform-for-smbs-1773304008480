export interface Contact {
  id: string
  name: string
  email: string
  phone?: string
  company?: string
  tags?: string[]
  created_at: string
  updated_at: string
}

export interface CreateContactInput {
  name: string
  email: string
  phone?: string
  company?: string
  tags?: string[]
}
