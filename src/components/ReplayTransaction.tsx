import { useEffect, useState } from "react";
import { Address, formatEther, parseEther } from "viem";
import {
  useNetwork,
  usePrepareSendTransaction,
  usePublicClient,
  useSendTransaction,
} from "wagmi";
import {
  Button,
  Flex,
  Input,
  InputGroup,
  InputLeftAddon,
  InputRightElement,
  Table,
  TableCaption,
  TableContainer,
  Tbody,
  Td,
  Th,
  Thead,
  Tr,
} from "@chakra-ui/react";

import { ReplayButton } from "./ReplayButton";
import { estimateFees } from "../providers/estimate-fees-v2";
import { useSimulateTransaction } from "../providers/useSimulateTx";
import { Simulator } from "./Simulatooor";

export enum ReplayPopupState {
  transaction,
  error,
  success,
}

type Fees = {
  l1: string;
  l2: string;
  total: string;
};

interface ReplayTransactionProps {
  hash: string;
}

export function ReplayTransaction({ hash }: ReplayTransactionProps) {
  const publicClient = usePublicClient();
  const { chain } = useNetwork();
  const { simulateTx } = useSimulateTransaction();

  const [customGasLimit, setCustomGasLimit] = useState("");
  const [fees, setFees] = useState<Fees | null>(null);
  const [isSuccess, setSimulationSuccess] = useState(true);
  const [tx, setTransaction] = useState<any | null>(null);

  const currencySymbol = chain?.nativeCurrency.symbol ?? "";
  const explorerUrl = chain?.blockExplorers?.default.url ?? "";

  const { config } = usePrepareSendTransaction({ ...tx, data: tx?.input });
  const {
    isLoading: isSending,
    sendTransaction,
    error: sendError,
  } = useSendTransaction(config);

  useEffect(() => {
    const fetchDetails = async () => {
      const tx = await publicClient.getTransaction({ hash: hash as Address });
      console.log("//////", hash);
      console.log(tx);
      console.log(
        "gasLimit",
        BigInt(customGasLimit).toString(),
        tx.gas.toString(),
      );
      if (customGasLimit.length > 0) {
        tx.gas = BigInt(customGasLimit) ?? tx.gas;
      }
      tx.gasPrice = undefined;
      const { l1Fee, l2Fee, total } = await estimateFees(tx, publicClient);
      console.log(l1Fee.toString(), l2Fee.toString(), total.toString());
      setFees({
        l1: formatEther(l1Fee),
        l2: formatEther(l2Fee),
        total: formatEther(total),
      });
      if (customGasLimit.length === 0) {
        setCustomGasLimit(l2Fee.toString());
      }
      setTransaction(tx);
    };
    fetchDetails();
  }, [customGasLimit, hash]);

  useEffect(() => {
    if (!tx) return;
    const simulate = async () => {
      const success = await simulateTx(tx);
      setSimulationSuccess(success);
    };
    simulate();
  }, [tx]);

  const openExplorer = (url: string) => {
    window.open(url, "_blank", "noreferrer");
  };

  const replay = () => {
    if (!sendTransaction) return;
    console.log(config);
    sendTransaction();
  };

  return (
    <>
      <InputGroup>
        <InputLeftAddon children="Tx Hash" />
        <Input
          type="text"
          placeholder="0x00dead"
          isReadOnly={true}
          maxLength={10}
          value={hash}
        />
        <InputRightElement width="4.5rem" mr={"8px"}>
          <Button
            h="1.75rem"
            size="sm"
            onClick={() => openExplorer(`${explorerUrl}/tx/${hash}`)}
          >
            Explorer
          </Button>
        </InputRightElement>
      </InputGroup>
      <InputGroup mt={"16px"}>
        <InputLeftAddon children="Custom Gas Limit" />
        <Input
          type="number"
          placeholder="500000"
          onChange={(event) => setCustomGasLimit(event.target.value)}
          value={customGasLimit}
        />
      </InputGroup>
      <TableContainer mt="4">
        <Table variant="simple">
          <TableCaption>Cost Estimation</TableCaption>
          <Thead>
            <Tr>
              <Th>Type</Th>
              <Th isNumeric>Fees</Th>
            </Tr>
          </Thead>
          <Tbody>
            <Tr>
              <Td>L1</Td>
              <Td isNumeric>{`${fees?.l1 ?? ""} ${currencySymbol}`}</Td>
            </Tr>
            <Tr>
              <Td>L2</Td>
              <Td isNumeric>{`${fees?.l2 ?? ""} ${currencySymbol}`}</Td>
            </Tr>
            <Tr>
              <Td>
                <b>Total</b>
              </Td>
              <Td isNumeric>
                <b>{`${fees?.total ?? ""} ${currencySymbol}`}</b>
              </Td>
            </Tr>
          </Tbody>
        </Table>
      </TableContainer>
      <Simulator isSuccess={isSuccess} />
      <Flex justify={"center"} my="16px">
        <ReplayButton onClick={replay} />
      </Flex>
    </>
  );
}
