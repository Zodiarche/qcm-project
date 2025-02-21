import { useEffect, useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { useNavigate } from 'react-router';

import { QCM } from './QCM';

import { fetchProfile, fetchQcms } from '@/utils/api';
import QCMForm from '@/components/QCMForm';

const Dashboard = () => {
  const token = sessionStorage.getItem('token');
  const navigate = useNavigate();

  const [editingQCM, setEditingQCM] = useState(null);

  const {
    data: userData,
    isLoading: isUserLoading,
    isError: isUserError,
  } = useQuery({
    queryKey: ['userProfile'],
    queryFn: () => fetchProfile(token),
  });

  const {
    data: qcms,
    isLoading: isQCMsLoading,
    isError: isQCMsError,
    refetch,
  } = useQuery<QCM[]>({
    queryKey: ['qcms'],
    queryFn: fetchQcms,
    enabled: userData?.isAdmin,
  });

  useEffect(() => {
    if (userData && !userData.isAdmin) {
      navigate('/');
    }
  }, [userData, navigate]);

  const handleEdit = (qcm: any) => {
    setEditingQCM(qcm);
  };

  const handleCloseEditForm = () => {
    setEditingQCM(null);
  };

  const handleDelete = async (qcmId: any) => {
    try {
      const response = await fetch(`http://localhost:5000/api/qcms/${qcmId}`, {
        method: 'DELETE',
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        throw new Error('Erreur lors de la suppression du QCM');
      }

      refetch();
    } catch (error: any) {
      console.error('Erreur:', error.message);
    }
  };

  if (isUserLoading) return <div className="py-4 text-center">Chargement du dashboard...</div>;
  if (isUserError) return <div className="py-4 text-center text-red-500">Erreur lors du chargement du dashboard.</div>;

  return (
    <div className="bg-background text-foreground flex min-h-screen flex-col">
      <div className="flex-1 p-6">
        <h1 className="mb-4 text-3xl font-semibold">Dashboard</h1>

        <div className="space-y-4">
          <h2 className="text-lg font-medium">Liste des QCMs</h2>

          {isQCMsLoading ? (
            <div className="text-muted text-center">Chargement des QCMs...</div>
          ) : isQCMsError ? (
            <div className="text-center text-red-500">Erreur lors du chargement des QCMs.</div>
          ) : (
            <>
              <ul className="space-y-2">
                {qcms && qcms?.length > 0 ? (
                  qcms.map((qcm) => (
                    <li key={qcm._id} className="border-border hover:bg-muted flex items-center justify-between rounded-lg border p-4 transition-all">
                      <span className="text-lg">{qcm.title}</span>
                      <div className="flex space-x-2">
                        <button className="hover:bg-primary-foreground text-accent-foreground block rounded-lg px-4 py-2 transition" onClick={() => handleEdit(qcm)}>
                          Modifier
                        </button>
                        <button className="hover:bg-primary-foreground text-accent-foreground block rounded-lg px-4 py-2 transition" onClick={() => handleDelete(qcm._id)}>
                          Supprimer
                        </button>
                      </div>
                    </li>
                  ))
                ) : (
                  <li>Aucun QCM trouvé.</li>
                )}
              </ul>

              <QCMForm qcmData={editingQCM} refetch={refetch} />
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
