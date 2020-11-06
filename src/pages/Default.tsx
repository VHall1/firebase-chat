import { Flex, Text, Box, useToast } from "@chakra-ui/core";
import React, { useContext, useEffect } from "react";
import { useAuthState } from "react-firebase-hooks/auth";
import { FirebaseContext } from "../App";
import { useCollectionData } from "react-firebase-hooks/firestore";
import { Message } from "../components/Message";
import Header from "../components/Header";
import { InputBar } from "../components/InputBar";

export interface MessageProps {
  text: string;
  uid: string;
  photoURL: string;
  id: string;
}

const Default: React.FC = () => {
  const toast = useToast();
  const { auth, firestore } = useContext(FirebaseContext);

  const [user] = useAuthState(auth);
  const messagesRef = firestore.collection("messages");
  const query = messagesRef.orderBy("createdAt", "desc").limit(25);
  const [messages] = useCollectionData<MessageProps>(query, { idField: "id" });

  useEffect(() => {
    const chatBox = document.querySelector(".messages-wrapper");

    if (chatBox) {
      toast({
        position: "top",
        render: () => (
          <Box m={3} color="white" p={3} bg="blue.500" borderRadius="56px">
            New Message
          </Box>
        ),
      });
      chatBox.scrollTo(0, chatBox.scrollHeight);
    }
  }, [messages]);

  return (
    <Flex id="chat-wrapper">
      <Header />
      <Flex
        className="messages-wrapper"
        backgroundColor="#0D1418"
        style={{ overflowY: "scroll" }}
        direction="column"
        flex="1"
        py={2}
        px={4}
      >
        {user ? (
          messages &&
          messages
            .slice(0)
            .reverse()
            .map((msg: MessageProps) => (
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
      {user && <InputBar />}
    </Flex>
  );
};

export default Default;
