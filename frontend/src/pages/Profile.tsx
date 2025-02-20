import { useQuery } from '@tanstack/react-query';

import { Alert, AlertTitle, AlertDescription } from '@/components/ui/alert';
import { Card, CardHeader, CardContent } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';

import { fetchProfile, fetchUserQcmsResult } from '@/utils/api';

interface QcmResponse {
  question: string;
  selectedChoice: string;
  isCorrect: boolean;
}

export interface QcmResult {
  id: string;
  title: string;
  score: number;
  totalQuestions: number;
  date: string;
  responses: QcmResponse[];
}

const Profile = () => {
  const token = sessionStorage.getItem('token');

  const {
    data: qcms,
    isLoading: isQcmsLoading,
    isError: isQcmsError,
    error,
  } = useQuery({
    queryKey: ['qcms'],
    queryFn: fetchUserQcmsResult,
  });

  const {
    data: user,
    isLoading: isUserLoading,
    isError: isUserError,
  } = useQuery({
    queryKey: ['userProfile'],
    queryFn: () => fetchProfile(token),
  });

  return (
    <div className="flex flex-col gap-6 p-6 lg:flex-row">
      {/* TODO: Faire un composant à part pour les données utilisateur
      Pouvoir également modifier ses données à l'aide d'un formulaire */}
      <div className="bg-card rounded-lg p-6 shadow-lg lg:w-1/3">
        <h2 className="text-foreground mb-4 text-2xl font-semibold">Profil Utilisateur</h2>
        {isUserLoading ? (
          <Skeleton className="h-16 w-full rounded-lg" />
        ) : isUserError ? (
          <Alert variant="destructive">
            <AlertTitle>Erreur</AlertTitle>
            <AlertDescription>Impossible de charger le profil utilisateur.</AlertDescription>
          </Alert>
        ) : (
          <div>
            <div className="flex items-center space-x-4">
              <div>
                <p className="text-lg font-bold">{user.name}</p>
                <p className="text-muted-foreground">{user.email}</p>
              </div>
            </div>
            <div className="mt-4">
              <p>
                <strong>Rôle:</strong> {user.role || 'Utilisateur'}
              </p>
              <p>
                <strong>Date d’inscription:</strong> {new Date(user.createdAt).toLocaleDateString()}
              </p>
            </div>
          </div>
        )}
      </div>

      {/* TODO: Mettre la correction si on s'est trompé */}
      <div className="bg-card rounded-lg p-6 shadow-lg lg:w-2/3">
        <h2 className="text-foreground text-2xl font-semibold">Historique des QCM</h2>
        {isQcmsLoading ? (
          <Skeleton className="mt-4 h-32 w-full rounded-lg" />
        ) : isQcmsError ? (
          <Alert variant="destructive">
            <AlertTitle>Erreur</AlertTitle>
            <AlertDescription>{error.message || 'Impossible de récupérer les QCMs.'}</AlertDescription>
          </Alert>
        ) : qcms && qcms.length === 0 ? (
          <p className="text-muted-foreground">Aucun QCM complété.</p>
        ) : (
          <div className="mt-4 space-y-4">
            {qcms &&
              qcms.map((qcm) => (
                <Card key={qcm.id} className="border-border rounded-lg border">
                  <CardHeader>
                    <h3 className="text-lg font-semibold">{qcm.title || 'QCM sans titre'}</h3>
                  </CardHeader>
                  <CardContent>
                    <p className="text-foreground">
                      <strong>Score :</strong> {qcm.score} / {qcm.totalQuestions}
                    </p>
                    <p className="text-muted-foreground">
                      <strong>Date :</strong> {new Date(qcm.date).toLocaleString()}
                    </p>
                    <ul className="mt-2 space-y-2">
                      {qcm?.responses?.map((response, index) => (
                        <li
                          key={index}
                          className={`rounded p-2 ${
                            response.isCorrect ? 'bg-green-100 text-green-700 dark:bg-green-900 dark:text-green-300' : 'bg-red-100 text-red-700 dark:bg-red-900 dark:text-red-300'
                          }`}
                        >
                          <strong>{response.question}</strong> - {response.selectedChoice}
                        </li>
                      ))}
                    </ul>
                  </CardContent>
                </Card>
              ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Profile;
