import { z } from "zod";

export const registerSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters").max(100),
  email: z.string().email("Invalid email address"),
  password: z
    .string()
    .min(8, "Password must be at least 8 characters")
    .regex(/[A-Z]/, "Password must contain at least one uppercase letter")
    .regex(/[0-9]/, "Password must contain at least one number")
    .regex(/[^a-zA-Z0-9]/, "Password must contain at least one special character"),
  role: z.enum(["NURSE", "FACILITY"]),
  facilityName: z.string().optional(),
  phone: z.string().optional(),
});

export const loginSchema = z.object({
  email: z.string().email("Invalid email address"),
  password: z.string().min(1, "Password is required"),
});

export const resetPasswordRequestSchema = z.object({
  email: z.string().email("Invalid email address"),
});

export const resetPasswordSchema = z.object({
  token: z.string().min(1),
  password: z
    .string()
    .min(8, "Password must be at least 8 characters")
    .regex(/[A-Z]/, "Must contain uppercase")
    .regex(/[0-9]/, "Must contain number")
    .regex(/[^a-zA-Z0-9]/, "Must contain special character"),
  confirmPassword: z.string(),
}).refine((d) => d.password === d.confirmPassword, {
  message: "Passwords do not match",
  path: ["confirmPassword"],
});

export const nurseProfileSchema = z.object({
  bio: z.string().max(1000).optional(),
  specializations: z.array(z.string()).min(1, "Select at least one specialization"),
  yearsOfExperience: z.number().min(0).max(50),
  education: z.string().max(200).optional(),
  currentLocation: z.string().max(200).optional(),
  willingToRelocate: z.boolean().default(false),
  preferredLocations: z.array(z.string()).optional(),
  expectedSalaryMin: z.number().positive().optional(),
  expectedSalaryMax: z.number().positive().optional(),
});

export const certificationSchema = z.object({
  type: z.enum(["RN", "LPN", "CNA", "NP", "PA", "CRNA", "CNM", "CNS", "OTHER"]),
  name: z.string().min(1, "Name is required").max(200),
  issuingBody: z.string().max(200).optional(),
  licenseNumber: z.string().max(100).optional(),
  issueDate: z.string().optional(),
  expiryDate: z.string().optional(),
});

export const facilityProfileSchema = z.object({
  facilityName: z.string().min(2, "Facility name is required").max(200),
  facilityType: z.string().min(1, "Facility type is required"),
  description: z.string().max(2000).optional(),
  website: z.string().url().optional().or(z.literal("")),
  phone: z.string().optional(),
  address: z.string().max(500).optional(),
  city: z.string().max(100).optional(),
  state: z.string().max(100).optional(),
  zipCode: z.string().max(20).optional(),
  bedCount: z.number().positive().optional(),
  specialties: z.array(z.string()).optional(),
});

export const jobSchema = z.object({
  title: z.string().min(5, "Job title must be at least 5 characters").max(200),
  description: z.string().min(50, "Description must be at least 50 characters"),
  requirements: z.string().min(20, "Requirements must be at least 20 characters"),
  responsibilities: z.string().min(20, "Responsibilities must be at least 20 characters"),
  jobType: z.enum(["FULL_TIME", "PART_TIME", "CONTRACT", "PER_DIEM", "TRAVEL"]),
  shiftType: z.enum(["DAY", "EVENING", "NIGHT", "ROTATING", "WEEKEND"]),
  specializations: z.array(z.string()).min(1, "Select at least one specialization"),
  location: z.string().min(1, "Location is required"),
  city: z.string().min(1, "City is required"),
  state: z.string().min(1, "State is required"),
  isRemote: z.boolean().default(false),
  salaryMin: z.number().positive().optional(),
  salaryMax: z.number().positive().optional(),
  salaryUnit: z.string().default("YEAR"),
  benefits: z.array(z.string()).optional(),
  positions: z.number().min(1).default(1),
  startDate: z.string().optional(),
  endDate: z.string().optional(),
});

export const applicationSchema = z.object({
  jobId: z.string().cuid(),
  coverLetter: z.string().max(2000).optional(),
});

export const interviewSchema = z.object({
  applicationId: z.string().cuid(),
  scheduledAt: z.string().datetime(),
  duration: z.number().min(15).max(240).default(60),
  type: z.enum(["VIDEO", "PHONE", "IN_PERSON"]).default("VIDEO"),
  location: z.string().optional(),
  meetingLink: z.string().url().optional().or(z.literal("")),
  notes: z.string().max(500).optional(),
});

export const updateApplicationStatusSchema = z.object({
  status: z.enum([
    "REVIEWED",
    "SHORTLISTED",
    "INTERVIEW_SCHEDULED",
    "OFFERED",
    "ACCEPTED",
    "REJECTED",
  ]),
  notes: z.string().max(500).optional(),
});

export type RegisterInput = z.infer<typeof registerSchema>;
export type LoginInput = z.infer<typeof loginSchema>;
export type NurseProfileInput = z.infer<typeof nurseProfileSchema>;
export type FacilityProfileInput = z.infer<typeof facilityProfileSchema>;
export type JobInput = z.infer<typeof jobSchema>;
export type ApplicationInput = z.infer<typeof applicationSchema>;
export type InterviewInput = z.infer<typeof interviewSchema>;
