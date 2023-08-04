import {
  useDisclosure,
  Button,
  Flex,
  Slide,
  Box,
  Text,
} from "@chakra-ui/react";
import { ConnectButton } from "@rainbow-me/rainbowkit";
import { useAccount } from "wagmi";

import { Attestooooooor } from "./components";

export function App() {
  /**
   * Wagmi hook for getting account information
   * @see https://wagmi.sh/docs/hooks/useAccount
   */
  const { isConnected } = useAccount();

  return (
    <>
      <h1>OP Starter Project</h1>

      <BigTitle />
      <SlideEx />

      {/** @see https://www.rainbowkit.com/docs/connect-button */}
      <ConnectButton />

      {isConnected && (
        <>
          <hr />
          <Attestooooooor />
          <hr />
        </>
      )}
    </>
  );
}

function BigTitle() {
  return (
    <Flex alignItems={"center"} gap={4}>
      <Box borderRadius={48} bg={"#FF0420"} w={9} h={9} />
      <Text fontSize="5xl" fontWeight={400}>
        Replay
      </Text>
    </Flex>
  );
}

function SlideEx() {
  const { isOpen, onToggle } = useDisclosure();

  return (
    <>
      <Button onClick={onToggle}>Click Me</Button>
      <Slide direction="bottom" in={isOpen} style={{ zIndex: 10 }}>
        <Box
          p="40px"
          color="white"
          mt="4"
          bg="teal.500"
          rounded="md"
          shadow="md"
        ></Box>
      </Slide>
    </>
  );
}
