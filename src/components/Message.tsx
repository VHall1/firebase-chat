import React, { useContext } from "react";
import { FirebaseContext } from "../App";
import { Text } from "@chakra-ui/core";

interface MessageProps {
  text: string;
  uid: string;
  photoURL: string;
}

export const Message: React.FC<MessageProps> = ({ text, uid, photoURL }) => {
  const { auth } = useContext(FirebaseContext);

  const messageClass = uid === auth.currentUser!.uid ? "sent" : "received";

  return (
    <div className={`message ${messageClass}`}>
      <img
        src={
          photoURL ||
          "https://i.pinimg.com/originals/ba/9f/45/ba9f45ae9b0dc641ff49408d4c56a66d.jpg"
        }
      />
      <Text>{text}</Text>
    </div>
  );
};
