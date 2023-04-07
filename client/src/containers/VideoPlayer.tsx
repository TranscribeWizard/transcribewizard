import React, { useRef, useState, useEffect } from 'react';

const VideoPlayer = ({ src, subtitles }:{
  src:string,
  subtitles:any
}) => {
  const videoRef = useRef(null);
  const [isPlaying, setIsPlaying] = useState(false);

 useEffect(() => {
    const mediasource = new MediaSource();
   
    let sourceBuffer ;
  
  
   
 }, [])
 
  return (
   <div>
    Player
   </div>
  );
};

export default VideoPlayer;
