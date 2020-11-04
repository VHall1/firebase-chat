import { CSSReset, ThemeProvider } from "@chakra-ui/core";
import firebase from "firebase/app";
import "firebase/firestore";
import "firebase/auth";
import React from "react";
import "./styles/global.scss";
import Default from "./pages/Default";
import { firebaseConfig } from "./firebaseConfig";

firebase.initializeApp(firebaseConfig);

const auth = firebase.auth();
const firestore = firebase.firestore();

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
