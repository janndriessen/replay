import { useEffect, useState } from "react";
import {
  Address,
  formatEther,
  parseEther,
  parseGwei,
  serializeTransaction,
} from "viem";
import {
  useNetwork,
  usePrepareSendTransaction,
  usePublicClient,
  useSendTransaction,
} from "wagmi";
import {
  Button,
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

import { estimateFees } from "../providers/estimate-fees-v2";
import { Simulator } from "./Simulatooor";

const serialized = serializeTransaction({
  chainId: 10,
  gas: 21001n,
  gasLimit: 500_000,
  maxFeePerGas: parseGwei("20"),
  maxPriorityFeePerGas: parseGwei("2"),
  nonce: 69,
  to: "0x1234512345123451234512345123451234512345",
  value: parseEther("0.01"),
});
console.log(serialized);

// data
// to
// gasPrice
// type
// nonce
// gasLimit

// useEffect(() => {
//   console.log("Error sending tx:", sendError);
// }, [sendError]);

// const test = () => {
//   if (!sendTransaction) return;
//   try {
//     sendTransaction();
//   } catch (error: unknown) {
//     console.log("Error sending tx:", error);
//   }
// };

interface ReplayButtonProps {
  onClick: () => void;
}

export const ReplayButton = ({ onClick }: ReplayButtonProps) => (
  <Button
    bg={"op"}
    borderRadius={"12"}
    color={"#fff"}
    fontSize={"16"}
    fontWeight={"700"}
    px="20"
    py="6"
    onClick={onClick}
  >
    Replay
  </Button>
);

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
  const [fees, setFees] = useState<Fees | null>(null);

  const currencySymbol = chain?.nativeCurrency.symbol ?? "";
  const explorerUrl = chain?.blockExplorers?.default.url ?? "";

  // Send ETH to Vitalik
  const { config } = usePrepareSendTransaction({
    to: "0xd8dA6BF26964aF9D7eEd9e03E53415D37aA96045",
    value: parseEther("0.001"),
  });
  const { sendTransaction, error: sendError } = useSendTransaction(config);

  useEffect(() => {
    const fetchDetails = async () => {
      const tx = await publicClient.getTransaction({ hash: hash as Address });
      console.log("//////", hash);
      console.log(tx);
      const { l1Fee, l2Fee, total } = await estimateFees(tx, publicClient);
      console.log(l1Fee.toString(), l2Fee.toString(), total.toString());
      setFees({
        l1: formatEther(l1Fee),
        l2: formatEther(l2Fee),
        total: formatEther(total),
      });
    };
    fetchDetails();
  }, [hash]);

  const openExplorer = (url: string) => {
    window.open(url, "_blank", "noreferrer");
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
        <Input type="number" placeholder="500_000" />
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
      <Simulator />
    </>
  );
}
