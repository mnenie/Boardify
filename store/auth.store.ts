import type { User } from 'firebase/auth';
import useFirebaseAuth from '~/composables/useFirebaseAuth';
import { Error } from '~/types/error.enum';
import type { IUser } from '~/types/user.interface';

export const useAuthStore = defineStore('auth', () => {
  const user = ref({} as IUser);
  const router = useRouter();
  const token = useCookie('token');
  const error = ref('');
  const isLoading = ref(false)

  const {
    onFirebaseRegistration,
    onFirebaseLogout,
    onFirebaseLogin,
    onGitHubLogin,
    getCurrentUser
  } = useFirebaseAuth();

  const login = async (email: string, password: string) => {
    try {
      isLoading.value = true
      const response = await onFirebaseLogin(email, password);
      //@ts-ignore
      token.value = response?.user.accessToken;
      if (token.value) {
        await router.push(HOME_ROUTE);
      }
      isLoading.value = false;
    } catch (err: any) {
      switch (err.message) {
        case Error.INVALID_CREDS:
          error.value = 'Account was not found, please try again';
          break;
      }
      isLoading.value = false
    }
  };
  const registration = async (email: string, password: string) => {
    try {
      isLoading.value = true
      const response = await onFirebaseRegistration(email, password);
      user.value = { email, id: response?.user.uid! };
      //@ts-ignore
      token.value = response?.user.accessToken;
      if (token.value) {
        await router.push(HOME_ROUTE);
      }
      isLoading.value = false;
    } catch (err: any) {
      switch (err.message) {
        case Error.EMAIL_EXISTS:
          error.value = 'Email already exists';
          break;
      }
      isLoading.value = false
    }
  };

  const logout = async () => {
    try {
      await onFirebaseLogout();
      user.value = {} as IUser;
      token.value = '';
      sessionStorage.removeItem('token');
      const uid = useCookie('uid');
      uid.value = null;
      await router.push(LOGIN_ROUTE);
    } catch (e) {
      console.log(e);
    }
  };

  const gitHubSession = async () => {
    try {
      isLoading.value = true
      const response = await onGitHubLogin();
      user.value = {
        id: response?.user.uid!,
        email: response?.user.email!,
        name: response?.user.displayName!,
        photoUrl: response?.user.photoURL!
      };
      //@ts-ignore
      token.value = response?.user.accessToken;
      if (token.value) {
        await router.push(HOME_ROUTE);
      }
      isLoading.value = false
    } catch (err) {
      isLoading.value = false
      console.log(err);
    }
  };

  const getCurrentSessionUser = async () => {
    try {
      const response = (await getCurrentUser()) as User;
      user.value = {
        id: response.uid,
        email: response.email!,
        name: response.displayName!,
        photoUrl: response.photoURL!
      };
    } catch (err) {
      console.log(err);
    }
  };

  return {
    user,
    isLoading,
    error,
    registration,
    logout,
    login,
    gitHubSession,
    getCurrentSessionUser
  };
});
