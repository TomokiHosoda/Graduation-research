import { User, onAuthStateChanged, signOut } from "firebase/auth";
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { auth } from "../../../FirebaseConfig";
//import "../components/styles/App.css";
import { SidebarMypageData } from "./SidebarMypageData";
import SidebarIcon from "./SidebarIcon";

const SidebarMypage: React.FC = () => {
    const [user, setUser] = useState<User | null>(null);

    // ログイン状態の確認
    useEffect(() => {
        onAuthStateChanged(auth, (currentUser) => {
            setUser(currentUser);
        });
    }, []);

    if (user) {
        console.log(`ユーザのメールアドレスは: ${user.email}`);
    }

    const navigate = useNavigate();

    // ログアウト処理
    const logout = async () => {
        await signOut(auth);
        navigate("/");
    };

    return (
        <div className="sidebar">
            <SidebarIcon />
            <ul className="sidebarList">
                {SidebarMypageData.map((value, key) => {
                    return (
                        <li
                            key={key}
                            id={window.location.pathname === value.link ? "active" : ""}
                            className="row"
                            onClick={() => {
                                window.location.pathname = value.link;
                            }}
                        >
                            <div id="icon">{value.icon}</div>
                            <div id="title">{value.title}</div>
                        </li>
                    );
                })}
            </ul>
            <div className="logout">
                <button onClick={logout}>ログアウト</button>
            </div>
        </div>
    );
};

export default SidebarMypage;