import { useEffect, useState } from "react";
import { useAccount, useNetwork } from "wagmi";
import {
  useDisclosure,
  Flex,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalHeader,
  ModalOverlay,
  SlideFade,
  Fade,
} from "@chakra-ui/react";
import { ConnectButton } from "@rainbow-me/rainbowkit";

import {
  BigTitle,
  Loader,
  NavigationBar,
  ReplayButton,
  ReplayPopupState,
  ReplayTransaction,
  TransactionsTable,
} from "./components";
import { CovalentApiResponseTransaction } from "./providers/covalent-api";
import { ReplayTransactionResult } from "./components/ReplayTransactionResult";

export function App() {
  /**
   * Wagmi hook for getting account information
   * @see https://wagmi.sh/docs/hooks/useAccount
   */
  const { address, isConnected } = useAccount();
  const { chain } = useNetwork();
  const { isOpen, onOpen, onClose } = useDisclosure();
  const {
    isOpen: introIsOpen,
    onOpen: onOpenIntro,
    onClose: onCloseIntro,
  } = useDisclosure();
  const { isOpen: navIsOpen, onOpen: onOpenNav } = useDisclosure();
  const [dataLoaded, setDataLoaded] = useState(false);
  const [preloadedTxs, setPreloadedTxs] = useState<
    CovalentApiResponseTransaction[] | null
  >(null);
  const [hash, setHash] = useState("");
  const [replayHash, setReplayHash] = useState("");
  const [replayPopupState, setReplayPopupState] = useState<ReplayPopupState>(
    ReplayPopupState.transaction,
  );

  useEffect(() => {
    console.log("INIT");
    const delay = (ms: number) => new Promise((res) => setTimeout(res, ms));
    const openIntro = async () => {
      await delay(750);
      onOpenIntro();
    };
    if (introIsOpen) return;
    openIntro();
  }, []);

  useEffect(() => {
    if (!dataLoaded) return;
    onOpenNav();
    onCloseIntro();
  }, [dataLoaded]);

  const onError = () => {
    setReplayPopupState(ReplayPopupState.error);
  };

  const onSuccess = (hash: string) => {
    if (hash.length < 10) return;
    setReplayHash(hash);
    setReplayPopupState(ReplayPopupState.success);
  };

  return (
    <Flex direction={"column"} h="100vh">
      {dataLoaded && preloadedTxs !== null ? (
        <>
          <SlideFade in={navIsOpen} offsetY={"-100px"}>
            <NavigationBar isConnected={isConnected} />
          </SlideFade>
          <SlideFade in={navIsOpen}>
            <Flex h="80vh" margin={"0 auto"}>
              <Flex direction={"column"} margin={"auto"}>
                <TransactionsTable
                  preloadedTxs={preloadedTxs ?? []}
                  onClickTx={(hash) => {
                    setHash(hash);
                    onOpen();
                  }}
                ></TransactionsTable>
              </Flex>
            </Flex>
          </SlideFade>
        </>
      ) : (
        <Fade in={introIsOpen}>
          <Flex h="80vh" margin={"auto"}>
            <Flex direction={"column"} alignItems={"center"} margin={"auto"}>
              <BigTitle />
              <Flex mt="20px">
                {isConnected && address && chain && (
                  <Loader
                    address={address}
                    chainId={chain.id}
                    onFinishedLoading={(txs) => {
                      setDataLoaded(true);
                      setPreloadedTxs(txs);
                    }}
                  />
                )}
                {!isConnected && <ConnectButton />}
              </Flex>
            </Flex>
          </Flex>
        </Fade>
      )}

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
            {(() => {
              switch (replayPopupState) {
                case ReplayPopupState.error:
                case ReplayPopupState.success:
                  return (
                    <ReplayTransactionResult
                      hash={replayHash}
                      onClose={() => onClose()}
                    />
                  );
                default:
                  return (
                    <ReplayTransaction
                      hash={hash}
                      onError={onError}
                      onSucces={(hash) => onSuccess(hash)}
                    />
                  );
              }
            })()}
          </ModalBody>
        </ModalContent>
      </Modal>
    </Flex>
  );
}
