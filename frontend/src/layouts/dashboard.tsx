import { useEffect, Suspense, lazy } from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth0 } from '@auth0/auth0-react';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '@/redux/store';
import { setUserData } from '@/redux/userSlice';
import { LoadingSpinner } from '@/components/loadingSpinner';

// Lazy load las vistas privilegiadas
const AdminOverview = lazy(() => import('@/private/admin/adminOverview'));
const InvestorOverview = lazy(() => import('@/private/investor/overview/investorOverview'));

const Dashboard = () => {
  const {  isAuthenticated, isLoading, getIdTokenClaims } = useAuth0();
  const dispatch = useDispatch();
  const userRole = useSelector((state: RootState) => state.user.role);

  useEffect(() => {
    const fetchUserRole = async () => {
      try {
        const claims = await getIdTokenClaims();
        const role = claims?.['https://tokunize.com/role'] ?? 'user';
        
        // Solo actualiza si el rol es diferente al actual
        if (role !== userRole) {
          dispatch(setUserData({ role }));
        }
      } catch (error) {
        console.error('Error fetching user claims:', error);
        dispatch(setUserData({ role: 'user' }));
      }
    };

    if (isAuthenticated && !userRole) {
      fetchUserRole();
    }
  }, [isAuthenticated, userRole, getIdTokenClaims, dispatch]);

  // Estado de carga inicial de Auth0
  if (isLoading) {
    return <LoadingSpinner />;
  }

  // Usuario no autenticado
  if (!isAuthenticated) {
    return <Navigate to="/" replace />;
  }

  // Esperar mientras se obtiene el rol del usuario
  if (!userRole) {
    return <LoadingSpinner />;
  }

  // Renderizar vista según rol
  return (
    <Suspense fallback={<LoadingSpinner />}>
      {userRole === 'admin' ? (
        <AdminOverview />
      ) : userRole === 'user' ? (
        <InvestorOverview />
      ) : (
        <Navigate to="/" replace />
      )}
    </Suspense>
  );
};

export default Dashboard;
