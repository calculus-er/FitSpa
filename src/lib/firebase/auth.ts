import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
  updateProfile,
  User,
  UserCredential,
} from 'firebase/auth';
import { auth } from './config';

export interface SignUpData {
  email: string;
  password: string;
  name: string;
}

export interface SignInData {
  email: string;
  password: string;
}

export const signUp = async (data: SignUpData): Promise<UserCredential> => {
  const { email, password, name } = data;
  const userCredential = await createUserWithEmailAndPassword(auth, email, password);
  
  // Update user profile with name
  if (userCredential.user) {
    await updateProfile(userCredential.user, {
      displayName: name,
    });
  }
  
  return userCredential;
};

export const signIn = async (data: SignInData): Promise<UserCredential> => {
  const { email, password } = data;
  return await signInWithEmailAndPassword(auth, email, password);
};

export const logout = async (): Promise<void> => {
  await signOut(auth);
};

export const getCurrentUser = (): User | null => {
  return auth.currentUser;
};

