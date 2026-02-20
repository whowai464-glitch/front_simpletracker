import client from './client';
import type {
  LoginRequest,
  LoginResponse,
  RegisterRequest,
  RegisterResponse,
  VerifyRequest,
  TokenResponse,
  ResendRequest,
  ResendResponse,
  GoogleCallbackRequest,
  Verify2faRequest,
} from '@/types';

export function login(data: LoginRequest) {
  return client.post<LoginResponse>('/auth/login', data).then((r) => r.data);
}

export function register(data: RegisterRequest) {
  return client
    .post<RegisterResponse>('/auth/register', data)
    .then((r) => r.data);
}

export function verifyRegistration(data: VerifyRequest) {
  return client
    .post<TokenResponse>('/auth/register/verify', data)
    .then((r) => r.data);
}

export function resendCode(data: ResendRequest) {
  return client
    .post<ResendResponse>('/auth/register/resend', data)
    .then((r) => r.data);
}

export function refreshToken(refresh_token: string) {
  return client
    .post<TokenResponse>('/auth/refresh', { refresh_token })
    .then((r) => r.data);
}

export function logout(refresh_token?: string) {
  return client
    .post<void>('/auth/logout', refresh_token ? { refresh_token } : undefined)
    .then((r) => r.data);
}

export function getGoogleAuthUrl(state?: string) {
  return client
    .get<{ authorization_url: string }>('/auth/google', {
      params: state ? { state } : undefined,
    })
    .then((r) => r.data);
}

export function googleCallback(data: GoogleCallbackRequest) {
  return client
    .post<TokenResponse>('/auth/google/callback', data)
    .then((r) => r.data);
}

export function request2fa() {
  return client
    .post<{ message: string }>('/auth/2fa/request')
    .then((r) => r.data);
}

export function verify2faLogin(data: Verify2faRequest) {
  return client
    .post<TokenResponse>('/auth/login/verify-2fa', data)
    .then((r) => r.data);
}
