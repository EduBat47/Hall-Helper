'use client';

import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useFormState } from 'react-dom';
import { useEffect, useRef, useState } from 'react';

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
  roomNumber: z.string().min(1, 'Room number is required.'),
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

  const [state, formAction] = useFormState<FormState, FormData>(submitComplaint, null);
  
  const form = useForm<ComplaintFormValues>({
    resolver: zodResolver(ComplaintSchema),
    defaultValues: {
      roomNumber: '',
      category: undefined,
      description: '',
    },
  });

  const formRef = useRef<HTMLFormElement>(null);

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
          ref={formRef}
          action={formAction}
          onSubmit={form.handleSubmit(() => formRef.current?.requestSubmit())}
          className="space-y-6"
        >
          <FormField
            control={form.control}
            name="roomNumber"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Room Number</FormLabel>
                <FormControl>
                  <Input placeholder="e.g., A-101" {...field} />
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
                <Select onValueChange={field.onChange} defaultValue={field.value}>
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
          <SubmitButton />
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

function SubmitButton() {
    const { formState } = useForm();
    return (
        <Button type="submit" className="w-full" disabled={formState.isSubmitting}>
            {formState.isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            Submit Complaint
        </Button>
    )
}
