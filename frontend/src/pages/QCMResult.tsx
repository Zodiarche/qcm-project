import { useLocation } from 'react-router';

const QCMResult = () => {
  const { state } = useLocation();
  const result = state?.result;

  if (!result) return <p>Résultat introuvable.</p>;

  return (
    <div className="container mx-auto max-w-4xl px-6 py-10">
      <h1 className="text-primary text-center text-4xl font-extrabold">Résultat du QCM</h1>
      <p className="text-center text-lg">
        Score : {result.score} / {result.responses.length}
      </p>

      {result.responses.map((resp, index) => (
        <div key={index} className={`my-2 rounded p-4 ${resp.isCorrect ? 'bg-green-200' : 'bg-red-200'}`}>
          <p>
            <strong>{resp.question.text}</strong>
          </p>
          <p>Votre réponse : {resp.selectedChoice}</p>
          {!resp.isCorrect && <p>Bonne réponse : {resp.question.choices.find((c) => c.isCorrect)?.text}</p>}
        </div>
      ))}
    </div>
  );
};

export default QCMResult;
