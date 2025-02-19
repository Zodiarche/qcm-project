import { useForm, SubmitHandler } from 'react-hook-form';
import { useMutation } from '@tanstack/react-query';
import { toast } from 'react-hot-toast';

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { cn } from '@/lib/utils';

type Inputs = {
  name: string;
  firstname: string;
  email: string;
  message: string;
};

const sendContactForm = async (data: Inputs) => {
  const response = await fetch('http://localhost:5000/send-email', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(data),
  });

  if (!response.ok) {
    throw new Error('Erreur lors de l’envoi du formulaire');
  }

  return response.json();
};

const Contact = () => {
  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<Inputs>();

  const mutation = useMutation({
    mutationFn: sendContactForm,
    onSuccess: () => {
      toast.success('Votre message a bien été envoyé !');
      reset();
    },
    onError: (error) => {
      console.error(error);
      toast.error('Une erreur est survenue, veuillez réessayer plus tard.');
    },
  });

  const onSubmit: SubmitHandler<Inputs> = (data) => {
    mutation.mutate(data);
  };

  return (
    <div className="bg-background flex min-h-screen items-center justify-center">
      <Card className="w-full max-w-lg shadow-lg">
        <CardHeader>
          <CardTitle className="text-xl font-semibold">Contactez-nous</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <div className="flex gap-3">
              <div className="w-full">
                <Label htmlFor="name">Nom</Label>
                <Input id="name" {...register('name', { required: 'Le nom est requis' })} className={cn(errors.name && 'border-destructive')} />
                {errors.name && <p className="text-destructive mt-1 text-sm">{errors.name.message}</p>}
              </div>

              <div className="w-full">
                <Label htmlFor="firstname">Prénom</Label>
                <Input id="firstname" {...register('firstname', { required: 'Le prénom est requis' })} className={cn(errors.firstname && 'border-destructive')} />
                {errors.firstname && <p className="text-destructive mt-1 text-sm">{errors.firstname.message}</p>}
              </div>
            </div>

            <div>
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                {...register('email', {
                  required: "L'email est requis",
                  pattern: {
                    value: /^[\w-.]+@([\w-]+\.)+[\w-]{2,4}$/,
                    message: 'Email invalide',
                  },
                })}
                className={cn(errors.email && 'border-destructive')}
              />
              {errors.email && <p className="text-destructive mt-1 text-sm">{errors.email.message}</p>}
            </div>

            <div>
              <Label htmlFor="message">Message</Label>
              <textarea id="message" {...register('message', { required: 'Le message est requis' })} className={cn('w-full rounded-md border p-2', errors.message && 'border-destructive')} rows={4} />
              {errors.message && <p className="text-destructive mt-1 text-sm">{errors.message.message}</p>}
            </div>

            <Button type="submit" className="w-full" disabled={mutation.isPending}>
              {mutation.isPending ? 'Envoi en cours...' : 'Envoyer'}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
};

export default Contact;
