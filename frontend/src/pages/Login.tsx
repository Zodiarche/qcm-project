import { useForm, SubmitHandler } from 'react-hook-form';
import { useMutation } from '@tanstack/react-query';
import { toast } from 'react-hot-toast';
import { Link, useNavigate } from 'react-router';

import { useAuth } from '@/context/authContext';

import { loginUser } from '@/utils/api.js';

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { cn } from '@/lib/utils';

export type LoginInputs = {
  email: string;
  password: string;
};

const Login = () => {
  const navigate = useNavigate();
  const { login } = useAuth();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginInputs>();

  const mutation = useMutation({
    mutationFn: loginUser,
    onSuccess: (data) => {
      login(data.token, data.userId);
      toast.success('Connexion réussie !');
      navigate('/profile');
    },
    onError: (error) => {
      console.error(error);
      toast.error(error.message || 'Identifiants incorrects');
    },
  });

  const onSubmit: SubmitHandler<LoginInputs> = (data) => {
    mutation.mutate(data);
  };

  return (
    <div className="bg-background flex min-h-screen items-center justify-center">
      <Card className="w-full max-w-md shadow-lg">
        <CardHeader>
          <CardTitle className="text-xl font-semibold">Connexion</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
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
              <Input id="password" type="password" {...register('password', { required: 'Le mot de passe est requis' })} className={cn(errors.password && 'border-destructive')} />
              {errors.password && <p className="text-destructive mt-1 text-sm">{errors.password.message}</p>}
            </div>

            <Button type="submit" className="w-full" disabled={mutation.isPending}>
              {mutation.isPending ? 'Connexion...' : 'Se connecter'}
            </Button>
          </form>

          <div className="mt-4 text-center">
            <p className="text-sm">
              Pas encore de compte ?{' '}
              <Link to="/register" className="text-primary hover:underline">
                Inscrivez-vous
              </Link>
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default Login;
