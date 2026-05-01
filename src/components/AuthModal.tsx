import { useState } from 'react';
import { X } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { authService } from '../services/authService';

interface AuthModalProps {
  onClose: () => void;
}

const AuthModal: React.FC<AuthModalProps> = ({ onClose }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isCreatingAccount, setIsCreatingAccount] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const { login } = useAuth();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage('');
    setIsSubmitting(true);

    try {
      const accessToken = isCreatingAccount
        ? await authService.registerAndLogin({ email, password })
        : await authService.login({ email, password });
      login(accessToken);
      onClose();
    } catch (err) {
      setErrorMessage(
        err instanceof Error
          ? err.message
          : (isCreatingAccount ? 'Account creation failed' : 'Authentication failed')
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg w-full max-w-md p-6 relative">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-400 hover:text-gray-600"
        >
          <X />
        </button>

        <h2 className="text-2xl font-bold mb-6 text-center">
          {isCreatingAccount ? 'Create Account' : 'Sign In'}
        </h2>

        <form onSubmit={handleSubmit} className="space-y-4">
          <input
            type="email"
            required
            placeholder="Email"
            className="w-full px-3 py-2 border rounded-md"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />

          <input
            type="password"
            required
            placeholder="Password"
            className="w-full px-3 py-2 border rounded-md"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />

          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full btn-primary"
          >
            {isSubmitting
              ? (isCreatingAccount ? 'Creating Account...' : 'Signing In...')
              : (isCreatingAccount ? 'Create Account' : 'Sign In')}
          </button>

          {errorMessage && (
            <p className="text-sm text-red-600 text-center">{errorMessage}</p>
          )}
        </form>

        <div className="mt-4 text-center text-sm">
          <button
            type="button"
            className="text-primary-600 hover:text-primary-700"
            onClick={() => {
              setIsCreatingAccount(prev => !prev);
              setErrorMessage('');
            }}
          >
            {isCreatingAccount
              ? 'Already have an account? Sign in'
              : 'New user? Create an account'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default AuthModal;
