export interface Employee {
  id: string;
  email: string;
  full_name: string;
  employee_id: string;
  cadre: string;
  department: string;
  designation: string;
  date_of_birth: string;
  date_of_joining: string;
  phone_number: string;
  address: string;
  profile_image_url?: string;
  created_at: string;
  updated_at: string;
}

export interface EmployeeProfile {
  id: string;
  user_id: string;
  full_name: string;
  employee_id: string;
  cadre: CadreType;
  department: DepartmentType;
  division: DivisionType;
  designation: string;
  date_of_birth: string;
  date_of_joining: string;
  phone_number: string;
  address: string;
  profile_image_url?: string;
  created_at: string;
  updated_at: string;
}

export type CadreType = 
  | 'Officer' 
  | 'Supervisor' 
  | 'Skilled' 
  | 'Semi-skilled' 
  | 'Unskilled';

export type DepartmentType = 
  | 'Operations' 
  | 'Engineering' 
  | 'Signal & Telecom' 
  | 'Electrical' 
  | 'Commercial' 
  | 'Personnel' 
  | 'Accounts' 
  | 'Medical' 
  | 'Security' 
  | 'Stores';

export type DivisionType = 
  | 'Central Railway' 
  | 'Eastern Railway' 
  | 'Northern Railway' 
  | 'North Eastern Railway' 
  | 'Northeast Frontier Railway' 
  | 'Southern Railway' 
  | 'South Central Railway' 
  | 'South Eastern Railway' 
  | 'South East Central Railway' 
  | 'Western Railway' 
  | 'West Central Railway' 
  | 'North Western Railway' 
  | 'North Central Railway' 
  | 'East Central Railway' 
  | 'East Coast Railway' 
  | 'South Western Railway';

export interface AuthContextType {
  user: any;
  signUp: (email: string, password: string, userData: any) => Promise<any>;
  signIn: (email: string, password: string) => Promise<any>;
  signOut: () => Promise<void>;
  loading: boolean;
}

// Passes and eligibility
export type PassStatus = 'active' | 'expired' | 'revoked';
export type TrainType = 'Local' | 'Express' | 'Mail' | 'Rajdhani' | 'Shatabdi' | 'Other';
export type PassType = 'Privilege' | 'School' | 'PTO' | 'Other';

export interface EmployeePass {
  id: string;
  user_id: string;
  pass_type: PassType;
  train_type: TrainType;
  origin: string;
  destination: string;
  issue_date: string; // ISO date
  expiry_date: string; // ISO date
  status: PassStatus;
  remarks?: string;
  created_at: string;
  updated_at: string;
}

// Health records
export interface HealthRecord {
  id: string;
  user_id: string;
  blood_group?: string;
  allergies?: string;
  chronic_conditions?: string;
  last_medical_check?: string; // ISO date
  next_medical_due?: string; // ISO date
  notes?: string;
  created_at: string;
  updated_at: string;
}

// Family members
export interface FamilyMember {
  id: string;
  user_id: string;
  full_name: string;
  relation: 'spouse' | 'son' | 'daughter' | 'father' | 'mother' | 'other';
  date_of_birth?: string;
  profile_image_url?: string;
  created_at: string;
  updated_at: string;
}

// Duty assignments
export interface DutyAssignment {
  id: string;
  user_id: string;
  title: string;
  location?: string;
  duty_date: string; // ISO date
  shift?: string;
  notes?: string;
  created_at: string;
  updated_at: string;
}