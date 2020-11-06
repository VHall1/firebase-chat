import { Flex, IconButton } from "@chakra-ui/core";
import { Picker } from "emoji-mart";
import React, { useContext, useState } from "react";
import { FaGrin, FaPaperPlane } from "react-icons/fa";
import { FirebaseContext } from "../App";

export const InputBar: React.FC = () => {
  const [message, setMessage] = useState("");
  const [emoji, setEmoji] = useState(false);

  const { firebase, auth, firestore } = useContext(FirebaseContext);
  const messagesRef = firestore.collection("messages");

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
            onSelect={(emoji) =>
              setMessage((oldMessage) => {
                return `${oldMessage} ${(emoji as any).native}`;
              })
            }
          />
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
