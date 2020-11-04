import { Box } from "@chakra-ui/core";
import React from "react";

interface WrapperProps {
  width?: string;
  props?: Object;
}

export const Wrapper: React.FC<WrapperProps> = ({
  children,
  props,
  width = "800px",
}) => {
  return (
    <Box mx="auto" maxW={width} w="100%" {...props}>
      {children}
    </Box>
  );
};
