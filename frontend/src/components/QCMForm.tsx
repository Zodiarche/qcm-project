import { useEffect, useState } from 'react';
import { useForm, useFieldArray } from 'react-hook-form';

interface QCMFormProps {
  qcmData: any;
  refetch: () => void;
  onClose: () => void;
}
const QCMForm = ({ qcmData, refetch, onClose }: QCMFormProps) => {
  const { register, handleSubmit, control, setValue, watch } = useForm();
  const { fields, append, remove } = useFieldArray({
    control,
    name: 'questions',
  });

  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (qcmData) {
      setValue('title', qcmData.title);
      setValue('description', qcmData.description);
      setValue('questions', qcmData.questions);
    }
  }, [qcmData, setValue]);

  const appendChoice = (index: any) => {
    const choices = watch(`questions.${index}.choices`) || [];
    setValue(`questions.${index}.choices`, [...choices, { text: '', isCorrect: false }]);
  };

  const removeChoice = (index: any, choiceIndex: any) => {
    const choices = watch(`questions.${index}.choices`) || [];
    choices.splice(choiceIndex, 1);
    setValue(`questions.${index}.choices`, [...choices]);
  };

  const onSubmit = async (data: any) => {
    setLoading(true);
    const method = qcmData ? 'PUT' : 'POST';
    const url = qcmData ? `http://localhost:5000/api/qcms/${qcmData._id}` : 'http://localhost:5000/api/qcms';

    try {
      const response = await fetch(url, {
        method: method,
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${sessionStorage.getItem('token')}`,
        },
        body: JSON.stringify(data),
      });

      const responseData = await response.json();

      if (response.ok) {
        console.log(`${qcmData ? 'QCM mis à jour' : 'QCM ajouté'} :`, responseData);
        refetch();
      } else {
        console.error(`${qcmData ? 'Erreur lors de la mise à jour du QCM' : "Erreur lors de l'ajout du QCM"}`, responseData.message);
      }
    } catch (error) {
      console.error(`${qcmData ? 'Erreur lors de la mise à jour du QCM' : "Erreur lors de l'ajout du QCM"}`, error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-background text-foreground flex min-h-screen flex-col p-8">
      <div className="flex-1">
        <h1 className="text-primary mb-6 text-4xl font-semibold">{qcmData ? 'Modifier un QCM' : 'Ajouter un QCM'}</h1>

        <form onSubmit={handleSubmit(onSubmit)} className="border-border max-w-lg space-y-6">
          <div className="space-y-4">
            <div>
              <label className="text-primary block">Titre</label>
              <input
                type="text"
                {...register('title', { required: 'Le titre est requis' })}
                className="bg-input text-primary border-border focus:ring-primary w-full rounded-lg border-2 p-2 transition focus:ring-2"
              />
            </div>

            <div>
              <label className="text-primary block">Description</label>
              <textarea {...register('description')} className="bg-input text-primary border-border focus:ring-primary w-full rounded-lg border-2 p-2 transition focus:ring-2" />
            </div>
          </div>

          <div>
            <h2 className="text-primary mb-3 text-2xl">Questions</h2>
            {fields.map((item, index) => (
              <div key={item.id} className="bg-card space-y-4 rounded-lg p-4 shadow-md">
                <div>
                  <label className="text-primary mb-1 ml-1 block">Question {index + 1}</label>
                  <input
                    type="text"
                    {...register(`questions.${index}.text`, { required: 'La question est requise' })}
                    className="bg-input text-primary border-border focus:ring-primary rounded-lg border-2 p-2 transition focus:ring-2"
                  />
                </div>

                <div>
                  <label className="text-primary mb-1 ml-1 block">Choix</label>
                  <div className="space-y-4">
                    {watch(`questions.${index}.choices`).map((_choice: any, choiceIndex: any) => (
                      <div key={choiceIndex} className="flex items-center space-x-4">
                        <input
                          type="text"
                          {...register(`questions.${index}.choices.${choiceIndex}.text`, { required: 'Le texte du choix est requis' })}
                          className="input bg-input text-primary border-border focus:ring-primary rounded-lg border-2 p-2 transition focus:ring-2"
                        />
                        <label className="text-primary">Correct</label>
                        <input type="checkbox" {...register(`questions.${index}.choices.${choiceIndex}.isCorrect`)} className="checkbox bg-input border-border" />
                        <button type="button" onClick={() => removeChoice(index, choiceIndex)} className="hover:bg-primary-foreground text-accent-foreground rounded-lg px-4 py-2 transition">
                          Supprimer Choix
                        </button>
                      </div>
                    ))}
                    <button type="button" onClick={() => appendChoice(index)} className="hover:bg-primary-foreground text-accent-foreground rounded-lg px-4 py-2 transition">
                      Ajouter un choix
                    </button>
                  </div>
                </div>

                <button type="button" onClick={() => remove(index)} className="hover:bg-primary-foreground text-accent-foreground m-auto block rounded-lg px-4 py-2 transition">
                  Supprimer la question
                </button>
              </div>
            ))}
            <button
              type="button"
              onClick={() => append({ text: '', choices: [{ text: '', isCorrect: false }] })}
              className="hover:bg-primary-foreground text-accent-foreground mt-3 ml-auto block rounded-lg px-4 py-2 transition"
            >
              Ajouter une question
            </button>
          </div>

          <button type="submit" className="hover:bg-primary-foreground disabled:bg-muted rounded-lg px-6 py-2 text-white transition" disabled={loading}>
            {loading ? 'Traitement en cours...' : qcmData ? 'Mettre à jour le QCM' : 'Ajouter le QCM'}
          </button>
        </form>
      </div>
    </div>
  );
};

export default QCMForm;
