import {
  useDisclosure,
  Button,
  Collapse,
  Flex,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
  Slide,
  Box,
  Text,
  SlideFade,
} from "@chakra-ui/react";
import { ConnectButton } from "@rainbow-me/rainbowkit";
import { useAccount } from "wagmi";

import { ReplayButton, ReplayTransaction } from "./components";
import { useEffect } from "react";

export function App() {
  /**
   * Wagmi hook for getting account information
   * @see https://wagmi.sh/docs/hooks/useAccount
   */
  const { isConnected } = useAccount();
  const { isOpen, onOpen, onClose } = useDisclosure();
  const { isOpen: navIsOpen, onOpen: onOpenNav } = useDisclosure();

  useEffect(() => {
    const delay = (ms: number) => new Promise((res) => setTimeout(res, ms));
    const sleep = async () => {
      await delay(5000);
      console.log("animate");
    };
    sleep();
  }, []);

  return (
    <Flex direction={"column"} h="100vh">
      <SlideFade in={navIsOpen} offsetY={"-100px"}>
        <NavBar isConnected={isConnected} />
      </SlideFade>

      <Flex h="100%">
        <Flex direction={"column"} justify={"flex-start"} margin={"auto"}>
          <h1>OP Starter Project</h1>
          <BigTitle />
          <Flex>
            <SlideEx />
            <Button onClick={() => onOpenNav()}>Open Modal</Button>
          </Flex>
          {/** @see https://www.rainbowkit.com/docs/connect-button */}
          <ConnectButton />
        </Flex>
      </Flex>

      {isConnected && <>isConnected</>}

      <Modal
        isCentered
        onClose={onClose}
        isOpen={isOpen}
        motionPreset="slideInBottom"
        size={"xl"}
      >
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>🔴 Replay Transaction</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <ReplayTransaction />
          </ModalBody>
          <ModalFooter justifyContent={"center"}>
            <ReplayButton onClick={onClose} />
          </ModalFooter>
        </ModalContent>
      </Modal>
    </Flex>
  );
}

interface NavBarProps {
  isConnected: boolean;
}

function NavBar({ isConnected }: NavBarProps) {
  return (
    <Flex
      alignItems={"center"}
      justify={"space-between"}
      px={"32px"}
      py={"16px"}
      boxShadow={"md"}
    >
      <SmallTitle />
      {isConnected && <ConnectButton />}
    </Flex>
  );
}

function BigTitle() {
  return (
    <Flex alignItems={"center"} gap={3}>
      <Box borderRadius={48} bg={"#FF0420"} w={10} h={10} />
      <Text fontSize="4xl" fontWeight={400}>
        Replay
      </Text>
    </Flex>
  );
}

function SmallTitle() {
  return (
    <Flex alignItems={"center"} gap={2}>
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
