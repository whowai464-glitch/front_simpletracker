import { useMutation } from '@tanstack/react-query';
import { useNavigate } from 'react-router-dom';
import { notifications } from '@mantine/notifications';
import { useAuthStore } from '@/stores/authStore';
import {
  login,
  register,
  verifyRegistration,
  resendCode,
  logout as logoutApi,
  getGoogleAuthUrl,
  verify2faLogin,
} from '@/api/auth';
import { getErrorMessage } from '@/lib/errors';


export function useLogin() {
  const navigate = useNavigate();
  const setTokens = useAuthStore((s) => s.setTokens);

  return useMutation({
    mutationFn: login,
    onSuccess: (data) => {
      if (data.requires_2fa) {
        // Store pre_auth_token for 2FA verification step
        if (data.pre_auth_token) {
          sessionStorage.setItem('pre_auth_token', data.pre_auth_token);
        }
        navigate('/verify-2fa');
      } else if (data.access_token && data.refresh_token) {
        setTokens(data.access_token, data.refresh_token);
        navigate('/dashboard');
      }
    },
    onError: (error) => {
      notifications.show({
        title: 'Login failed',
        message: getErrorMessage(error),
        color: 'red',
      });
    },
  });
}

export function useRegister() {
  return useMutation({
    mutationFn: register,
    onError: (error) => {
      notifications.show({
        title: 'Registration failed',
        message: getErrorMessage(error),
        color: 'red',
      });
    },
  });
}

export function useVerifyRegistration() {
  const navigate = useNavigate();
  const setTokens = useAuthStore((s) => s.setTokens);

  return useMutation({
    mutationFn: verifyRegistration,
    onSuccess: (data) => {
      setTokens(data.access_token, data.refresh_token);
      navigate('/dashboard');
    },
    onError: (error) => {
      notifications.show({
        title: 'Verification failed',
        message: getErrorMessage(error),
        color: 'red',
      });
    },
  });
}

export function useResendCode() {
  return useMutation({
    mutationFn: resendCode,
    onSuccess: (data) => {
      notifications.show({
        title: 'Code resent',
        message: data.message,
        color: 'green',
      });
    },
    onError: (error) => {
      notifications.show({
        title: 'Resend failed',
        message: getErrorMessage(error),
        color: 'red',
      });
    },
  });
}

export function useLogout() {
  const navigate = useNavigate();
  const clearAuth = useAuthStore((s) => s.clearAuth);
  const refreshToken = useAuthStore((s) => s.refreshToken);

  return useMutation({
    mutationFn: () => logoutApi(refreshToken ?? undefined),
    onSettled: () => {
      clearAuth();
      navigate('/login');
    },
  });
}

export function useGoogleAuth() {
  return async (state?: string) => {
    try {
      const { authorization_url } = await getGoogleAuthUrl(state);
      window.location.href = authorization_url;
    } catch (error) {
      notifications.show({
        title: 'Google auth failed',
        message: getErrorMessage(error),
        color: 'red',
      });
    }
  };
}

export function useVerify2fa() {
  const navigate = useNavigate();
  const setTokens = useAuthStore((s) => s.setTokens);

  return useMutation({
    mutationFn: verify2faLogin,
    onSuccess: (data) => {
      setTokens(data.access_token, data.refresh_token);
      sessionStorage.removeItem('pre_auth_token');
      navigate('/dashboard');
    },
    onError: (error) => {
      notifications.show({
        title: '2FA verification failed',
        message: getErrorMessage(error),
        color: 'red',
      });
    },
  });
}
