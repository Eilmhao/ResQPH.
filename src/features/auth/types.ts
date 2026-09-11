export type UserRole = 'citizen' | 'coordinator' | 'rescuer'

export interface AuthUser {
  name: string
  email: string
  role: UserRole
  avatarUrl?: string
  phone?: string
  isStudent?: boolean
  emergencyContactName?: string
  emergencyContactPhone?: string
  homeArea?: string
}

export type ProfileUpdate = Pick<AuthUser, 'name' | 'email'> &
  Partial<Pick<AuthUser, 'avatarUrl' | 'phone' | 'isStudent' | 'emergencyContactName' | 'emergencyContactPhone' | 'homeArea'>>

export const ROLE_LABELS: Record<UserRole, string> = {
  citizen: 'Citizen',
  coordinator: 'Coordinator',
  rescuer: 'Rescuer',
}

export const ROLE_BLURB: Record<UserRole, string> = {
  citizen: 'Submit and track rescue requests for people who need help.',
  coordinator: 'Monitor requests, assign teams, and manage operations.',
  rescuer: 'Receive missions, follow flood-aware routes, and report back.',
}
