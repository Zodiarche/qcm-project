import { useLocation, Link } from 'react-router';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button'; // Assurez-vous d'avoir un composant Button

const QCMResult = () => {
  const { state } = useLocation();
  const result = state?.result;

  if (!result) return <p className="text-destructive text-center">Résultat introuvable.</p>;

  // Calculer le pourcentage de réussite
  const scorePercentage = (result.score / result.responses.length) * 100;
  let scoreColor = 'bg-secondary';

  if (scorePercentage >= 80) scoreColor = 'bg-green-500';
  else if (scorePercentage >= 50) scoreColor = 'bg-yellow-500';
  else scoreColor = 'bg-red-500';

  return (
    <div className="animate-fade-in container mx-auto max-w-3xl px-6 py-10">
      <Card className="shadow-lg">
        <CardHeader>
          <CardTitle className="text-primary text-center text-3xl font-bold">Résultat du QCM</CardTitle>
          <div className="mt-2 text-center">
            <Badge className={`${scoreColor} px-4 py-2 text-lg text-white`}>
              Score : {result.score} / {result.responses.length}
            </Badge>
          </div>
        </CardHeader>

        <CardContent className="space-y-4">
          {result.responses.map((response: any, index: number) => (
            <div key={index} className={`rounded-lg p-4 shadow transition-all duration-300 ${response.isCorrect ? 'border-green-300 bg-green-100' : 'border-red-300 bg-red-100'} border`}>
              <p className="text-lg font-semibold">{response.question.text}</p>
              <p className="mt-1">
                <span className="font-medium">Votre réponse :</span> <span className="text-primary">{response.selectedChoice}</span>
              </p>
              {!response.isCorrect && (
                <p className="mt-1">
                  <span className="font-medium">Bonne réponse :</span> <span className="text-green-700">{response.question.choices.find((c: any) => c.isCorrect)?.text}</span>
                </p>
              )}
            </div>
          ))}
        </CardContent>
      </Card>

      <Button asChild className="mt-6 w-full">
        <Link to="profil">Voir mon profil</Link>
      </Button>
    </div>
  );
};

export default QCMResult;
