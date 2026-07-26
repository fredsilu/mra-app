//src/contexts/AuthContext.tsx

import { User, onAuthStateChanged } from 'firebase/auth';
import {
    ReactNode,
    createContext,
    useContext,
    useEffect,
    useMemo,
    useState,
} from 'react';
import { auth } from '@/config/firebase';
import {
    loginWithEmail as loginWithEmailService,
    logout as logoutService,
} from '@/features/auth/auth.service';
import { getUserProfile } from '@/features/users/user.service';
import { UserProfile } from '@/features/users/user.types';

type AuthContextValue = {
    user: User | null;
    profile: UserProfile | null;
    isLoading: boolean;
    isAuthenticated: boolean;
    hasAccess: boolean;
    login: (email: string, password: string) => Promise<void>;
    logout: () => Promise<void>;
};

const AuthContext = createContext<AuthContextValue | undefined>(undefined);

type AuthProviderProps = {
    children: ReactNode;
};

export function AuthProvider({ children }: AuthProviderProps) {
    const [user, setUser] = useState<User | null>(null);
    const [profile, setProfile] = useState<UserProfile | null>(null);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const unsubscribe = onAuthStateChanged(
            auth,
            async (firebaseUser) => {
                setIsLoading(true);
                setUser(firebaseUser);

                if (!firebaseUser) {
                    setProfile(null);
                    setIsLoading(false);
                    return;
                }

                try {
                    const userProfile = await getUserProfile(firebaseUser.uid);
                    setProfile(userProfile);
                } catch (error) {
                    console.error(
                        'Erreur lors du chargement du profil utilisateur :',
                        error
                    );

                    setProfile(null);
                } finally {
                    setIsLoading(false);
                }
            },
            (error) => {
                console.error(
                    'Erreur lors de la vérification de la session Firebase :',
                    error
                );

                setUser(null);
                setProfile(null);
                setIsLoading(false);
            }
        );

        return unsubscribe;
    }, []);

    async function login(email: string, password: string) {
        await loginWithEmailService(email, password);
    }

    async function logout() {
        await logoutService();
    }

    const value = useMemo<AuthContextValue>(
        () => ({
            user,
            profile,
            isLoading,
            isAuthenticated: user !== null,
            hasAccess: user !== null && profile?.isActive === true,
            login,
            logout,
        }),
        [user, profile, isLoading]
    );

    return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
    const context = useContext(AuthContext);

    if (!context) {
        throw new Error(
            'useAuth doit être utilisé à l’intérieur de AuthProvider.'
        );
    }

    return context;
}