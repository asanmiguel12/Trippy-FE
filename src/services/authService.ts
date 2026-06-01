import axios from 'axios';

const API_BASE_URL =
  (import.meta as any).env?.VITE_API_BASE_URL || 'https://trippy-be.onrender.com/api';

interface AuthTokenResponse {
  accessToken?: string;
  accesstoken?: string;
  token?: string;
}

interface RegisterRequest {
  email: string;
  password: string;
}

interface LoginRequest {
  email: string;
  password: string;
}

const extractAccessToken = (payload: AuthTokenResponse): string | null => {
  return payload.accessToken || payload.accesstoken || payload.token || null;
};

export const authService = {
  async register(data: RegisterRequest): Promise<string | null> {
    const response = await axios.post<AuthTokenResponse>(`${API_BASE_URL}/auth/register`, {
      email: data.email,
      password: data.password,
      username: data.email,
    });
    return extractAccessToken(response.data);
  },

  async login(data: LoginRequest): Promise<string> {
    const response = await axios.post<AuthTokenResponse>(
      `${API_BASE_URL}/auth/login`,
      {
        email: data.email,
        password: data.password,
      }
    );
  
    const token = extractAccessToken(response.data);
  
    if (!token) {
      throw new Error('No access token in login response');
    }
  
    return token;
  },

  async registerAndLogin(data: RegisterRequest): Promise<string> {
    const registerToken = await this.register(data);
    if (registerToken) {
      return registerToken;
    }
    return this.login({ email: data.email, password: data.password });
  },
};
