import { useState } from 'react';
import { useParams, useNavigate } from 'react-router';
import { useQuery, useMutation } from '@tanstack/react-query';
import { fetchQcmById, submitQcmResponse } from '@/utils/api';
import { Button } from '@/components/ui/button';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import toast from 'react-hot-toast';

const QCMDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [answers, setAnswers] = useState<{ [key: string]: string }>({});

  const {
    data: qcm,
    isLoading,
    isError,
  } = useQuery({
    queryKey: ['qcm', id],
    queryFn: () => fetchQcmById(id!),
  });

  // Mutation pour soumettre les réponses
  const mutation = useMutation({
    mutationFn: submitQcmResponse,
    onSuccess: (result) => {
      navigate(`/qcms/${id}/result`, { state: { result } });
    },
  });

  // Gérer la sélection des réponses
  const handleSelect = (questionId: string, choiceId: string) => {
    setAnswers((prev) => ({ ...prev, [questionId]: choiceId }));
  };

  // Soumettre le QCM
  const handleSubmit = () => {
    if (!id) return;

    // Vérifier si toutes les questions ont une réponse
    const unansweredQuestions = qcm.questions.some((question: any) => !answers[question._id]);

    if (unansweredQuestions) {
      toast.error('Veuillez répondre à toutes les questions avant de valider.');
      return;
    }

    mutation.mutate({ qcmId: id, responses: answers });
  };

  if (isLoading) return <p className="text-primary text-center text-lg">Chargement...</p>;
  if (isError || !qcm) return <p className="text-destructive text-center">Une erreur est survenue, veuillez réessayez plus tard.</p>;

  return (
    <div className="container mx-auto max-w-3xl px-6 py-10">
      <h1 className="text-primary text-center text-4xl font-extrabold">{qcm.title}</h1>
      <p className="text-muted-foreground text-center">{qcm.description}</p>

      {qcm.questions.map((question: any) => (
        <Card key={question._id} className="border-border my-4 border shadow-lg">
          <CardHeader>
            <CardTitle className="text-foreground text-xl font-semibold">{question.text}</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              {question.choices.map((choice: any) => (
                <label key={choice.text} className="bg-secondary hover:bg-accent flex cursor-pointer items-center gap-2 rounded-md p-3 transition-all">
                  <input
                    type="radio"
                    name={question._id}
                    value={choice._id}
                    checked={answers[question._id] === choice._id}
                    onChange={() => handleSelect(question._id, choice._id)}
                    className="hidden"
                  />

                  <div className={`border-border flex h-5 w-5 items-center justify-center rounded-full border-2 ${answers[question._id] === choice._id ? 'bg-primary' : 'bg-transparent'}`}>
                    {answers[question._id] === choice._id && <div className="bg-primary-foreground h-3 w-3 rounded-full"></div>}
                  </div>
                  <span className="text-foreground">{choice.text}</span>
                </label>
              ))}
            </div>
          </CardContent>
        </Card>
      ))}

      <Button onClick={handleSubmit} className="mt-6 w-full text-lg font-semibold">
        Valider mes réponses
      </Button>
    </div>
  );
};

export default QCMDetail;
