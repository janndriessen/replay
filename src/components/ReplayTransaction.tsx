import { useEffect, useState } from "react";
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
import { formatEther, parseEther, parseGwei, serializeTransaction } from "viem";
import {
  useNetwork,
  usePrepareSendTransaction,
  useSendTransaction,
} from "wagmi";

import { estimateFees, getL2Client } from "../estimateFees";
import { OP_ABI } from "../abis/OP_ABI";
import { Simulator } from "./Simulatooor";

const clientParams = {
  chainId: 10,
  rpcUrl:
    process.env.VITE_L2_RPC_URL ??
    `https://opt-mainnet.g.alchemy.com/v2/${
      import.meta.env.VITE_ALCHEMY_API_KEY
    }`,
} as const;

const viemClient = getL2Client(clientParams);

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
    const fetch = async () => {
      const fees = await estimateFees({
        client: viemClient,
        chainId: 10,
        functionName: "transfer",
        abi: OP_ABI,
        args: ["0xd8dA6BF26964aF9D7eEd9e03E53415D37aA96045", parseEther("10")],
        account: "0xdfa7D985aA3c73e6cD87cC088943627427C56C9E",
        to: "0x4200000000000000000000000000000000000042",
      });
      setFees({
        l1: formatEther(fees.l1Fee),
        l2: formatEther(fees.l2Fee),
        total: formatEther(fees.total),
      });
      console.log(
        "FEES",
        fees,
        fees.l1Fee.toString(),
        fees.l2Fee.toString(),
        fees.total.toString(),
      );
    };
    fetch();
  }, []);

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
