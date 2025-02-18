import { useForm, SubmitHandler } from 'react-hook-form';

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

import { cn } from '@/lib/utils'; // ShadCN helper pour gérer les classes conditionnelles

type Inputs = {
  name: string;
  firstname: string;
  email: string;
  message: string;
};

const Contact = () => {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<Inputs>();

  const onSubmit: SubmitHandler<Inputs> = async (data) => {
    try {
      console.log(data);

      const response = await fetch('http://localhost:5000/send-email', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      });

      if (!response.ok) throw new Error('Erreur lors de l’envoi du formulaire');

      alert('Votre message a bien été envoyé !');
    } catch (error) {
      console.error(error);
      alert('Une erreur est survenue, veuillez réessayer.');
    }
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
                <Input id="firstname" {...register('firstname', { required: 'Le nom est requis' })} className={cn(errors.name && 'border-destructive')} />
                {errors.name && <p className="text-destructive mt-1 text-sm">{errors.name.message}</p>}
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

            <Button type="submit" className="w-full">
              Envoyer
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
};

export default Contact;
