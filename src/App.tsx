import { useEffect, useState } from "react";
import { useAccount } from "wagmi";
import {
  useDisclosure,
  Flex,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
  SlideFade,
  Fade,
} from "@chakra-ui/react";
import { ConnectButton } from "@rainbow-me/rainbowkit";

import {
  BigTitle,
  SmallTitle,
  ReplayButton,
  ReplayTransaction,
} from "./components";

export function App() {
  /**
   * Wagmi hook for getting account information
   * @see https://wagmi.sh/docs/hooks/useAccount
   */
  const { isConnected } = useAccount();
  const { isOpen, onOpen, onClose } = useDisclosure();
  const {
    isOpen: introIsOpen,
    onOpen: onOpenIntro,
    onClose: onCloseIntro,
  } = useDisclosure();
  const { isOpen: navIsOpen, onOpen: onOpenNav } = useDisclosure();
  const [dataLoaded, setDataLoaded] = useState(false);

  useEffect(() => {
    const delay = (ms: number) => new Promise((res) => setTimeout(res, ms));
    const openIntro = async () => {
      await delay(750);
      onOpenIntro();
    };
    openIntro();
  }, []);

  useEffect(() => {
    if (!dataLoaded) return;
    onOpenNav();
    onCloseIntro();
  }, [dataLoaded]);

  return (
    <Flex direction={"column"} h="100vh">
      <SlideFade in={navIsOpen} offsetY={"-100px"}>
        <NavBar isConnected={isConnected} />
      </SlideFade>

      <Fade in={introIsOpen}>
        <Flex h="80vh" margin={"auto"}>
          <Flex direction={"column"} alignItems={"center"} margin={"auto"}>
            <BigTitle />
            <Flex mt="20px">
              {isConnected && (
                <Loader onFinishedLoading={() => setDataLoaded(true)} />
              )}
              {!isConnected && <ConnectButton />}
            </Flex>
          </Flex>
        </Flex>
      </Fade>

      <Modal
        isCentered
        isOpen={isOpen}
        motionPreset="slideInBottom"
        onClose={onClose}
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
      <Spinner color="op" size="lg" />
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
