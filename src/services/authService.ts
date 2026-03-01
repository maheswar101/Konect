import { ApiError, apiClient } from './api';

export interface User {
  id: string;
  email: string;
  username: string;
  avatar?: string;
  bio?: string;
  followers?: number;
  following?: number;
  reputation?: number;
  createdAt?: string;
  anonymousMode?: boolean;
}

export interface AuthResponse {
  user: User;
  token: string;
  refreshToken: string;
}

export interface SignInCredentials {
  email: string;
  password: string;
}

export interface SignUpCredentials {
  email: string;
  username: string;
  password: string;
}

interface MockStoredUser extends User {
  password: string;
}

const MOCK_USERS_KEY = 'mock_auth_users';
const MOCK_CURRENT_USER_KEY = 'mock_auth_current_user';

class AuthService {
  private getMockUsers(): MockStoredUser[] {
    try {
      const rawUsers = localStorage.getItem(MOCK_USERS_KEY);
      return rawUsers ? (JSON.parse(rawUsers) as MockStoredUser[]) : [];
    } catch {
      return [];
    }
  }

  private saveMockUsers(users: MockStoredUser[]) {
    localStorage.setItem(MOCK_USERS_KEY, JSON.stringify(users));
  }

  private setMockCurrentUser(user: User | null) {
    if (user) {
      localStorage.setItem(MOCK_CURRENT_USER_KEY, JSON.stringify(user));
    } else {
      localStorage.removeItem(MOCK_CURRENT_USER_KEY);
    }
  }

  private getMockCurrentUser(): User | null {
    try {
      const rawUser = localStorage.getItem(MOCK_CURRENT_USER_KEY);
      return rawUser ? (JSON.parse(rawUser) as User) : null;
    } catch {
      return null;
    }
  }

  private createMockToken(userId: string): string {
    return `mock-token-${userId}-${Date.now()}`;
  }

  private createMockAuthResponse(user: User): AuthResponse {
    const token = this.createMockToken(user.id);
    apiClient.setToken(token);
    this.setMockCurrentUser(user);
    return {
      user,
      token,
      refreshToken: `mock-refresh-${user.id}`,
    };
  }

  private shouldFallbackToMockAuth(error: unknown): boolean {
    if (!(error instanceof ApiError)) {
      return true;
    }

    if (!error.status) {
      return true;
    }

    return error.status === 404 || error.status === 405 || error.status >= 500;
  }

  private signInMock(credentials: SignInCredentials): AuthResponse {
    const users = this.getMockUsers();
    const matchedUser = users.find(
      (user) =>
        user.email.toLowerCase() === credentials.email.toLowerCase() &&
        user.password === credentials.password
    );

    if (!matchedUser) {
      throw new Error('Invalid credentials');
    }

    const safeUser: User = {
      id: matchedUser.id,
      email: matchedUser.email,
      username: matchedUser.username,
      avatar: matchedUser.avatar,
      bio: matchedUser.bio,
      followers: matchedUser.followers,
      following: matchedUser.following,
      reputation: matchedUser.reputation,
      createdAt: matchedUser.createdAt,
      anonymousMode: matchedUser.anonymousMode,
    };
    return this.createMockAuthResponse(safeUser);
  }

  private signUpMock(credentials: SignUpCredentials): AuthResponse {
    const users = this.getMockUsers();
    const normalizedEmail = credentials.email.toLowerCase();
    const normalizedUsername = credentials.username.toLowerCase();

    const emailTaken = users.some((user) => user.email.toLowerCase() === normalizedEmail);
    if (emailTaken) {
      throw new Error('Email already exists');
    }

    const usernameTaken = users.some((user) => user.username.toLowerCase() === normalizedUsername);
    if (usernameTaken) {
      throw new Error('Username already exists');
    }

    const createdUser: MockStoredUser = {
      id: crypto.randomUUID(),
      email: credentials.email,
      username: credentials.username,
      password: credentials.password,
      followers: 0,
      following: 0,
      reputation: 0,
      createdAt: new Date().toISOString(),
      anonymousMode: false,
    };

    users.push(createdUser);
    this.saveMockUsers(users);

    const safeUser: User = {
      id: createdUser.id,
      email: createdUser.email,
      username: createdUser.username,
      avatar: createdUser.avatar,
      bio: createdUser.bio,
      followers: createdUser.followers,
      following: createdUser.following,
      reputation: createdUser.reputation,
      createdAt: createdUser.createdAt,
      anonymousMode: createdUser.anonymousMode,
    };
    return this.createMockAuthResponse(safeUser);
  }

  async signIn(credentials: SignInCredentials): Promise<AuthResponse> {
    try {
      const response = await apiClient.post<AuthResponse>('/auth/signin', credentials);
      apiClient.setToken(response.token);
      this.setMockCurrentUser(null);
      return response;
    } catch (error) {
      if (this.shouldFallbackToMockAuth(error)) {
        return this.signInMock(credentials);
      }
      throw error;
    }
  }

  async signUp(credentials: SignUpCredentials): Promise<AuthResponse> {
    try {
      const response = await apiClient.post<AuthResponse>('/auth/signup', credentials);
      apiClient.setToken(response.token);
      this.setMockCurrentUser(null);
      return response;
    } catch (error) {
      if (this.shouldFallbackToMockAuth(error)) {
        return this.signUpMock(credentials);
      }
      throw error;
    }
  }

  async signOut(): Promise<void> {
    try {
      await apiClient.post('/auth/signout');
    } catch (error) {
      console.error('Sign out error:', error);
    } finally {
      apiClient.setToken(null);
      this.setMockCurrentUser(null);
    }
  }

  async refreshToken(refreshToken: string): Promise<AuthResponse> {
    const response = await apiClient.post<AuthResponse>('/auth/refresh', { refreshToken });
    apiClient.setToken(response.token);
    return response;
  }

  async getCurrentUser(): Promise<User> {
    try {
      return await apiClient.get<User>('/auth/me');
    } catch (error) {
      if (this.shouldFallbackToMockAuth(error)) {
        const currentUser = this.getMockCurrentUser();
        if (currentUser) {
          return currentUser;
        }
      }
      throw error;
    }
  }

  async updateProfile(data: Partial<User>): Promise<User> {
    try {
      return await apiClient.patch<User>('/auth/profile', data);
    } catch (error) {
      if (this.shouldFallbackToMockAuth(error)) {
        const currentUser = this.getMockCurrentUser();
        if (!currentUser) {
          throw new Error('No authenticated user');
        }

        const users = this.getMockUsers();
        const index = users.findIndex((user) => user.id === currentUser.id);
        if (index === -1) {
          throw new Error('User not found');
        }

        const updatedUser: User = {
          ...currentUser,
          ...data,
        };

        users[index] = {
          ...users[index],
          ...updatedUser,
        };

        this.saveMockUsers(users);
        this.setMockCurrentUser(updatedUser);
        return updatedUser;
      }
      throw error;
    }
  }

  async changePassword(oldPassword: string, newPassword: string): Promise<void> {
    await apiClient.post('/auth/change-password', { oldPassword, newPassword });
  }

  async resetPassword(email: string): Promise<void> {
    await apiClient.post('/auth/reset-password', { email });
  }
}

export const authService = new AuthService();
