import React, { createContext, useState, useEffect } from "react";
import { withCookies } from "react-cookie";
import axios from "axios";

const apiBaseURL = "http://localhost:8000"

export const ApiContext = createContext<any>(null);


export interface Video {
    id?: string
    title?: string
    video?: string
    thumnail?: string
    like?: number
    dislike?: number
}

const ApiContextProvider = (props: any) => {
    const token = props.cookies.get("jwt-token");
    const [videos, setVideos] = useState<Video[]>([]);
    const [title, setTitle] = useState("");
    const [video, setVideo] = useState<File | null>(null);
    const [thumnail, setThumnail] = useState<File | null>(null);
    const [selectedVideo, setSelectedVideo] = useState<Video | null>(null);
    const [modalIsOpen, setModalIsOpen] = useState(false);

    useEffect(() => {
        const getVideos = async () => {
            try {
                const res = await axios.get(
                    `${apiBaseURL}/api/videos/`,
                    {
                        headers: {
                            Authorization: `JWT ${token}`,
                        },
                    }
                );
                setVideos(res.data);
            } catch {
                console.log("error");
                props.cookies.remove("jwt-token");
                window.location.href = "/";
            }
        };
        getVideos();
    }, [token]);

    const newVideo = async () => {
        const uploadData = new FormData();
        uploadData.append("title", title);
        uploadData.append("video", video!, video?.name);
        uploadData.append("thumnail", thumnail!, thumnail?.name);
        try {
            const res = await axios.post(
                `${apiBaseURL}/api/videos/`,
                uploadData,
                {
                    headers: {
                        "Content-Type": "application/json",
                        Authorization: `JWT ${token}`,
                    },
                }
            );
            setVideos([...videos, res.data]);
            setModalIsOpen(false);
            setTitle("");
            setVideo(null);
            setThumnail(null);
        } catch {
            console.log("error");
            props.cookies.remove("jwt-token");
            window.location.href = "/";
        }
    };

    const deleteVideo = async () => {
        try {
            await axios.delete(
                `${apiBaseURL}/api/videos/${selectedVideo?.id}/`,
                {
                    headers: {
                        "Content-Type": "application/json",
                        Authorization: `JWT ${token}`,
                    },
                }
            );
            setSelectedVideo(null);
            setVideos(videos.filter((item) => item.id !== selectedVideo?.id));
        } catch {
            console.log("error");
            props.cookies.remove("jwt-token");
            window.location.href = "/";
        }
    };

    const incrementLike = async () => {
        try {
            const uploadData = new FormData();
            const like = (selectedVideo?.like! + 1).toString();
            uploadData.append("like", like);

            const res = await axios.patch(
                `${apiBaseURL}/api/videos/${selectedVideo?.id}/`,
                uploadData,
                {
                    headers: {
                        "Content-Type": "application/json",
                        Authorization: `JWT ${token}`,
                    },
                }
            );
            setSelectedVideo({ ...selectedVideo, like: res.data.like });
            setVideos(
                videos.map((item) => (item.id === selectedVideo?.id ? res.data : item))
            );
        } catch {
            console.log("error");
            props.cookies.remove("jwt-token");
            window.location.href = "/";
        }
    };

    const incrementDislike = async () => {
        try {
            const uploadData = new FormData();
            const dislike = (selectedVideo?.dislike! + 1).toString();
            uploadData.append("dislike", dislike);
            const res = await axios.patch(
                `${apiBaseURL}/api/videos/${selectedVideo?.id}/`,
                uploadData,
                {
                    headers: {
                        "Content-Type": "application/json",
                        Authorization: `JWT ${token}`,
                    },
                }
            );
            setSelectedVideo({ ...selectedVideo, dislike: res.data.dislike });
            setVideos(
                videos.map((item) => (item.id === selectedVideo?.id ? res.data : item))
            );
        } catch {
            console.log("error");
            props.cookies.remove("jwt-token");
            window.location.href = "/";
        }
    };

    return (
        <ApiContext.Provider
            value={{
                videos,
                title,
                setTitle,
                video,
                setVideo,
                thumnail,
                setThumnail,
                selectedVideo,
                setSelectedVideo,
                modalIsOpen,
                setModalIsOpen,
                newVideo,
                deleteVideo,
                incrementLike,
                incrementDislike,
            }}
        >
            {props.children}
        </ApiContext.Provider>
    );
};

export default withCookies(ApiContextProvider);
