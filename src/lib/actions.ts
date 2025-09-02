'use server';

import { z } from 'zod';
import { addComplaint, updateComplaintStatus, deleteComplaint } from './data';
import { revalidatePath } from 'next/cache';
import { complaintCategories, complaintStatuses, type ComplaintStatus } from './types';
import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';

const ComplaintSchema = z.object({
  roomNumber: z
    .string()
    .min(1, 'Room number is required.')
    .refine(
      (val) => {
        const num = parseInt(val, 10);
        if (isNaN(num)) return false;
        const floor = Math.floor(num / 100);
        const room = num % 100;
        return floor >= 1 && floor <= 5 && room >= 1 && room <= 50;
      },
      {
        message: 'Invalid room number. Use 101-150, 201-250, 301-350, 401-450, or 501-550.',
      }
    ),
  category: z.enum(complaintCategories, {
    errorMap: () => ({ message: 'Please select a valid category.' }),
  }),
  description: z.string().min(10, 'Description must be at least 10 characters.'),
});

export type FormState = {
  message: string;
  type: 'success' | 'error';
  data?: {
    id: string;
  };
} | null;

export async function submitComplaint(prevState: FormState, formData: FormData): Promise<FormState> {
  const validatedFields = ComplaintSchema.safeParse({
    roomNumber: formData.get('roomNumber'),
    category: formData.get('category'),
    description: formData.get('description'),
  });

  if (!validatedFields.success) {
    return {
      type: 'error',
      message: validatedFields.error.flatten().fieldErrors[Object.keys(validatedFields.error.flatten().fieldErrors)[0] as string][0] || 'Invalid data provided.'
    };
  }
  
  try {
    const newComplaint = await addComplaint(validatedFields.data);
    revalidatePath('/');
    revalidatePath('/admin/dashboard');
    return {
      type: 'success',
      message: 'Your complaint has been submitted successfully.',
      data: {
        id: newComplaint.id
      }
    };
  } catch (e) {
    return { type: 'error', message: 'Failed to submit complaint. Please try again later.' };
  }
}

const UpdateStatusSchema = z.object({
  id: z.string(),
  status: z.enum(complaintStatuses)
});

export async function updateStatusAction(id: string, status: ComplaintStatus) {
    const validatedFields = UpdateStatusSchema.safeParse({ id, status });

    if (!validatedFields.success) {
        return { error: "Invalid data" };
    }

    try {
        await updateComplaintStatus(validatedFields.data.id, validatedFields.data.status);
        revalidatePath('/admin/dashboard');
        return { success: "Status updated" };
    } catch (e) {
        return { error: "Failed to update status" };
    }
}


const LoginSchema = z.object({
    email: z.string().email(),
    password: z.string().min(1, "Password is required"),
});

export async function login(prevState: FormState, formData: FormData): Promise<FormState> {
    const validatedFields = LoginSchema.safeParse(Object.fromEntries(formData.entries()));

    if (!validatedFields.success) {
        return { type: 'error', message: "Invalid email or password." };
    }
    
    // In a real app, you'd validate against a database
    if (validatedFields.data.email === 'admin@hallcomplaint.com' && validatedFields.data.password === '12345') {
        const expires = new Date(Date.now() + 24 * 60 * 60 * 1000); // 24 hours
        cookies().set('session', 'admin-logged-in', { expires, httpOnly: true });
        redirect('/admin/dashboard');
    } else {
        return { type: 'error', message: 'Invalid credentials.' };
    }
}

export async function logout() {
    cookies().delete('session');
    redirect('/admin/login');
}


export async function deleteComplaintAction(id: string) {
    if (!id) {
        return { error: "Invalid ID provided" };
    }

    try {
        await deleteComplaint(id);
        revalidatePath('/admin/dashboard');
        return { success: "Complaint deleted successfully" };
    } catch (e) {
        return { error: "Failed to delete complaint" };
    }
}
