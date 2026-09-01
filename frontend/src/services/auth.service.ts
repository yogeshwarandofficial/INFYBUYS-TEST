import { apiClient } from './apiClient';

export type UserRole = 'buyer' | 'seller' | 'agency' | 'admin' | 'super-admin';

export interface User {
  id: string;
  name: string;
  email: string;
  roles: string[]; // backend uses roles array
  phone?: string;
  verified: boolean;
  hasActiveSubscription?: boolean;
}

export interface AuthResponse {
  accessToken: string;
  refreshToken: string;
}

class AuthService {
  async login(email: string, password: string): Promise<{ user: User, token: string }> {
    const res = await apiClient.post<AuthResponse>('/auth/login', { email, password });
    localStorage.setItem('accessToken', res.accessToken);
    localStorage.setItem('refreshToken', res.refreshToken);
    const user = await this.getCurrentUser();
    return { user, token: res.accessToken };
  }

  async register(data: any): Promise<void> {
    const payload = {
      name: data.name,
      email: data.email,
      password: data.password,
    };
    await apiClient.post('/auth/register', payload);
  }

  async getCurrentUser(): Promise<User> {
    const user = await apiClient.get<any>('/users/me');
    return {
      ...user,
      verified: !!user.verifiedAt,
      hasActiveSubscription: user.userSubscriptions && user.userSubscriptions.length > 0
    };
  }

  async logout(): Promise<void> {
    const refreshToken = localStorage.getItem('refreshToken');
    try {
      await apiClient.post('/auth/logout', { refreshToken });
    } catch (e) {
      // ignore
    }
    localStorage.removeItem('accessToken');
    localStorage.removeItem('refreshToken');
  }

  async verifyOTP(_code: string): Promise<boolean> {
    // Implement when backend supports
    return true;
  }

  async forgotPassword(_email: string): Promise<boolean> {
    // Implement when backend supports
    return true;
  }

  async resetPassword(_password: string): Promise<boolean> {
    // Implement when backend supports
    return true;
  }

  async verifyEmailToken(token: string): Promise<{ message: string }> {
    return apiClient.post('/auth/verify-email', { token });
  }

  async resendVerificationEmail(email: string): Promise<{ message: string }> {
    return apiClient.post('/auth/resend-verification', { email });
  }
}

export const authService = new AuthService();
