'use client';

import { useForm, useFormContext } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useActionState, useEffect, useRef } from 'react';

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
import { useToast } from '@/hooks/use-toast';
import { login, type FormState } from '@/lib/actions';
import { Loader2 } from 'lucide-react';

const LoginSchema = z.object({
  email: z.string().email('Please enter a valid email address.'),
  password: z.string().min(1, 'Password is required.'),
});

type LoginFormValues = z.infer<typeof LoginSchema>;

export function LoginForm() {
  const { toast } = useToast();
  const [state, formAction] = useActionState<FormState, FormData>(login, null);

  const form = useForm<LoginFormValues>({
    resolver: zodResolver(LoginSchema),
    defaultValues: {
      email: '',
      password: '',
    },
  });

  const formRef = useRef<HTMLFormElement>(null);

  useEffect(() => {
    if (state?.type === 'error') {
      toast({
        variant: 'destructive',
        title: 'Login Failed',
        description: state.message,
      });
      form.setValue('password', '');
    }
  }, [state, toast, form]);

  return (
    <Form {...form}>
      <form
        ref={formRef}
        action={formAction}
        onSubmit={form.handleSubmit(() => formRef.current?.requestSubmit())}
        className="space-y-4"
      >
        <FormField
          control={form.control}
          name="email"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Email</FormLabel>
              <FormControl>
                <Input type="email" placeholder="admin@hallcomplaint.com" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="password"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Password</FormLabel>
              <FormControl>
                <Input type="password" placeholder="••••••••" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <SubmitButton />
      </form>
    </Form>
  );
}

function SubmitButton() {
    const { formState } = useFormContext();
    return (
        <Button type="submit" className="w-full" disabled={formState.isSubmitting}>
             {formState.isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            Log In
        </Button>
    )
}
