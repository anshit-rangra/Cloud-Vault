import {z} from 'zod';

const userValidator = z.object({
    name: z.string()
    .trim()
    .min(4, "Name must be at least 4 characters")
    .max(10, "Name must be less than 10 characters"),

    mobile: z.string()
    .trim()
    .min(10, "Enter a valid mobile number")
    .max(10, "Enter a valid mobile number"),

    password: z.string()
    .trim()
    .min(6, "The password must be at least 6 characters.")
})

export default userValidator;