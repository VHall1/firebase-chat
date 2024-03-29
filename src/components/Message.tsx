import React, { useContext } from "react";
import { FirebaseContext } from "../App";
import { Flex, Text } from "@chakra-ui/core";

interface MessageProps {
  text: string;
  uid: string;
  photoURL: string;
  displayName: string;
}

export const Message: React.FC<MessageProps> = ({
  text,
  uid,
  photoURL,
  displayName,
}) => {
  const { auth } = useContext(FirebaseContext);

  const messageClass = uid === auth.currentUser!.uid ? "sent" : "received";

  return (
    <div className={`message ${messageClass}`}>
      <img
        alt="Profile"
        src={
          photoURL ||
          "https://i.pinimg.com/originals/ba/9f/45/ba9f45ae9b0dc641ff49408d4c56a66d.jpg"
        }
      />
      <Flex className="inner-message" direction="column">
        <Text fontSize="xs" className="username">
          {displayName}
        </Text>
        <Text>{text}</Text>
      </Flex>
    </div>
  );
};
