import {
  Flex,
  Text,
  Box,
  IconButton,
  Button,
  useToast,
  Input,
} from "@chakra-ui/core";
import React, { useContext, useState } from "react";
import { FiLogOut, FiSend } from "react-icons/fi";
import { Wrapper } from "../components/Wrapper";
import { useAuthState } from "react-firebase-hooks/auth";
import { FirebaseContext } from "../App";
import { useCollectionData } from "react-firebase-hooks/firestore";
import { Message } from "../components/Message";

export interface MessageProps {
  text: string;
  uid: string;
  photoURL: string;
  id: string;
}

const Default: React.FC = () => {
  const [message, setMessage] = useState("");
  const { firebase, auth, firestore } = useContext(FirebaseContext);
  const toast = useToast();

  const [user] = useAuthState(auth);
  const [loading, setLoading] = useState<boolean>(false);

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

  const signOut = async () => {
    if (user) {
      await auth.signOut();
      toast({
        title: "Successfully logged out.",
        description: "We hope to see you again later 🤗",
        status: "success",
        duration: 9000,
        isClosable: true,
      });
    }
  };

  const signIn = async () => {
    const provider = new firebase.auth.GoogleAuthProvider();
    setLoading(true);
    try {
      await auth.signInWithPopup(provider);
    } catch (error) {
      setLoading(false);
      toast({
        title: "Uhh, that's weird.",
        description: "Something went wrong, try again later 👽",
        status: "error",
        duration: 9000,
        isClosable: true,
      });
      return;
    }

    setLoading(false);
  };
  return (
    <Flex alignItems="center" h="100%">
      <Wrapper width="500px">
        <Flex direction="column" className="wrapper" borderRadius="8px">
          <Flex
            px={4}
            py={2}
            backgroundColor="#18181B"
            color="#efeff1"
            alignItems="center"
            height="56px"
            borderTopLeftRadius="8px"
            borderTopRightRadius="8px"
          >
            <Flex>
              <Box mr={2}>💬</Box>
              <Text fontWeight="500">
                {user ? user.displayName : "RandomChat"}
              </Text>
            </Flex>
            <Flex ml="auto">
              {user ? (
                <IconButton
                  variant="ghost"
                  variantColor="#18181b"
                  icon={FiLogOut}
                  onClick={signOut}
                  aria-label="Log-out"
                />
              ) : (
                <Button
                  variant="ghost"
                  aria-label="Log-in"
                  variantColor="#18181b"
                  isLoading={loading}
                  onClick={signIn}
                >
                  🚀 Log-in
                </Button>
              )}
            </Flex>
          </Flex>
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
      </Wrapper>
    </Flex>
  );
};

export default Default;
