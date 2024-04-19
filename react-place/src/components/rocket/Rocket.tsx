import { User, getIdTokenResult, onAuthStateChanged } from "firebase/auth";
import { deleteObject, getDownloadURL, getStorage, ref, uploadBytes } from "firebase/storage";
import React, { useEffect, useState } from "react";
import { Navigate } from "react-router-dom";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import styled from "styled-components";
import { auth } from "../../FirebaseConfig";
import { Top } from "../navigation/pages/TopBeginner";
import { TopExpert } from "../navigation/pages/TopExpert";
import { TopMypage } from "../navigation/pages/TopMypage";
import "../styles/Rocket.css";

const ContentContainer = styled.div`
    margin-left: 250px; // サイドバーの幅と合わせる
    padding: 20px; // コンテンツがサイドバーに隠れないようにする
`;

const Rocket: React.FC = () => {
  const [iconFile, setIconFile] = useState<File | null>(null);
  const [imageUrl, setImageUrl] = useState<string | null>(null);
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [topComponent, setTopComponent] = useState<React.ReactNode>(null);

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setIconFile(e.target.files[0]);
    }
  };

  const handleImageUpload = async () => {
    if (!user) {
      console.error("User not authenticated.");
      return;
    }

    // ユーザーアイコンの削除とアップロード
    if (iconFile) {
      const storage = getStorage();
      const storageRef = ref(storage, `user-icons/${user.uid}`);

      // 前のアイコンが存在する場合、削除
      try {
        const prevIconURL = user.photoURL;
        if (prevIconURL) {
          const prevIconRef = ref(storage, `user-icons/${user.uid}`);
          await deleteObject(prevIconRef);
        }
      } catch (error) {
        console.error("Error deleting previous icon:", (error as Error).message);
      }

      // 新しいアイコンのアップロード
      await uploadBytes(storageRef, iconFile);
      const downloadURL = await getDownloadURL(storageRef);

      const currentUser = auth.currentUser;
      if (currentUser) {
        try {
          toast.success('ユーザーアイコンが変更されました', {
            position: toast.POSITION.BOTTOM_RIGHT,
            autoClose: 3000, // 通知を自動で閉じるまでの時間（ミリ秒）
          });
        } catch (error) {
          console.error("Error updating profile:", (error as Error).message);

          toast.error('ユーザーアイコンが変更できませんでした', {
            position: toast.POSITION.BOTTOM_RIGHT,
            autoClose: 3000,
          });
        }
        setImageUrl(downloadURL);
      }
    }
  };

  // ログイン状態の確認
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
      setLoading(false);
    });

    return () => unsubscribe();
  },[]);

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

  return (
      <>
        {!loading && (
          <>
            {!user ? (
              <Navigate to="/" />
            ) : (
                <>
                  {topComponent}
                  <ContentContainer>
                      <div className="Rocket">
                        <div>
                          <h1>ユーザーアイコンの変更</h1>
                          <div>
                            <input
                              name="icon"
                              type="file"
                              accept={'image/*'}
                              onChange={handleImageChange}
                            />
                            {imageUrl && <img src={imageUrl} alt="Uploaded" />}
                            <ToastContainer />
                          </div>
                          <br />
                          <button onClick={handleImageUpload}>変更</button>
                        </div>
                      </div>
                  </ContentContainer>
                </>
              )}
          </>
        )}
    </>
  );
};

export default Rocket;