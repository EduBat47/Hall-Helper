'use client';

import { useForm, useFormContext } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useActionState, useEffect, useState } from 'react';

import { Button } from '@/components/ui/button';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import { useToast } from '@/hooks/use-toast';
import { type FormState, submitComplaint } from '@/lib/actions';
import { complaintCategories } from '@/lib/types';
import { categoryIcons } from '@/lib/icons';
import { Loader2 } from 'lucide-react';

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

type ComplaintFormValues = z.infer<typeof ComplaintSchema>;

export function ComplaintForm() {
  const { toast } = useToast();
  const [dialogOpen, setDialogOpen] = useState(false);
  const [submittedId, setSubmittedId] = useState<string | null>(null);

  const [state, formAction, isPending] = useActionState<FormState, FormData>(submitComplaint, null);
  
  const form = useForm<ComplaintFormValues>({
    resolver: zodResolver(ComplaintSchema),
    defaultValues: {
      roomNumber: '',
      category: undefined,
      description: '',
    },
  });

  useEffect(() => {
    if (state?.type === 'error') {
      toast({
        variant: 'destructive',
        title: 'Error',
        description: state.message,
      });
    }
    if (state?.type === 'success' && state.data?.id) {
        setSubmittedId(state.data.id);
        setDialogOpen(true);
        form.reset();
    }
  }, [state, toast, form]);

  return (
    <>
      <Form {...form}>
        <form
          action={formAction}
          className="space-y-6"
        >
          <FormField
            control={form.control}
            name="roomNumber"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Room Number</FormLabel>
                <FormControl>
                  <Input placeholder="e.g., 101" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="category"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Category</FormLabel>
                <Select onValueChange={field.onChange} value={field.value} name={field.name}>
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Select a category" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    {complaintCategories.map((category) => {
                      const Icon = categoryIcons[category];
                      return (
                        <SelectItem key={category} value={category}>
                          <div className="flex items-center gap-2">
                            <Icon className="h-4 w-4 text-muted-foreground" />
                            <span>{category}</span>
                          </div>
                        </SelectItem>
                      );
                    })}
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="description"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Description of Issue</FormLabel>
                <FormControl>
                  <Textarea
                    placeholder="Please describe the issue in detail..."
                    className="resize-none"
                    rows={5}
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <Button type="submit" className="w-full" disabled={isPending}>
            {isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            Submit Complaint
          </Button>
        </form>
      </Form>
      <AlertDialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Complaint Submitted!</AlertDialogTitle>
            <AlertDialogDescription>
              Your complaint has been successfully submitted. Your tracking ID is:
              <br />
              <strong className="text-primary text-lg">{submittedId}</strong>
              <br />
              Please save this ID to track the status of your complaint.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogAction onClick={() => setDialogOpen(false)}>Close</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}
