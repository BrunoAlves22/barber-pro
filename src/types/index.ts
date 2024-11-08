export interface User {
  id: string;
  name: string;
  email: string;
  address: string | null;
  subscriptions?: Subscription | null;
}

interface Subscription {
  id: string;
  status: string;
}

export interface SignInCredentials {
  email: string;
  password: string;
}

export interface SignUpCredentials {
  name: string;
  email: string;
  password: string;
}

export interface SignInResponse {
  id: string;
  name: string;
  token: string;
  address: string | null;
  subscription?: Subscription | null;
}

export interface SignUpResponse {
  name: string;
  email: string;
  password: string;
}
