import { useForm, SubmitHandler } from 'react-hook-form';
import { useMutation } from '@tanstack/react-query';
import { toast } from 'react-hot-toast';
import { Link, useNavigate } from 'react-router';

import { registerUser } from '@/utils/api';

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { cn } from '@/lib/utils';

export type RegisterInputs = {
  lastname: string;
  firstname: string;
  email: string;
  password: string;
  confirmPassword: string;
};

const Register = () => {
  const navigate = useNavigate();

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm<RegisterInputs>();

  const mutation = useMutation({
    mutationFn: registerUser,
    onSuccess: () => {
      toast.success('Inscription réussie ! Vous pouvez maintenant vous connecter.');
      navigate('/login');
    },
    onError: (error) => {
      console.error(error);
      toast.error(error.message || "L'inscription a échoué, veuillez réessayer plus tard.");
    },
  });

  const onSubmit: SubmitHandler<RegisterInputs> = (data) => {
    mutation.mutate(data);
  };

  return (
    <div className="bg-background flex min-h-screen items-center justify-center">
      <Card className="w-full max-w-md shadow-lg">
        <CardHeader>
          <CardTitle className="text-xl font-semibold">Inscription</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <div className="flex gap-3">
              <div className="w-full">
                <Label htmlFor="lastname">Nom</Label>
                <Input id="lastname" {...register('lastname', { required: 'Le nom est requis' })} className={cn(errors.lastname && 'border-destructive')} />
                {errors.lastname && <p className="text-destructive mt-1 text-sm">{errors.lastname.message}</p>}
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
              <Label htmlFor="password">Mot de passe</Label>
              <Input
                id="password"
                type="password"
                {...register('password', { required: 'Le mot de passe est requis', minLength: { value: 12, message: 'Minimum 12 caractères' } })}
                className={cn(errors.password && 'border-destructive')}
              />
              {errors.password && <p className="text-destructive mt-1 text-sm">{errors.password.message}</p>}
            </div>

            <div>
              <Label htmlFor="confirmPassword">Confirmez le mot de passe</Label>
              <Input
                id="confirmPassword"
                type="password"
                {...register('confirmPassword', {
                  required: 'Veuillez confirmer votre mot de passe',
                  validate: (value) => value === watch('password') || 'Les mots de passe ne correspondent pas',
                })}
                className={cn(errors.confirmPassword && 'border-destructive')}
              />
              {errors.confirmPassword && <p className="text-destructive mt-1 text-sm">{errors.confirmPassword.message}</p>}
            </div>

            <Button type="submit" className="w-full" disabled={mutation.isPending}>
              {mutation.isPending ? 'Inscription...' : "S'inscrire"}
            </Button>
          </form>

          <div className="mt-4 text-center">
            <p className="text-sm">
              Vous avez déjà un compte ?{' '}
              <Link to="/login" className="text-primary hover:underline">
                Connectez-vous
              </Link>
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default Register;
