import React, { useEffect, useRef } from 'react';
import WaveSurfer from 'wavesurfer.js';
import TimelinePlugin from 'wavesurfer.js/dist/plugins/timeline';
import "../../components/styles/Post.css";

interface Wavesurfer {
  audioFile: File | null;
}

const WavesurferComponent: React.FC<Wavesurfer> = ({ audioFile }) => {
  const wavesurferRef = useRef<WaveSurfer | null>(null);
  const [isPlaying, setIsPlaying] = React.useState(false);

  useEffect(() => {
    if (audioFile) {
        const wavesurferInstance = WaveSurfer.create({
            container: '#wavesurfer-container',
            waveColor: 'violet',
            progressColor: 'black',
            plugins: [
                //@ts-ignore
                TimelinePlugin.create({
                    container: '#wavesurfer-timeline',
                }),
            ],
        });

        wavesurferInstance.loadBlob(audioFile);
        wavesurferRef.current = wavesurferInstance;

        return () => {
            wavesurferInstance.destroy();
        };
        }
    }, [audioFile]);

    const handlePlay = () => {
        if (wavesurferRef.current) {
        wavesurferRef.current.playPause();
        setIsPlaying(!isPlaying);
        }
    };

    return ( 
        <>
            <div>
                <div className='Waveform'>
                    <div id="wavesurfer-container" style={{ width: '100%', height: '200px' }} />
                    <div id="wavesurfer-timeline" style={{ width: '100%', height: '30px' }} />
                </div>
                <br />
                <button onClick={handlePlay} className='handleplay'>{isPlaying ? '停止' : '再生'}</button>
            </div>
        </>
    );
};

export default WavesurferComponent;

