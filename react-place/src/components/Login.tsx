import { User, onAuthStateChanged, GoogleAuthProvider, signInWithPopup } from "firebase/auth";
import "firebase/functions";
import React, { useEffect, useState } from "react";
import { Navigate, useNavigate } from "react-router-dom";
import { auth } from "../FirebaseConfig";
import "../components/styles/App.css";
import Loginbutton from "../images/Googlebutton.png";

const Login: React.FC = () => {
    const [user, setUser] = useState<User | null>(null);

    // ログイン状態の確認
    useEffect(() => {
        onAuthStateChanged(auth, (currentUser) => {
            setUser(currentUser);
        });
    }, []);

    const navigation = useNavigate();
    const signInWithGoogle = () => {
        const provider = new GoogleAuthProvider();

        signInWithPopup(auth, provider).then(() => {
            navigation("/loading");
        }).catch((error) => {
            console.error(error);
        });
    }

    return (
        <>
            {user ? (
                    <Navigate to="/loading" />
            ) : (
                <>
                    <div className="container">
                        <h1>ログインページ</h1>
                            <div className="login-button">
                                <img src={Loginbutton} onClick={()=>signInWithGoogle()} alt="google signin" />
                            </div>
                    </div>
                </>
            )}
        </>
    );
};

export default Login;