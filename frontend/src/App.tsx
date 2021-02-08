import React from 'react';
import './App.css';

import indigo from "@material-ui/core/colors/indigo";
import createMuiTheme from "@material-ui/core/styles/createMuiTheme";
import { MuiThemeProvider, ThemeProvider as MuThemeProvider } from "@material-ui/core/styles";
import ApiContextProvider from './context/apiContext';
import NavBar from './components/NavBar';
import Main from './components/Main';

const theme = createMuiTheme({
  palette: {
    primary: indigo,
    secondary: {
      main: "#f44336",
    },
  },
  typography: {
    fontFamily: "Comic Neue",
  },
});


function App() {
  return (
    <ApiContextProvider>
      <MuiThemeProvider theme={theme}>

        <NavBar />
        <Main />

      </MuiThemeProvider>
    </ApiContextProvider>
  );
}

export default App;
