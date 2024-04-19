import { User, getIdTokenResult, onAuthStateChanged } from "firebase/auth";
import { DocumentData, QuerySnapshot, collection, onSnapshot } from "firebase/firestore";
import React, { useEffect, useState } from "react";
import { Navigate, useNavigate } from "react-router-dom";
import styled from "styled-components";
import { auth, db } from "../../FirebaseConfig";
import "../../components/styles/Reply.css";
import noicon from "../../images/Noimage.png";
import { Top } from "../navigation/pages/TopBeginner";
import { TopExpert } from "../navigation/pages/TopExpert";
import { TopMypage } from "../navigation/pages/TopMypage";
import UserReplyImage from "../UserProfileImage";

export interface ReplyProps {
    userId: string;
    fileUrl: string;
    storagePath: string;
    comment: string;
    created_at: number;
    modalId: string;
}

const ContentContainer = styled.div`
    margin-top: 50px; // ヘッダーの高さ分だけコンテンツを下げる
    margin-left: 250px; // サイドバーの幅と合わせる
`;

const getStrTime = (time: number): string => {
    let t = new Date(time);
    return (`${t.getFullYear()}/${t.getMonth() + 1}/${t.getDate()} ${t.getHours()}:${t.getMinutes()}:${t.getSeconds()}`);
}

const Reply: React.FC = () => {
    const [user, setUser] = useState<User | null>(null);
    const [replies, setreplies] = useState<ReplyProps[]>([]);
    const [loading, setLoading] = useState(true);
    const [topComponent, setTopComponent] = useState<React.ReactNode>(null);

    useEffect(() => {
        const unsubscribe = onSnapshot(collection(db, "send"), (snapshot: QuerySnapshot<DocumentData>) => {
            const replyArray: ReplyProps[] = snapshot.docs.map((reply) => reply.data() as ReplyProps);
            replyArray.sort((a, b) => b.created_at - a.created_at);
            setreplies(replyArray);
        });

      const unsub = onAuthStateChanged(auth, (currentUser) => {
            setUser(currentUser);
            setLoading(false);
        });

        return () => {
            unsubscribe();
            unsub();
        }
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
    const handleReplyClick = (reply: ReplyProps) => {
        if(user?.uid === reply.modalId) {
            navigate(`/Reply/replyId`, { state: { send: reply } });
        }
    }


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
                                <div className="Reply">
                                    <h1 className="reply-title">返信一覧</h1>
                                    <hr />
                                    {replies.map((reply, index) => (
                                        user?.uid === reply.modalId && (
                                            <div className="reply-block" key={index} onClick={() => handleReplyClick(reply)}>
                                                <div className="user-info">
                                                    {reply.userId ? <UserReplyImage userId ={reply.userId} /> : <img src={noicon} alt="noimage" />}
                                                    <p>{reply.userId}さんからの返信</p>
                                                </div>
                                                <div className="reply" key={index}>
                                                    <div className="created_at">返信された日時:{getStrTime(reply.created_at)}</div>
                                                </div>
                                            </div>
                                        )
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

export default Reply;