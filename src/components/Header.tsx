import React, { useContext } from "react";
import { Flex, Box, Text, IconButton, Button, useToast } from "@chakra-ui/core";
import { useState } from "react";
import { useAuthState } from "react-firebase-hooks/auth";
import { FaSignOutAlt } from "react-icons/fa";
import { FirebaseContext } from "../App";

const Header: React.FC = () => {
  const toast = useToast();
  const [loading, setLoading] = useState<boolean>(false);

  const { firebase, auth } = useContext(FirebaseContext);
  const [user, isLoading] = useAuthState(auth);

  const signOut = async () => {
    if (user) {
      try {
        await auth.signOut();
      } catch (error) {
        console.error(error);
      }

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
    <Flex
      px={4}
      py={2}
      backgroundColor="#18181B"
      color="#efeff1"
      alignItems="center"
      className="header"
    >
      <Flex>
        <Box mr={2}>💬</Box>
        <Text className="display-name">
          {user ? user.displayName : "RandomChat"}
        </Text>
      </Flex>
      <Flex ml="auto">
        {user ? (
          <IconButton
            variant="ghost"
            variantColor="#18181b"
            icon={FaSignOutAlt}
            onClick={signOut}
            aria-label="Log-out"
          />
        ) : (
          <Button
            variant="ghost"
            aria-label="Log-in"
            variantColor="#18181b"
            isLoading={loading || isLoading}
            onClick={signIn}
          >
            🚀 Log-in
          </Button>
        )}
      </Flex>
    </Flex>
  );
};

export default Header;
