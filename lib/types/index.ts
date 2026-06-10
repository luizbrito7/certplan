export type Vendor = 'aws' | 'azure' | 'cisco' | 'kubernetes' | 'gcp' | 'other'
export type CertStatus = 'have' | 'seeking'
export type ExamStatus = 'planned' | 'done' | 'canceled'

export interface Profile {
  id: string
  username: string
  display_name: string | null
  avatar_url: string | null
  bio: string | null
  created_at: string
}

export interface Certification {
  id: string
  name: string
  vendor: Vendor
  code: string | null
  slug: string
  is_custom: boolean
  created_by: string | null
  created_at: string
}

export interface UserCertification {
  id: string
  user_id: string
  certification_id: string
  status: CertStatus
  obtained_at: string | null
  created_at: string
  certification?: Certification
}

export interface ExamPlan {
  id: string
  user_id: string
  certification_id: string
  title: string
  scheduled_at: string
  notes: string | null
  status: ExamStatus
  reminder_sent: boolean
  created_at: string
  certification?: Certification
}

export const VENDOR_LABELS: Record<Vendor, string> = {
  aws: 'AWS',
  azure: 'Azure',
  cisco: 'Cisco',
  kubernetes: 'Kubernetes',
  gcp: 'GCP',
  other: 'Other',
}

export const VENDOR_COLORS: Record<Vendor, string> = {
  aws:        'bg-amber-100 text-amber-800 dark:bg-amber-900/40 dark:text-amber-300',
  azure:      'bg-blue-100 text-blue-800 dark:bg-blue-900/40 dark:text-blue-300',
  cisco:      'bg-cyan-100 text-cyan-800 dark:bg-cyan-900/40 dark:text-cyan-300',
  kubernetes: 'bg-purple-100 text-purple-800 dark:bg-purple-900/40 dark:text-purple-300',
  gcp:        'bg-green-100 text-green-800 dark:bg-green-900/40 dark:text-green-300',
  other:      'bg-slate-100 text-slate-700 dark:bg-slate-700/60 dark:text-slate-300',
}

export const VENDOR_HEX: Record<Vendor, string> = {
  aws:        '#FF9900',
  azure:      '#0078D4',
  cisco:      '#1BA0D7',
  kubernetes: '#326CE5',
  gcp:        '#4285F4',
  other:      'currentColor',
}

export const VENDOR_CHIP_COLORS: Record<Vendor, string> = {
  aws:        'bg-amber-200/70 text-amber-900 dark:bg-amber-800/60 dark:text-amber-200',
  azure:      'bg-blue-200/70 text-blue-900 dark:bg-blue-800/60 dark:text-blue-200',
  cisco:      'bg-cyan-200/70 text-cyan-900 dark:bg-cyan-800/60 dark:text-cyan-200',
  kubernetes: 'bg-purple-200/70 text-purple-900 dark:bg-purple-800/60 dark:text-purple-200',
  gcp:        'bg-green-200/70 text-green-900 dark:bg-green-800/60 dark:text-green-200',
  other:      'bg-slate-200/70 text-slate-800 dark:bg-slate-600/60 dark:text-slate-200',
}
