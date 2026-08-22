import { useEffect, useRef } from 'react';
import { Link, useParams } from 'react-router-dom';
import { Loader2, CheckCircle, XCircle } from 'lucide-react';
import { useDispatch, useSelector } from 'react-redux';
import { verifyEmail, reset } from '../../features/auth/authSlice';
import type { AppDispatch, RootState } from '../../app/store';

export default function VerifyEmail() {
  const { token } = useParams<{ token: string }>();
  const dispatch = useDispatch<AppDispatch>();
  const hasVerified = useRef(false);

  const { isLoading, isError, isSuccess, message } = useSelector(
    (state: RootState) => state.auth
  );

  useEffect(() => {
    if (token && !hasVerified.current) {
      hasVerified.current = true;
      dispatch(verifyEmail(token));
    }
  }, [token, dispatch]);

  useEffect(() => {
    return () => {
      dispatch(reset());
    };
  }, [dispatch]);

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <Link to="/" className="flex justify-center text-3xl font-bold text-primary">
          Homyz.
        </Link>
        <div className="mt-8 bg-white py-8 px-4 shadow sm:rounded-lg sm:px-10 text-center">
          {isLoading && (
            <div className="flex flex-col items-center">
              <Loader2 className="w-12 h-12 text-primary animate-spin mb-4" />
              <h2 className="text-xl font-semibold text-gray-900">Verifying your email...</h2>
              <p className="mt-2 text-sm text-gray-500">Please wait while we verify your email address.</p>
            </div>
          )}

          {!isLoading && isSuccess && (
            <div className="flex flex-col items-center">
              <CheckCircle className="w-12 h-12 text-green-500 mb-4" />
              <h2 className="text-xl font-semibold text-gray-900">Email Verified!</h2>
              <p className="mt-2 text-sm text-gray-500 mb-6">{message}</p>
              <Link
                to="/login"
                className="w-full flex justify-center py-2.5 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-primary hover:bg-blue-700"
              >
                Go to Login
              </Link>
            </div>
          )}

          {!isLoading && isError && (
            <div className="flex flex-col items-center">
              <XCircle className="w-12 h-12 text-red-500 mb-4" />
              <h2 className="text-xl font-semibold text-gray-900">Verification Failed</h2>
              <p className="mt-2 text-sm text-gray-500 mb-6">{message}</p>
              <Link
                to="/register"
                className="w-full flex justify-center py-2.5 px-4 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50"
              >
                Back to Registration
              </Link>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
