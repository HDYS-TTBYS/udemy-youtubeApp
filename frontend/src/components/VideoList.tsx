import React, { useContext } from 'react'
import { ApiContext, Video } from "../context/apiContext";
import Grid from "@material-ui/core/Grid";
import VideoItem from "./VideoItem";

const VideoList = () => {
    const { videos } = useContext(ApiContext);
    const listOfVideos = videos.map((video: Video) => (
        <VideoItem key={video.id} video={video} />
    ));

    return (
        <Grid container spacing={5}>
            <div className="video-list">{listOfVideos}</div>
        </Grid>
    )
}

export default VideoList
