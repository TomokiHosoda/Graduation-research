import { User, onAuthStateChanged, getIdTokenResult } from "firebase/auth";
import React, { useEffect, useState } from "react";
import { Navigate } from "react-router-dom";
import useLocationChange from "./UseLocationChange";
import { auth } from "../FirebaseConfig";
const Loading: React.FC = () => {
    const [user, setUser] = useState<User | null>(null);

    const [loading, setLoading] = useState(true);

    useEffect(() => {
        onAuthStateChanged(auth, (currentUser) => {
            setUser(currentUser);
            setLoading(false);
        });
    }, []);

    useLocationChange(() => {
        const user = auth.currentUser; // ユーザーオブジェクトを取得
    
        if (user) {
        // カスタムクレームを取得
            getIdTokenResult(user)
                .then((idTokenResult) => {
                const customClaims = idTokenResult.claims;
    
                // カスタムクレームを確認
                if (customClaims.expert) {
                        window.location.href ='/request';
                } else if (customClaims.beginner) {
                        window.location.href ='/post';
                } else {
                        window.location.href ='/selection';
                }
            })
            .catch((error) => {
            console.error('カスタムクレームの取得中にエラーが発生しました:', error);
            });
        } else {
        console.error('ユーザーがログインしていません');
        }
    });
    return (
        <>
            {!loading && (
                <>
                    {!user ? (
                        <Navigate to={`/`} />
                    ) : (
                        <>
                            <h2>カスタムクレームを確認しています</h2>
                            <h2>しばらくお待ち下さい</h2>
                        </>
                    )}
                </>
            )}
        </>
    );
}

export default Loading;