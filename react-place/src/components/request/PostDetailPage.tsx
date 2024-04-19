import React,{ useState, useCallback, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import useLocationChange from "../UseLocationChange";
import { Post } from "./Request";
import { User, onAuthStateChanged, getIdTokenResult } from "firebase/auth";
import { auth, db } from "../../FirebaseConfig";
import { getStorage, ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { collection, addDoc } from "firebase/firestore";
import { useDropzone } from "react-dropzone";
import { toast, ToastContainer } from  "react-toastify";
import Waveform from "./WaveformRequest";
import "../../components/styles/Request.css";

const getStrTime = (time: number): string => {
    let t = new Date(time);
    return (`${t.getFullYear()}年${t.getMonth() + 1}月${t.getDate()}日 ${t.getHours()}時${t.getMinutes()}分`);
}

const PostDetailPage: React.FC = () => {
    const [user, setUser] = useState<User | null>(null);
    const [file, setFile] = useState<File | null>(null);
    const [comment, setComment] = useState("");
    const [audioUrl, setAudioUrl] = useState<string>('');
    const [isFileUploadVisible, setIsFileUploadVisible] = useState(false);

    const location = useLocation();
    const { post } = location.state as {post: Post};

    useEffect(() => {
        onAuthStateChanged(auth, (currentUser) => {
            setUser(currentUser);
        });
    }, []);

    useLocationChange(async () => {
        const user = auth.currentUser; // ユーザーオブジェクトを取得
        if(user) {
            getIdTokenResult(user)
                .then((getIdTokenResult) => {
                    const customClaims = getIdTokenResult.claims;
                    if(customClaims.expert) {
                        setIsFileUploadVisible(true);
                    } else {
                        setIsFileUploadVisible(false);
                    }
                })
                .catch((error) => {
                    console.error('カスタムクレームの取得中にエラーが発生しました:', error);
                });
        }

        try {
            const url = post.fileUrl;
    
            // Blobを取得
            const response = await fetch(url);
            const blob = await response.blob();
    
            // Blobをa要素を使用してダウンロード
            const link = document.createElement('a');
            link.href = URL.createObjectURL(blob);

            setAudioUrl(URL.createObjectURL(blob));
        } catch (error) {
            console.error('ダウンロードエラー:', error);
        }
    });

    const handledownload = async() => {
        const url = post.fileUrl;
    
        // Blobを取得
        const response = await fetch(url);
        const blob = await response.blob();

        // Blobをa要素を使用してダウンロード
        const link = document.createElement('a');
        link.href = URL.createObjectURL(blob);
        link.download = 'post-file'; // ダウンロード時のファイル名
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    }

    // 送信ボタンを押したときの処理
    const handleSend = async(e: React.MouseEvent<HTMLButtonElement>) => {
        e.preventDefault();
        try{
            if(!file) {
                alert('ファイルを選択してください');
                return;    
            }

            const storage = getStorage();
            const storageRef = ref(storage, `sendmusic/${file.name}`);
            await uploadBytes(storageRef, file);
            const fileUrl = await getDownloadURL(storageRef);

          await addDoc(collection(db, "send"),{
            fileUrl: fileUrl,
            storagePath: storageRef.fullPath,
            comment:comment,
            userId: user?.uid || "",
            modalId: post?.userId || "",
            created_at:new Date().getTime()
          });

          setFile(null);
          setComment('');
          console.log('FireStoreに書き込みました');

          toast.success('ファイルを送信しました！', {
            position: toast.POSITION.BOTTOM_RIGHT,
            autoClose: 3000, // 通知を自動で閉じるまでの時間（ミリ秒）
        });

        }
        catch(error){
          console.log('FireStoreの書き込みエラー',error);
          toast.error('ファイルの送信に失敗しました。', {
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
            <div className="list-request">
                <h1 className="list-header-request">{post.userId}さんの投稿内容</h1>
                <br />
                <div className="box">
                    <div className="content">
                        <div className="title-content">
                            <h2 className="title">タイトル:<p className="title-header">{post.title}</p></h2>
                        </div>
                    </div>
                    <div className="content2">
                        <div className='instrument-content'>
                            <h2 className="instrument-post">合わせてほしい楽器:<p className="instrument-header">{post.desiredInstrument}</p></h2>
                        </div>
                        <div className='genre-content'>
                            <h2 className="genre">ジャンル:<p className='genre-header'>{post.genre}</p></h2>
                        </div>
                        <div className="bpm-content">
                            <h2 className='bpm'>BPM:<p className='bpm-header'>{post.bpm}</p></h2>
                        </div>
                        <div className='comment-content'>
                            <h2 className='comment'>コメント:<p className='comment-header'>{post.comment}</p></h2>
                        </div>
                    </div>
                </div>
                <div className="box-post2">
                    <Waveform audioFile={audioUrl} />
                    <br />
                    <button onClick={handledownload} className="download-buttons">ダウンロード</button>
                </div>
                <br />
                {isFileUploadVisible && (
                    <div className="box2">
                        <h1 className="box-title">ファイルを送信する</h1>
                        <br />
                        <div className="content3">
                            <div {...getRootProps()} className="DropzoneContainer">
                                <input 
                                    {...getInputProps()}
                                />
                                <p>編曲したファイルをここにドロップしてください。</p>
                                <br />
                                <p>（.wavまたは.mp3のみ許可されています）</p>
                                {isDragActive ? <p>ファイルをここにドロップしてください</p> : <p></p>}
                                {isDragReject && <p>対応していないファイルタイプです</p>}
                                <ToastContainer />
                            </div>
                            <br />
                            <div>
                                {file && <p className="filename">アップロードするファイル名:{file.name}</p>}
                            </div>
                            <br />
                            <div className='send-comment'>
                                <label className="send-commenttitle">コメント</label>
                                <textarea
                                    value={comment}
                                    className="Comment-form"
                                    onChange={(e) => setComment(e.target.value)}
                                />
                            </div>
                        </div>
                        <br /> 
                        <button onClick={handleSend} className="send-button">送信する</button>
                    </div>
                )}
                <br />
                <h2>投稿された日 :{getStrTime(post.created_at)}</h2>
            </div>
        </>
    );
};

export default PostDetailPage;