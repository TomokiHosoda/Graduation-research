import React, { useEffect, useRef } from 'react';
import WaveSurfer from 'wavesurfer.js';
import TimelinePlugin from 'wavesurfer.js/dist/plugins/timeline';
import "../../components/styles/Request.css";

interface WavesurferProps {
  audioFile: string;
}

const WaveformRequest: React.FC<WavesurferProps> = ({ audioFile }) => {
  const waveformRef = useRef<WaveSurfer | null>(null);
  const [isPlaying, setIsPlaying] = React.useState(false);

    useEffect(() => {
        waveformRef.current = WaveSurfer.create({
            container: '#waveform',
            waveColor: 'violet',
            progressColor: 'purple',
            plugins: [
                //@ts-ignore
                TimelinePlugin.create({
                    container: '#wavesurfer-timeline',
                }),
            ],
        });

        waveformRef.current.load(audioFile);
        
        return () => {
            waveformRef.current?.destroy();
        };
    }, [audioFile]);

    const handlePlay = () => {
        if (waveformRef.current) {
        waveformRef.current?.playPause();
        setIsPlaying(!isPlaying);
        }
    };

    return (
        <>
            <div>
                <h2 className='check'>音源確認</h2>
                <div className='Waveform'>
                    <div id="waveform" />
                    <div id="wavesurfer-container" style={{ width: '80px', height: '50px' }} />
                    <div id="wavesurfer-timeline" style={{ width: '100%', height: '30px' }} />
                </div>
                <br />
                <button onClick={handlePlay} className='handleplay'>{isPlaying ? '停止' : '再生'}</button>
            </div>
        </>
    );
};

export default WaveformRequest;