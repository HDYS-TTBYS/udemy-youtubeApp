import React, { useReducer } from 'react';
import { withCookies } from "react-cookie";
import axios from "axios";
import Avatar from '@material-ui/core/Avatar';
import Button from '@material-ui/core/Button';
import CssBaseline from '@material-ui/core/CssBaseline';
import TextField from '@material-ui/core/TextField';
import LockOutlinedIcon from '@material-ui/icons/LockOutlined';
import Typography from '@material-ui/core/Typography';
import { makeStyles } from '@material-ui/core/styles';
import Container from '@material-ui/core/Container';
import { LoginActions } from "./actionTypes";
import { CircularProgress } from '@material-ui/core';

const apiBaseURL = "http://localhost:8000"


const useStyles = makeStyles((theme) => ({
    paper: {
        marginTop: theme.spacing(8),
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
    },
    avatar: {
        margin: theme.spacing(1),
        backgroundColor: theme.palette.secondary.main,
    },
    form: {
        width: '100%', // Fix IE 11 issue.
        marginTop: theme.spacing(1),
    },
    submit: {
        margin: theme.spacing(3, 0, 2),
    },
    span: {
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        color: "teal",
    },
    spanError: {
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        color: "fuchsia",
        marginTop: 10
        ,
    }
}));

const initialState = {
    isLoading: false,
    isLoginView: true,
    errorMessage: "",
    credentialsLog: {
        email: "",
        password: "",
    },
};

const loginReducer = (state: typeof initialState, action: LoginActions): typeof initialState => {
    switch (action.type) {
        case "START_FETCH": {
            return {
                ...state,
                isLoading: true,
            }
        }
        case "FETCH_SUCCESS": {
            return {
                ...state,
                isLoading: false,
            }
        }
        case "ERROR_CATCHED": {
            return {
                ...state,
                errorMessage: "メールアドレスまたはパスワードが正しくありません",
                isLoading: false,
            }
        }
        case "INPUT_EDIT": {
            return {
                ...state,
                [action.inputName]: action.payload,
                errorMessage: "",
            }
        }
        case "TOGGLE_MODE": {
            return {
                ...state,
                isLoginView: !state.isLoginView,
            }
        }
        default:
            return state;
    }
}


const Login = (props: any) => {
    const classes = useStyles();
    const [state, dispatch] = useReducer(loginReducer, initialState);

    const inputChangedLog = () => (event: React.ChangeEvent<HTMLInputElement>) => {
        const cred: any = state.credentialsLog;
        cred[event.target.name] = event.target.value; //[email] or [password]
        dispatch({
            type: "INPUT_EDIT",
            inputName: "state.credentialLog",
            payload: cred,
        })
    }

    const login = async (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        if (state.isLoginView) {
            //login
            try {
                dispatch({ type: "START_FETCH" })
                const res = await axios.post(`${apiBaseURL}/authen/jwt/create/`, state.credentialsLog, {
                    headers: { "Content-Type": "application/json" },
                })
                props.cookies.set("jwt-token", res.data.access);
                res.data.access ? window.location.href = "/youtube" : window.location.href = "/"
                dispatch({ type: "FETCH_SUCCESS" })
            } catch {
                dispatch({ type: "ERROR_CATCHED" })
                dispatch({ type: "FETCH_SUCCESS" })
            }
        } else {
            //register
            try {
                dispatch({ type: "START_FETCH" })
                //user作成
                await axios.post(`${apiBaseURL}/api/create/`, state.credentialsLog, {
                    headers: { "Content-Type": "application/json" },
                });
                //login
                const res = await axios.post(`${apiBaseURL}/authen/jwt/create/`, state.credentialsLog, {
                    headers: { "Content-Type": "application/json" },
                })
                props.cookies.set("jwt-token", res.data.access);
                res.data.access ? window.location.href = "/youtube" : window.location.href = "/"
                dispatch({ type: "FETCH_SUCCESS" })
            } catch {
                dispatch({ type: "ERROR_CATCHED" })
                dispatch({ type: "FETCH_SUCCESS" })
            }
        }
    }

    const toggleView = () => {
        dispatch({ type: "TOGGLE_MODE" })
    }

    return (
        <Container component="main" maxWidth="xs">
            <CssBaseline />
            <form className={classes.form} noValidate onSubmit={login}>
                <div className={classes.paper}>
                    {state.isLoading && <CircularProgress />}
                    <Avatar className={classes.avatar}>
                        <LockOutlinedIcon />
                    </Avatar>
                    <Typography component="h1" variant="h5">
                        {state.isLoginView ? "ログイン" : "アカウント作成"}
                    </Typography>

                    <TextField
                        variant="outlined"
                        margin="normal"
                        required
                        fullWidth
                        id="email"
                        label="Email Address"
                        name="email"
                        value={state.credentialsLog.email}
                        onChange={inputChangedLog()}
                        autoFocus
                    />

                    <TextField
                        variant="outlined"
                        margin="normal"
                        required
                        fullWidth
                        name="password"
                        value={state.credentialsLog.password}
                        onChange={inputChangedLog()}
                        label="Password"
                        type="password"
                    />

                    <span className={classes.spanError}>{state.errorMessage}</span>

                    {state.isLoginView ?
                        <Button
                            type="submit"
                            fullWidth
                            variant="contained"
                            color="primary"
                            disabled={!state.credentialsLog.password || !state.credentialsLog.email}
                            className={classes.submit}
                        >
                            ログイン
                            </Button>

                        :
                        <Button
                            type="submit"
                            fullWidth
                            variant="contained"
                            color="primary"
                            disabled={!state.credentialsLog.password || !state.credentialsLog.email}
                            className={classes.submit}
                        >
                            アカウントを作成
                        </Button>
                    }


                    <span onClick={() => toggleView()} className={classes.span}>
                        {state.isLoginView ? "アカウントを作成へ" : "ログインへ"}
                    </span>

                </div>
            </form>
        </Container >
    )
}

export default withCookies(Login)
