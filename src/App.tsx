import {
  useDisclosure,
  Button,
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
  SlideFade,
} from "@chakra-ui/react";
import { ConnectButton } from "@rainbow-me/rainbowkit";
import { useAccount } from "wagmi";

import {
  BigTitle,
  SmallTitle,
  ReplayButton,
  ReplayTransaction,
} from "./components";
import { useEffect, useState } from "react";

export function App() {
  /**
   * Wagmi hook for getting account information
   * @see https://wagmi.sh/docs/hooks/useAccount
   */
  const { isConnected } = useAccount();
  const { isOpen, onOpen, onClose } = useDisclosure();
  const { isOpen: navIsOpen, onOpen: onOpenNav } = useDisclosure();
  const [dataLoaded, setDataLoaded] = useState(false);

  return (
    <Flex direction={"column"} h="100vh">
      <SlideFade in={navIsOpen} offsetY={"-100px"}>
        <NavBar isConnected={isConnected} />
      </SlideFade>

      {/* // TODO: add fade out animation */}
      <Flex h="100%">
        <Flex direction={"column"} alignItems={"center"} margin={"auto"}>
          <BigTitle />
          {!isConnected && (
            <>
              <Flex>
                <SlideEx />
                <Button onClick={() => onOpenNav()}>Open Modal</Button>
              </Flex>
              <ConnectButton />
            </>
          )}
          {isConnected && <Loader onFinishedLoading={() => onOpenNav()} />}
        </Flex>
      </Flex>

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

import { Spinner } from "@chakra-ui/react";

interface LoaderProps {
  onFinishedLoading: () => void;
}

function Loader({ onFinishedLoading }: LoaderProps) {
  useEffect(() => {
    const delay = (ms: number) => new Promise((res) => setTimeout(res, ms));
    const sleep = async () => {
      await delay(5000);
      console.log("animate");
      onFinishedLoading();
    };
    sleep();
  }, []);
  return (
    <>
      <Spinner color="red.500" />
    </>
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
