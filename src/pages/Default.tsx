import { Flex, Text, Box, IconButton } from "@chakra-ui/core";
import React, { useContext, useState } from "react";
import { FaGrin, FaPaperPlane } from "react-icons/fa";
import { useAuthState } from "react-firebase-hooks/auth";
import { FirebaseContext } from "../App";
import { useCollectionData } from "react-firebase-hooks/firestore";
import { Message } from "../components/Message";
import Header from "../components/Header";
import { Picker } from "emoji-mart";

export interface MessageProps {
  text: string;
  uid: string;
  photoURL: string;
  id: string;
}

const Default: React.FC = () => {
  const [message, setMessage] = useState("");
  const [emoji, setEmoji] = useState(false);
  const { firebase, auth, firestore } = useContext(FirebaseContext);

  const [user] = useAuthState(auth);

  const messagesRef = firestore.collection("messages");
  const query = messagesRef.orderBy("createdAt", "desc").limit(25);

  const [messages] = useCollectionData<MessageProps>(query, { idField: "id" });
  const formattedMessages = messages?.reverse();

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

  const openEmoji = () => {
    setEmoji((oldEmoji) => {
      return !oldEmoji;
    });
  };

  return (
    <Flex id="chat-wrapper">
      <Header />
      <Flex
        backgroundColor="#0D1418"
        style={{ overflowY: "scroll" }}
        direction="column"
        flex="1"
        py={2}
        px={4}
      >
        {user ? (
          formattedMessages &&
          formattedMessages.map((msg: MessageProps) => (
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
          <Flex
            className="input"
            backgroundColor="#18181B"
            color="#efeff1"
            mt="auto"
            px={4}
            py={4}
          >
            {emoji && (
              <Picker
                theme="dark"
                onSelect={(emoji) => {
                  console.log(emoji);
                  setMessage((oldMessage) => {
                    return `${oldMessage} ${(emoji as any).native}`;
                  });
                }}
              />
            )}
            <IconButton
              icon={FaGrin}
              onClick={openEmoji}
              aria-label="Emojis"
              variant="ghost"
              variantColor="#18181b"
            />
            <input
              placeholder="message..."
              name="message"
              required
              value={message}
              onChange={(e: any) => setMessage(e.target.value)}
            />
            <IconButton
              icon={FaPaperPlane}
              aria-label="Send"
              variant="ghost"
              variantColor="#18181b"
              type="submit"
            />
          </Flex>
        </form>
      )}
    </Flex>
  );
};

export default Default;
