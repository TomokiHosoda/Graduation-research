import { User, getIdTokenResult, onAuthStateChanged } from "firebase/auth";
import { DocumentData, QuerySnapshot, collection, onSnapshot } from "firebase/firestore";
import React, { useEffect, useState } from "react";
import { Navigate, useNavigate } from "react-router-dom";
import "react-toastify/dist/ReactToastify.css";
import styled from "styled-components";
import { auth, db } from "../../FirebaseConfig";
import "../../components/styles/Request.css";
import noicon from "../../images/Noimage.png";
import { Top } from "../navigation/pages/TopBeginner";
import { TopExpert } from "../navigation/pages/TopExpert";
import { TopMypage } from "../navigation/pages/TopMypage";
import UserProfileImage from "../UserProfileImage";

export interface Post {
    title: string;
    desiredInstrument: string;
    genre: string;
    bpm: string;
    comment: string;
    created_at: number;
    fileUrl: string;
    userId: string;
    modalId: string;
    storagePath: string;
}

const getStrTime = (time: number): string => {
    let t = new Date(time);
    return (`${t.getFullYear()}年${t.getMonth() + 1}月${t.getDate()}日 ${t.getHours()}時${t.getMinutes()}分`);
}

const ContentContainer = styled.div`
    margin-top: 50px; // ヘッダーの高さ分だけコンテンツを下げる
    margin-left: 250px; // サイドバーの幅と合わせる
`;

const Request: React.FC = () => {
    const [user, setUser] = useState<User | null>(null);
    const [posts, setPosts] = useState<Post[]>([]);
    const [loading, setLoading] = useState(true);
    const [topComponent, setTopComponent] = useState<React.ReactNode>(null);

    useEffect(() => {
        const unsubscribe = onSnapshot(collection(db, "posts"), (snapshot: QuerySnapshot<DocumentData>) => {
            const postArray: Post[] = snapshot.docs.map((post) => post.data() as Post);
            postArray.sort((a, b) => b.created_at - a.created_at);
            setPosts(postArray);
        });
        const unsub = onAuthStateChanged(auth, (currentUser) => {
            setUser(currentUser);
            setLoading(false);
        });

        return () => {
            unsubscribe();
            unsub();
        };
    }, []);

    useEffect (() => {
        const fetchData = async () => {
            const user = auth.currentUser; // ユーザーオブジェクトを取得
            if (user) {
                getIdTokenResult(user)
                    .then((idTokenResult) => {
                        const customClaims = idTokenResult.claims;
            
                        // カスタムクレームを確認
                        if (customClaims.expert) {
                            setTopComponent(<TopExpert />);
                        } else if (customClaims.beginner) {
                            setTopComponent(<Top />);
                        } else {
                            setTopComponent(<TopMypage />);
                        }
                    })
                    .catch((error) => {
                        console.error('カスタムクレームの取得中にエラーが発生しました:', error);
                    });
            } else {
                console.error('ユーザーがログインしていません');
            }
        };

        if(!loading){
            fetchData();
        }
    },[loading]);

    const navigate = useNavigate();
    const handlePostClick = async (post: Post) => {
        navigate(`/Request/postId`, { state: { post: post } });
    };
    
    return (
        <>
            {!loading && (
                <>
                    {!user ? (
                        <Navigate to={`/`} />
                    ) : (
                        <>
                            {topComponent}
                            <ContentContainer>
                                <div className="Request">
                                    <h1 className="request-title">依頼一覧</h1>
                                    <hr />
                                    {posts.map((post, index) => (
                                        <div className="post-block" key={index} onClick={() => handlePostClick(post)}>
                                            <div className="user-info">
                                                {post.userId ? <UserProfileImage userId ={post.userId} /> : <img src={noicon} alt="noimage" />}
                                                <p>{post.title}</p>
                                            </div>
                                            <div className="post" key={index}>
                                                <div className="created_at">投稿日:{getStrTime(post.created_at)}</div>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </ContentContainer>
                        </>
                    )}
                </>
            )}
        </>
    );
};

export default Request;