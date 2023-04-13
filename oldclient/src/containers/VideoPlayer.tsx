"use client"

import React, { useRef, useEffect } from 'react';
import videojs, { VideoJsPlayerOptions } from 'video.js';

interface VideoPlayerProps {
  mediaUrl:string,
  subtitlesUrl:string,
  mediaType:string,
}

const VideoPlayer: React.FC<VideoPlayerProps> = ({ mediaUrl, subtitlesUrl,mediaType }) => {
  const videoRef = useRef(null);

  useEffect(() => {
    const playerOptions: VideoJsPlayerOptions = {
      autoplay: false,
      controls: true,
      sources: [
        {
          src: mediaUrl,
          type: mediaType,
        },
      ],
      textTrackSettings: {
        'backgroundColor': 'white',
        'backgroundOpacity': 0.7,
        'edgeStyle': 'dropshadow',
        'fontFamily': 'Arial',
        'fontPercent': 100,
        'windowColor': 'yellow',
        'windowOpacity': 0.8,
      },
      tracks: [
        {
          kind: 'subtitles',
          src: subtitlesUrl,
          srclang: 'en',
          label: 'English',
          default: true,
        },
      ],
    };
    const player = videojs(videoRef.current, playerOptions);
    return () => {
      player.dispose();
    };
  }, [subtitlesUrl, mediaUrl, mediaType]);

  return (
    <div data-vjs-player>
      <video ref={videoRef} className="video-js vjs-big-play-centered" />
    </div>
  );
};

export default VideoPlayer;
