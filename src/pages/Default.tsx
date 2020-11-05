import { Flex, Text, Box, IconButton, Input } from "@chakra-ui/core";
import React, { useContext, useState } from "react";
import { FiSend } from "react-icons/fi";
import { useAuthState } from "react-firebase-hooks/auth";
import { FirebaseContext } from "../App";
import { useCollectionData } from "react-firebase-hooks/firestore";
import { Message } from "../components/Message";
import Header from "../components/Header";

export interface MessageProps {
  text: string;
  uid: string;
  photoURL: string;
  id: string;
}

const Default: React.FC = () => {
  const [message, setMessage] = useState("");
  const { firebase, auth, firestore } = useContext(FirebaseContext);

  const [user] = useAuthState(auth);

  const messagesRef = firestore.collection("messages");
  const query = messagesRef.orderBy("createdAt").limit(25);

  const [messages] = useCollectionData<MessageProps>(query, { idField: "id" });

  const submitMessage = async (e: any) => {
    e.preventDefault();
    if (auth.currentUser === null) return;

    const { uid, photoURL } = auth.currentUser;

    await messagesRef.add({
      text: message,
      createdAt: firebase.firestore.FieldValue.serverTimestamp(),
      uid,
      photoURL,
    });

    setMessage("");
  };

  return (
    <Flex id="chat-wrapper">
      <Header />
      {/* Body */}
      <Flex direction="column" flex="1" py={2} px={4}>
        {user ? (
          messages &&
          messages.map((msg: MessageProps) => (
            <Message
              key={msg.id}
              text={msg.text}
              uid={msg.uid}
              photoURL={msg.photoURL}
            />
          ))
        ) : (
          <Box m="auto" color="#efeff1">
            <Text fontWeight="600" textAlign="center">
              Welcome to RandomChat
              <br />
              Please log-in to continue
            </Text>
          </Box>
        )}
      </Flex>
      {user && (
        <form onSubmit={submitMessage}>
          <Flex mt="auto" px={4} mb={4}>
            <Input
              placeholder="message..."
              style={{
                borderTopRightRadius: 0,
                borderBottomRightRadius: 0,
              }}
              name="message"
              isRequired
              value={message}
              onChange={(e: any) => setMessage(e.target.value)}
            />
            <IconButton
              backgroundColor="#fff"
              icon={FiSend}
              aria-label="Send"
              style={{ borderTopLeftRadius: 0, borderBottomLeftRadius: 0 }}
              type="submit"
            />
          </Flex>
        </form>
      )}
    </Flex>
  );
};

export default Default;
