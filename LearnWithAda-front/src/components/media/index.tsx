import { Typography } from 'antd';
import { useRef, Ref, memo } from 'react';
import { LessonMediaProps } from '../../utils/interfaces';

function Media({ type, children, endHandler, width = 'auto', src = '' }: LessonMediaProps) {
    const videoRef = useRef<HTMLVideoElement>();
    const audioRef = useRef<HTMLAudioElement>();
    if (!type) {
        return <Typography.Title level={3}>No media yet</Typography.Title>;
    } else if (type === 'audio') {
        return (
            <audio
                key={src + Math.random()}
                ref={audioRef as Ref<HTMLAudioElement>}
                autoPlay
                controls
                loop
                muted
                onEnded={endHandler}
            >
                {!src ? children : <source src={src} />}
            </audio>
        );
    }
    return (
        <video
            key={src + Math.random()}
            ref={videoRef as Ref<HTMLVideoElement>}
            autoPlay
            controls
            loop
            muted
            onEnded={endHandler}
            width={width}
        >
            {!src ? children : <source src={src} />}
        </video>
    );
}

export default memo(Media);
