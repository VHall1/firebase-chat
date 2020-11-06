import { CSSReset, ThemeProvider } from "@chakra-ui/core";
import "emoji-mart/css/emoji-mart.css";
import "./styles/global.scss";
import Default from "./pages/Default";
import firebase from "firebase/app";
import "firebase/firestore";
import "firebase/auth";
import { firebaseConfig } from "./firebaseConfig";
import React from "react";

/*
  Initialises the Firebase client.
  Consumes the configuration from firebaseConfig.ts
*/
firebase.initializeApp(firebaseConfig);

const auth = firebase.auth();
const firestore = firebase.firestore();

/*
  Create context with the respective firebase clients for Auth and Firestore
*/
export const FirebaseContext = React.createContext({
  firebase,
  auth,
  firestore,
});

const App = () => {
  return (
    <FirebaseContext.Provider value={{ firebase, auth, firestore }}>
      <ThemeProvider>
        <CSSReset />
        <Default />
      </ThemeProvider>
    </FirebaseContext.Provider>
  );
};

export default App;
