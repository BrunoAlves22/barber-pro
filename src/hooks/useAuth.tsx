import { useRouter } from "next/navigation";
import { useAuthStore } from "@/app/stores/useAuthStore";
import { SignInCredentials, SignUpCredentials } from "@/types";

export function useAuth() {
  const router = useRouter();
  const store = useAuthStore();

  const enhancedSignIn = async (credentials: SignInCredentials) => {
    await store.signIn(credentials);
    router.push("/dashboard");
  };

  const enhancedSignOut = () => {
    store.signOut();
    router.push("/auth");
  };

  const enhancedSignUp = async (credentials: SignUpCredentials) => {
    await store.signUp(credentials);
    store.setToggleRegister(false);
  };

  return {
    ...store,
    signIn: enhancedSignIn,
    signOut: enhancedSignOut,
    signUp: enhancedSignUp,
  };
}
