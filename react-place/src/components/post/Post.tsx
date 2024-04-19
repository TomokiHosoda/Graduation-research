import { User, getIdTokenResult, onAuthStateChanged } from "firebase/auth";
import { addDoc, collection } from "firebase/firestore";
import { getDownloadURL, getStorage, ref, uploadBytes } from "firebase/storage";
import React, { useCallback, useEffect, useState } from "react";
import { useDropzone } from "react-dropzone";
import { Navigate } from "react-router-dom";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import styled from "styled-components";
import { auth, db } from "../../FirebaseConfig";
import "../../components/styles/Post.css";
import { Top } from "../navigation/pages/TopBeginner";
import { TopExpert } from "../navigation/pages/TopExpert";
import { TopMypage } from "../navigation/pages/TopMypage";
import WaveformPlayer from "./WaveformPlayer";

interface PostingFormProps {}

const ContentContainer = styled.div`
    margin-left: 250px; // サイドバーの幅と合わせる
    margin-top: 50px; // ヘッダーの高さ分だけコンテンツを下げる
`;

const Post: React.FC <PostingFormProps>= () => {
    const [user, setUser] = useState<User | null>(null);
    const [title, setTitle] = useState("");
    const [desiredInstrument, setDesiredInstrument] = useState("");
    const [genre, setGenre] = useState("");
    const [bpm, setBpm] = useState("");
    const [comment, setComment] = useState("");
    const [file, setFile] = useState<File | null>(null); 
    const [loading, setLoading] = useState(true);
    const [topComponent, setTopComponent] = useState<React.ReactNode>(null);


    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
            setUser(currentUser);
            setLoading(false);
        });

        return () => unsubscribe();
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

    // 投稿ボタンを押したときの処理
    const handlePost = async(e: React.MouseEvent<HTMLButtonElement>) => {
        e.preventDefault();
        try{
            if(!file) {
                alert('ファイルを選択してください');
                return;    
            }

            const storage = getStorage();
            const storageRef = ref(storage, `music/${file.name}`);
            await uploadBytes(storageRef, file);
            const fileUrl = await getDownloadURL(storageRef);

          await addDoc(collection(db, "posts"),{
            title:title,
            desiredInstrument:desiredInstrument,
            genre:genre,
            bpm:bpm,
            comment:comment,
            fileUrl: fileUrl,
            storagePath: storageRef.fullPath,
            userId: user?.uid || "",
            created_at:new Date().getTime()
          });
          setTitle('');
          setDesiredInstrument('');
          setGenre('');
          setBpm('');
          setComment('');
          setFile(null);
          console.log('FireStoreに書き込みました');

          toast.success('投稿が完了しました！', {
            position: toast.POSITION.BOTTOM_RIGHT,
            autoClose: 3000, // 通知を自動で閉じるまでの時間（ミリ秒）
            });
        }
        catch(error){
          console.log('FireStoreの書き込みエラー',error);

          toast.error('投稿の送信に失敗しました。', {
            position: toast.POSITION.BOTTOM_RIGHT,
            autoClose: 3000,
        });
        }
    };

    // ファイルをドロップしたときの処理
    const onDrop = useCallback((acceptedFiles: File[]) => {
        const file = acceptedFiles[0];
        setFile(file);
    },[]);

    // ドロップゾーンの設定
    const {getRootProps, getInputProps, isDragActive, isDragReject} = useDropzone({
        onDrop, 
        accept: {
            'audio/wav':[],
            'audio/mp3':[],
        },
    });

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
                                <div className="Post">
                                    <h1 className="post-title">投稿</h1>
                                    <hr />
                                    <div className="box-post">
                                        <div className="Container">
                                            <div className="textarea">
                                                <label className="titlelabel">タイトル</label>
                                                <input 
                                                type="text"
                                                className="Title"
                                                placeholder="15文字以内"
                                                value={title} onChange={(e) => setTitle(e.target.value)} 
                                                maxLength={15} 
                                                style={{ marginRight: '10px'}}
                                                />
                                            </div>
                                            <div className="dropdown">
                                                <label className="Bpmlabel">BPM</label>
                                                <input
                                                type="number"
                                                min="60"
                                                max="200"
                                                className="Bpm"
                                                placeholder="60~200"
                                                value={bpm}
                                                onChange={(e) => setBpm(e.target.value)}
                                                />
                                            </div>
                                        </div>
                                        <div className="Container2">
                                            <div className="instrument">
                                                <label className="instrumentlabel">補助が必要な楽器</label>
                                                    <select value={desiredInstrument} onChange={(e) => setDesiredInstrument(e.target.value)} className="select">
                                                        <option value="">選択してください</option>
                                                        <option value="ピアノ">ピアノ</option>
                                                        <option value="シンセサイザー">シンセサイザー</option>
                                                        <option value="アコースティックギター">アコースティックギター</option>
                                                        <option value="エレキギター">エレキギター</option>
                                                        <option value="ベース">ベース</option>
                                                        <option value="シンセベース">シンセベース</option>
                                                        <option value="ドラム">ドラム</option>
                                                        <option value="ストリングス">ストリングス</option>
                                                        <option value="パッド">パッド</option>
                                                        <option value="その他">その他(楽器名をコメントに書いてください)</option>
                                                        <option value="2つ以上の楽器">2つ以上の楽器(楽器名をコメントに書いてください)</option>
                                                        <option value="2つ以上の楽器&その他">2つ以上の楽器&その他(楽器名をコメントに書いてください)</option>
                                                    </select>
                                            </div>
                                            <div className="Genre">
                                                <label className="genrelabel">作曲しているジャンル</label>
                                                    <select value={genre} onChange={(e) => setGenre(e.target.value)} className="select2">
                                                        <option value="">選択してください</option>
                                                        <option value="J-PoP">J-POP</option>
                                                        <option value="アニメ">アニメ</option>
                                                        <option value="HIP HOP">HIP HOP</option>
                                                        <option value="クラブミュージック">クラブミュージック</option>
                                                        <option value="ロック">ロック</option>
                                                        <option value="ポップス">ポップス</option>
                                                        <option value="ジャズ">ジャズ</option>
                                                        <option value="クラシック">クラシック</option>
                                                        <option value="R&B">R&B</option>
                                                        <option value="その他">その他(ジャンル名をコメントに書いてください)</option>
                                                    </select>
                                            </div>
                                            <div className="Comment">
                                                <label className="commentlabel">コメント</label>
                                                <textarea
                                                    value={comment}
                                                    className="Comment-form"
                                                    onChange={(e) => setComment(e.target.value)}
                                                />
                                            </div>
                                        </div>
                                    </div>
                                    <div className="dropcontainer">
                                        <div className="dropcontainer-title">ファイルアップロード</div>
                                        <div className="center">
                                            <div {...getRootProps()} className="DropzoneContainer">
                                                <input 
                                                    {...getInputProps()}
                                                />
                                                <p>作成したファイルをここにドロップしてください。</p>
                                                <p>（.wavまたは.mp3のみ許可されています）</p>
                                                {isDragActive ? <p>ファイルをここにドロップしてください</p> : <p></p>}
                                                {isDragReject && <p>対応していないファイルタイプです</p>}
                                                <ToastContainer />
                                            </div>
                                            <br />
                                            <div>
                                                {file && <p className="filename">アップロードするファイル名:{file.name}</p>}
                                            </div>
                                        </div>
                                    </div>
                                    <br />
                                    <div className="box-post2">
                                        <div className="Container4">
                                            <label className="waveformlabel">音源確認</label>
                                            <div>
                                                <WaveformPlayer audioFile={file} />
                                            </div>
                                        </div>
                                    </div>
                                    <button className="PostButton" onClick={handlePost}>投稿する</button>
                                </div>
                            </ContentContainer>
                        </>
                    )}
                </>
            )}
        </>
    );
};

export default Post;