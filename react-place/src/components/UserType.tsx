import { User, onAuthStateChanged } from "firebase/auth";
import React, { useEffect, useState } from "react";
import { Navigate, useNavigate } from "react-router-dom";
import { auth, functions } from "../FirebaseConfig";
import { httpsCallable } from "@firebase/functions";
import "../components/styles/App.css";
import "../components/styles/Navigation.css";
import Beginnerbutton from "../images/beginnerbutton.png";
import expertbutton from "../images/expertbutton.png";

const UserType: React.FC = () => {
    const [user, setUser] = useState<User | null>(null);

    const [loading, setLoading] = useState(true);

    const navigation = useNavigate();

    useEffect(() => {
        onAuthStateChanged(auth, (currentUser) => {
            setUser(currentUser);
            setLoading(false);
        });
    });

    const setExpertClaim = httpsCallable(functions, 'setExpertClaims');

    const handleSetExpertClaim = (userType:string) => {
        setExpertClaim({userType})
        .then(() => {
            console.log(`ユーザータイプを ${userType} に設定しました`)
            navigation("/reply");
        })
        .catch((error) => {
            console.error(error);
        })
    };

    const setBeginnerClaim = httpsCallable(functions, 'setBeginnerClaims');

    const handleSetBeginnerClaim = (userType:string) => {
        setBeginnerClaim({userType})
        .then(() => {
            console.log(`ユーザータイプを ${userType} に設定しました}`)
            navigation("/post");
        }).catch((error) => {
            console.error(error);
        });
    };

    return (
        <>
            {!loading && (
                <>
                    {!user ? (
                        <Navigate to={`/`} />
                    ) : (
                        <>
                            <div className="Mypage">
                                <h1>Help With Music Production</h1>
                                <h2>ようこそ、{user.email}さん！</h2>
                                <br />
                                <h2>ユーザタイプを選択してください</h2>
                                <h3>※一度ユーザタイプを選択すると後に変更できません</h3>
                                <br />
                                <div>
                                    <img
                                        src={expertbutton}
                                        className="expertimg"
                                        alt="ユーザ選択(熟練者)"
                                        onClick={() => handleSetExpertClaim("expert")}
                                        style={{ cursor: "pointer" }}
                                    />
                                    <img
                                        src={Beginnerbutton}
                                        className="beginnerimg"
                                        alt="ユーザ選択(初心者)"
                                        onClick={() => handleSetBeginnerClaim("beginner")}
                                        style={{ cursor: "pointer" }}
                                    />
                                </div>
                            </div>
                        </>
                    )}
                </>
            )}
        </>
    );
};

export default UserType;