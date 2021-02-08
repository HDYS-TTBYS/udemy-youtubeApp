import React, { useContext } from 'react'
import { ApiContext } from "../context/apiContext";
import Modal from "react-modal";

import { makeStyles } from "@material-ui/core/styles";
import Grid from "@material-ui/core/Grid";
import Container from "@material-ui/core/Container";
import Fab from "@material-ui/core/Fab";
import AddIcon from "@material-ui/icons/Add";
import Typography from "@material-ui/core/Typography";
import TextField from "@material-ui/core/TextField";
import IconButton from "@material-ui/core/IconButton";

import { IoMdClose } from "react-icons/io";
import { RiUploadCloud2Line } from "react-icons/ri";
import { FaVideo } from "react-icons/fa";
import { BsImages } from "react-icons/bs";

import VideoList from "./VideoList";
import VideoItem from "./VideoItem";
import VideoDetail from "./VideoDetail";

const useStyles = makeStyles((theme) => ({
    container: {
        textAlign: "center",
    },
    grid: {
        justifyContent: "center",
    },
}));

const Main = () => {
    const classes = useStyles();
    Modal.setAppElement("#root");
    const {
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
    } = useContext(ApiContext);

    const customStyles = {
        content: {
            top: "30%",
            left: "43%",
            right: "auto",
            bottom: "auto",
        },
    };

    const handleEditMovie = () => {
        const fileInput = document.getElementById("mp4Input");
        fileInput?.click();
    };

    const handleEditPicture = () => {
        const fileInput = document.getElementById("imageInput");
        fileInput?.click();
    };

    return (
        <>
            <Grid container className={classes.grid}>
                <Grid item xs={11}>
                    <Grid container spacing={5}>
                        <Grid item xs={12}></Grid>

                        <Grid item xs={1}>
                            <Fab
                                color="primary"
                                aria-label="add"
                                onClick={() => setModalIsOpen(true)}
                            >
                                <AddIcon />
                            </Fab>
                        </Grid>

                        <Grid item xs={8}>
                            <VideoDetail />
                        </Grid>

                        <Grid item xs={3}>
                            <VideoList />
                        </Grid>
                    </Grid>
                </Grid>
            </Grid>

            <Modal
                isOpen={modalIsOpen}
                onRequestClose={() => setModalIsOpen(false)}
                style={customStyles}
            >
                <Typography>ムービータイトル</Typography>
                <br />
                <TextField
                    type="text"
                    onChange={(event) => setTitle(event.target.value)}
                />
                <br />
                <br />
                <Container className={classes.container}>
                    <input
                        type="file"
                        id="mp4Input"
                        hidden
                        onChange={(event) => event.target.files && setVideo(event.target.files[0])}
                    />

                    <IconButton onClick={handleEditMovie}>
                        <FaVideo className="photo" />
                        {video && video.name}
                    </IconButton>

                    <input
                        type="file"
                        id="imageInput"
                        hidden
                        onChange={(event) => event.target.files && setThumnail(event.target.files[0])}
                    />

                    <IconButton onClick={handleEditPicture}>
                        <BsImages className="photo" />
                        {thumnail && thumnail.name}
                    </IconButton>
                    <br />

                    {title && video && thumnail && (
                        <button className="btn-modal" onClick={() => newVideo()}>
                            <RiUploadCloud2Line />
                        </button>
                    )}
                    <button className="btn-modal" onClick={() => setModalIsOpen(false)}>
                        <IoMdClose />
                    </button>
                </Container>
            </Modal>
        </>
    )
}

export default Main
