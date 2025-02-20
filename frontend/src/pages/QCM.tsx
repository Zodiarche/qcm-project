import { useQuery } from '@tanstack/react-query';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';

import { fetchQcms } from '@/utils/api';

interface QCM {
  _id: string;
  title: string;
  description?: string;
  questions: string[];
  createdBy: string;
  isPublished: boolean;
}

const QCMList = () => {
  const {
    data: qcms,
    isLoading,
    isError,
  } = useQuery<QCM[]>({
    queryKey: ['qcms'],
    queryFn: fetchQcms,
  });

  return (
    <div className="container mx-auto max-w-6xl px-6 py-10">
      <h1 className="text-primary mb-8 text-center text-4xl font-extrabold">📋 Liste des QCMs</h1>

      {isLoading ? (
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 md:grid-cols-3">
          {[...Array(6)].map((_, index) => (
            <Skeleton key={index} className="h-40 w-full rounded-lg" />
          ))}
        </div>
      ) : isError ? (
        <p className="text-destructive text-center text-lg font-medium">Erreur lors du chargement des QCMs. Veuillez réessayer.</p>
      ) : qcms && qcms.length > 0 ? (
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 md:grid-cols-3">
          {qcms.map((qcm) => (
            <Card key={qcm._id} className="border-border border transition-transform duration-300 hover:scale-105 hover:shadow-xl">
              <CardHeader>
                <CardTitle className="text-primary text-lg font-semibold">{qcm.title}</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">{qcm.description || 'Aucune description disponible.'}</p>
                <Button asChild className="mt-4 w-full">
                  <a href={`/qcms/${qcm._id}`}>Accéder au QCM</a>
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>
      ) : (
        <p className="text-muted-foreground col-span-full text-center text-lg">Aucun QCM disponible pour le moment.</p>
      )}
    </div>
  );
};

export default QCMList;
