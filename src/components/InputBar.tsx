import { Box, Flex, IconButton } from "@chakra-ui/core";
import { Picker } from "emoji-mart";
import React, { useContext, useEffect, useRef, useState } from "react";
import { useAuthState } from "react-firebase-hooks/auth";
import { FaGrin, FaPaperPlane } from "react-icons/fa";
import { FirebaseContext } from "../App";

export const InputBar: React.FC = () => {
  const node = useRef<HTMLDivElement>(null);
  const [message, setMessage] = useState("");
  const [emoji, setEmoji] = useState(false);

  const { firebase, auth, firestore } = useContext(FirebaseContext);
  const messagesRef = firestore.collection("messages");
  const [user] = useAuthState(auth);

  useEffect(() => {
    document.addEventListener("keyup", handleKeyPress);
    document.addEventListener("mousedown", handleClick);
    return () => {
      document.removeEventListener("keyup", handleKeyPress);
      document.removeEventListener("mousedown", handleClick);
    };
  }, []);

  const handleClick = (e: any) => {
    if (node.current?.contains(e.target)) {
      return;
    }

    setEmoji(false);
  };

  const handleKeyPress = (e: any) => {
    if (e.key === "Escape") {
      setEmoji(false);
    }
  };

  const submitMessage = async (e: any) => {
    e.preventDefault();
    if (auth.currentUser === null) return;
    const _message = message;
    setMessage("");

    const { uid, photoURL } = auth.currentUser;

    await messagesRef.add({
      text: _message,
      createdAt: firebase.firestore.FieldValue.serverTimestamp(),
      author: user.displayName,
      uid,
      photoURL,
    });

  };

  const openEmoji = () => {
    setEmoji((oldEmoji) => {
      return !oldEmoji;
    });
  };

  return (
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
          <Box ref={node} className="emoji-wrapper">
            <Picker
              theme="dark"
              onSelect={(emoji) =>
                setMessage((oldMessage) => {
                  return `${oldMessage} ${(emoji as any).native}`;
                })
              }
            />
          </Box>
        )}
        <div className="input-wrapper">
          <IconButton
            icon={FaGrin}
            onClick={openEmoji}
            aria-label="Emojis"
            variant="ghost"
            variantColor="#18181b"
          />
          <input
            autoComplete="off"
            placeholder="message..."
            name="message"
            required
            value={message}
            onChange={(e: any) => setMessage(e.target.value)}
          />
        </div>
        <IconButton
          icon={FaPaperPlane}
          aria-label="Send"
          className="send"
          type="submit"
        />
      </Flex>
    </form>
  );
};
