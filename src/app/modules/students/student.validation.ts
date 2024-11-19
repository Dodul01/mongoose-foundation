import { z } from 'zod';

// UserName Schema
const userNameValidationSchema = z.object({
  firstName: z
    .string()
    .trim()
    .max(20, 'First name cannot be more than 20 characters.')
    .regex(/^[A-Z][a-z]*$/, '{VALUE} is not in capitalized format.')
    .nonempty('First name is required.'),
  middleName: z.string().trim().optional(),
  lastName: z
    .string()
    .trim()
    .nonempty('Last name is required.')
    .regex(/^[A-Za-z]+$/, '{VALUE} is not valid.'),
});

// Guardian Schema
const guardianValidationSchema = z.object({
  fatherName: z.string().trim().nonempty('Father name is required.'),
  motherName: z.string().trim().nonempty('Mother name is required.'),
  faterContactNo: z
    .string()
    .trim()
    .max(16, 'Contact number cannot be more than 16 characters.')
    .nonempty('Father contact number is required.'),
  motherContactNo: z
    .string()
    .trim()
    .max(16, 'Contact number cannot be more than 16 characters.')
    .nonempty('Mother contact number is required.'),
  fatherOccupation: z
    .string()
    .trim()
    .nonempty('Father occupation is required.'),
  motherOccupation: z
    .string()
    .trim()
    .nonempty('Mother occupation is required.'),
});

// Local Guardian Schema
const localGuardianValidationSchema = z.object({
  name: z.string().trim().nonempty('Local guardian name is required.'),
  email: z
    .string()
    .trim()
    .email('Local guardian email must be a valid email.')
    .nonempty('Local guardian email is required.'),
  occupation: z
    .string()
    .trim()
    .nonempty('Local guardian occupation is required.'),
  contactNo: z
    .string()
    .trim()
    .max(16, 'Contact number cannot be more than 16 characters.')
    .nonempty('Local guardian contact number is required.'),
  address: z.string().trim().nonempty('Local guardian address is required.'),
});

// Student Schema
const studentValidationSchema = z.object({
  id: z.string().nonempty('ID is required.'),
  name: userNameValidationSchema.refine((value) => value, {
    message: 'Student name is required.',
  }),
  gender: z.enum(['male', 'female'], {
    errorMap: () => ({ message: '{VALUE} is not supported.' }),
  }),
  dateOfBarth: z.string().optional(),
  email: z
    .string()
    .trim()
    .email('{VALUE} is not a valid email.')
    .nonempty('Email is required.'),
  avatar: z.string().url().optional(),
  contactNumber: z
    .string()
    .trim()
    .max(16, 'Contact number cannot be more than 16 characters.')
    .nonempty('Contact number is required.'),
  emergencyContactNo: z
    .string()
    .trim()
    .max(16, 'Emergency contact number cannot be more than 16 characters.')
    .nonempty('Emergency contact number is required.'),
  bloodGroupe: z
    .enum(['A+', 'A-', 'AB+', 'AB-', 'B+', 'B-', 'O+', 'O-'])
    .optional(),
  presentAddress: z.string().trim().nonempty('Present address is required.'),
  parmanentAddress: z
    .string()
    .trim()
    .nonempty('Permanent address is required.'),
  guardian: guardianValidationSchema,
  localGuardian: localGuardianValidationSchema,
  isActive: z.enum(['active', 'block']).default('active'),
});

export default studentValidationSchema;