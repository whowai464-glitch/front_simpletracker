export interface LoginRequest {
  email: string;
  password: string;
}

export interface LoginResponse {
  access_token?: string;
  refresh_token?: string;
  token_type: string;
  requires_2fa: boolean;
  pre_auth_token?: string;
}

export interface RegisterRequest {
  email: string;
  name: string;
  password: string;
  workspace_name?: string;
  invitation_token?: string;
}

export interface RegisterResponse {
  verification_id: string;
  message: string;
}

export interface VerifyRequest {
  verification_id: string;
  code: string;
}

export interface TokenResponse {
  access_token: string;
  refresh_token: string;
  token_type: string;
}

export interface ResendRequest {
  verification_id: string;
}

export interface ResendResponse {
  verification_id: string;
  message: string;
  next_resend_in_seconds: number;
}

export interface GoogleCallbackRequest {
  code: string;
  state?: string;
}

export interface Verify2faRequest {
  code: string;
}
