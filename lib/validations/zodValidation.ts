import { z } from "zod";

// Validation for SocialLink
const socialLinkSchema = z.object({
  type: z.string(),
  url: z.string().url({ message: "Invalid URL" }).optional(),
});

// Validation for Project
const projectSchema = z.object({
  title: z.string().min(2, { message: "Project title must be at least 2 characters long" }),
  description: z.string().min(10, { message: "Description must be at least 10 characters long" }),
  liveUrl: z.string().url({ message: "Invalid live URL" }).optional(),
  repoUrl: z.string().url({ message: "Invalid repository URL" }).optional(),
});

// Validation for Skill
const skillSchema = z.object({
  name: z.string().min(1, { message: "Skill name must be provided" }),
});

// Validation for the User
export const userSchema = z.object({
  name: z.string().min(2, { message: "Name should have at least 2 characters" }),
  email: z.string().email({ message: "Invalid email address" }),
  bio: z.string().optional(),
  phone: z.string().min(10, { message: "Phone number must be at least 10 digits" }).optional(),
  website: z.string().url({ message: "Invalid URL" }).optional(),
  image: z.string().url({ message: "Invalid avatar URL" }).optional(),
  location: z.string().optional(),
  socialLinks: z.array(socialLinkSchema).optional(),
  projects: z.array(projectSchema).optional(),
  skills: z.array(skillSchema).optional(),
  provider: z.string()
});
