import { z } from 'zod';

export const signupSchema = z.object({
    body: z.object({
        email: z.string().email('Invalid email address'),
        password: z.string().min(8, 'Password must be at least 8 characters long'),
    }),
});

export const loginSchema = z.object({
    body: z.object({
        email: z.string().email('Invalid email address'),
        password: z.string().min(1, 'Password is required'),
    }),
});

export const createBookingSchema = z.object({
    body: z.object({
        title: z.string().min(1, 'Title is required'),
        roomId: z.number().int().positive('Room ID must be a positive integer'),
        startTime: z.coerce.date(), 
        endTime: z.coerce.date(),
    }),
}).refine((data) => data.body.endTime > data.body.startTime, {
    message: 'End time must be after start time',
    path: ['body', 'endTime'],
});