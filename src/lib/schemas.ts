import { z } from "zod";

// ─── Contact ──────────────────────────────────────────────────────────────────
export const contactSchema = z.object({
  full_name: z
    .string()
    .min(2, "Name must be at least 2 characters")
    .max(100, "Name cannot exceed 100 characters"),
  email: z
    .string()
    .min(1, "Email address is required")
    .email("Email address is invalid"),
  phone: z
    .string()
    .max(20, "Phone number cannot exceed 20 characters")
    .optional()
    .or(z.literal("")),
  subject: z.enum(
    [
      "General Enquiry",
      "Pharmacy Franchise / Partnership",
      "Cosmetics Distribution",
      "Lamé Brand Enquiry",
      "Investment / Investor Relations",
      "Career Opportunities",
    ],
    { message: "Please select an inquiry subject" }
  ),
  message: z
    .string()
    .min(10, "Message must be at least 10 characters")
    .max(5000, "Message cannot exceed 5000 characters"),
});

// ─── Newsletter ───────────────────────────────────────────────────────────────
export const newsletterSchema = z.object({
  email: z
    .string()
    .min(1, "Email address is required")
    .email("Email address is invalid"),
});

// ─── Investment Request ───────────────────────────────────────────────────────
export const investmentSchema = z.object({
  name: z
    .string()
    .min(2, "Full name must be at least 2 characters")
    .max(100, "Name cannot exceed 100 characters"),
  email: z
    .string()
    .min(1, "Email address is required")
    .email("Email address is invalid"),
  phone: z
    .string()
    .min(7, "Phone number must be at least 7 digits")
    .max(20, "Phone number cannot exceed 20 digits"),
  request_type: z.enum(["deck", "memorandum", "opportunity_inquiry"], {
    message: "Request type is required",
  }),
  opportunity_name: z.string().max(200).optional().or(z.literal("")),
  message: z
    .string()
    .min(10, "Message must be at least 10 characters")
    .max(5000, "Message cannot exceed 5000 characters"),
});

// ─── Lamé Launch Notify ───────────────────────────────────────────────────────
const LAME_PRODUCTS = [
  "2% Salicylic Acid Gel Cleanser",
  "Derma Polish Body Scrub",
  "Sugar DAYS Eau de Parfum",
  "DermaBarrier Gel Moisturizer",
  "General",
] as const;

export const lameNotifySchema = z.object({
  email: z
    .string()
    .min(1, "Email address is required")
    .email("Email address is invalid"),
  product_name: z.enum(LAME_PRODUCTS, {
    message: "Please select a product",
  }),
});

export type LameProduct = (typeof LAME_PRODUCTS)[number];

// ─── Distribution Inquiry ─────────────────────────────────────────────────────
export const distributionSchema = z.object({
  name: z
    .string()
    .min(2, "Full name must be at least 2 characters")
    .max(100, "Name cannot exceed 100 characters"),
  email: z
    .string()
    .min(1, "Email address is required")
    .email("Email address is invalid"),
  phone: z
    .string()
    .min(7, "Phone number must be at least 7 digits")
    .max(20, "Phone number cannot exceed 20 digits"),
  company: z
    .string()
    .min(2, "Company name must be at least 2 characters")
    .max(200, "Company name cannot exceed 200 characters"),
  category: z.enum(["skincare", "personal_care", "healthcare_cosmetics"], {
    message: "Please select a product category",
  }),
  message: z
    .string()
    .min(10, "Message must be at least 10 characters")
    .max(5000, "Message cannot exceed 5000 characters"),
});

// ─── Careers Application ──────────────────────────────────────────────────────
export const careersSchema = z.object({
  full_name: z
    .string()
    .min(2, "Full name must be at least 2 characters")
    .max(100, "Full name cannot exceed 100 characters"),
  email: z
    .string()
    .min(1, "Email address is required")
    .email("Email address is invalid"),
  phone: z
    .string()
    .min(7, "Phone number must be at least 7 digits")
    .max(20, "Phone number cannot exceed 20 digits"),
  position: z
    .string()
    .min(2, "Position must be at least 2 characters")
    .max(200, "Position cannot exceed 200 characters"),
  cover_letter: z
    .string()
    .min(10, "Cover letter must be at least 10 characters")
    .max(5000, "Cover letter cannot exceed 5000 characters"),
  resume_url: z.string().max(1000).optional().or(z.literal("")),
});

// ─── Partnership Inquiry ──────────────────────────────────────────────────────
export const partnershipSchema = z.object({
  name: z
    .string()
    .min(2, "Full name must be at least 2 characters")
    .max(100, "Name cannot exceed 100 characters"),
  email: z
    .string()
    .min(1, "Email address is required")
    .email("Email address is invalid"),
  phone: z
    .string()
    .min(7, "Phone number must be at least 7 digits")
    .max(20, "Phone number cannot exceed 20 digits"),
  inquiry_type: z.enum(["pharmacy_partner", "general"], {
    message: "Inquiry type is required",
  }),
  message: z
    .string()
    .min(10, "Message must be at least 10 characters")
    .max(5000, "Message cannot exceed 5000 characters"),
});

// ─── Type exports ─────────────────────────────────────────────────────────────
export type ContactFormData = z.infer<typeof contactSchema>;
export type NewsletterFormData = z.infer<typeof newsletterSchema>;
export type InvestmentFormData = z.infer<typeof investmentSchema>;
export type LameNotifyFormData = z.infer<typeof lameNotifySchema>;
export type DistributionFormData = z.infer<typeof distributionSchema>;
export type CareersFormData = z.infer<typeof careersSchema>;
export type PartnershipFormData = z.infer<typeof partnershipSchema>;
