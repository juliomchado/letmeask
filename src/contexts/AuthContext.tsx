import { createContext, ReactNode, useEffect, useState } from 'react';
import { auth, firebase } from '../services/firebase';

type userType = {
    id: string;
    name: string;
    avatar: string;
}

type AuthContextType = {
    userData: userType | undefined;
    signInWithGoogle: () => Promise<void>;
}

type AuthContextProviderProps = {
    children: ReactNode;
}

export const AuthContext = createContext({} as AuthContextType);

export const AuthContextProvider = ({ children }: AuthContextProviderProps) => {
    const [userData, setUserData] = useState<userType>();

    useEffect(() => {
        const unsubscribe = auth.onAuthStateChanged(user => {
            if (user) {
                const { displayName, photoURL, uid } = user;

                if (!displayName || !photoURL) {
                    throw new Error('Missing information from Google Account.')
                }

                setUserData({
                    id: uid,
                    name: displayName,
                    avatar: photoURL
                })
            }
        })

        return () => {
            unsubscribe();
        }
    }, []);

    async function signInWithGoogle() {
        const provider = new firebase.auth.GoogleAuthProvider();

        const result = await auth.signInWithPopup(provider);

        if (result.user) {
            const { displayName, photoURL, uid } = result.user;

            if (!displayName || !photoURL) {
                throw new Error('Missing information from Google Account.')
            }

            setUserData({
                id: uid,
                name: displayName,
                avatar: photoURL
            })
        }
    };

    return (
        <AuthContext.Provider value={{ userData, signInWithGoogle }}>
            {children}
        </AuthContext.Provider>
    )
}
