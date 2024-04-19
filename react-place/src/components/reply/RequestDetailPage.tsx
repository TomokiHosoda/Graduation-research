import React, { useState } from 'react';
import { useLocation } from 'react-router-dom';
import { ReplyProps } from "./Reply";
import Waveform from './WaveformReply';
import useLocationChange from "../UseLocationChange";
import "../../components/styles/Reply.css";

const getStrTime = (time: number): string => {
    let t = new Date(time);
    return (`${t.getFullYear()}年${t.getMonth() + 1}月${t.getDate()}日 ${t.getHours()}時${t.getMinutes()}分`);
}

const RequestDetailPage: React.FC = () => {
    const [audioUrl, setAudioUrl] = useState<string>('');
    const location = useLocation();
    const { send } = location.state as {send: ReplyProps};

    useLocationChange(async () => {
        try {
            const url = send.fileUrl;
    
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
        const url = send.fileUrl;
    
        // Blobを取得
        const response = await fetch(url);
        const blob = await response.blob();

        // Blobをa要素を使用してダウンロード
        const link = document.createElement('a');
        link.href = URL.createObjectURL(blob);
        link.download = 'reply-file'; // ダウンロード時のファイル名
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    }

  return (
    <div className="list">
        <div className="list-content">
            <h1 className='list-header'>{send.userId}さんからの 返信</h1>
            <hr />
            <br />
            <div className="list-body">
                <div className="box">
                    <h2 className='comment'>コメント:<p className='send-comment-header'>{send.comment}</p></h2>
                </div>
                <br />
                <div className="box-post2">
                    <Waveform audioFile={audioUrl} />
                    <br />
                    <button onClick={handledownload} className="download-buttons">ダウンロード</button>
                </div>
                <br />
                <h2>返信された日時 :{getStrTime(send.created_at)}</h2>
            </div>
        </div>
    </div>
  );
};

export default RequestDetailPage;
