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
      <NavBar />
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

function NavBar() {
  return (
    <Flex
      alignItems={"center"}
      justify={"space-between"}
      px={"32px"}
      py={"16px"}
      boxShadow={"md"}
    >
      <SmallTitle />
      <ConnectButton />
    </Flex>
  );
}

function BigTitle() {
  return (
    <Flex alignItems={"center"} gap={2}>
      <Box borderRadius={48} bg={"#FF0420"} w={10} h={10} />
      <Text fontSize="4xl" fontWeight={400}>
        Replay
      </Text>
    </Flex>
  );
}

function SmallTitle() {
  return (
    <Flex alignItems={"center"} gap={1}>
      <Box borderRadius={48} bg={"#FF0420"} w={4} h={4} />
      <Text fontSize="lg" fontWeight={400}>
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
