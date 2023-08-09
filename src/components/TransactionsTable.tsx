import { useEffect, useState } from "react";
import { useNetwork, useWalletClient } from "wagmi";
import { CheckIcon, WarningTwoIcon } from "@chakra-ui/icons";
import {
  Button,
  Flex,
  Input,
  InputGroup,
  InputLeftAddon,
  InputRightElement,
  Link,
  Table,
  TableCaption,
  TableContainer,
  Tbody,
  Td,
  Tfoot,
  Th,
  Thead,
  Tr,
} from "@chakra-ui/react";

import {
  CovalentApi,
  CovalentApiResponseTransaction,
} from "../providers/covalent-api";
import { createFailedDepositTX } from "../transactions";

const devMode = false;

interface TransactionsTableProps {
  preloadedTxs: CovalentApiResponseTransaction[];
}
export function TransactionsTable({ preloadedTxs }: TransactionsTableProps) {
  const { chain } = useNetwork();
  const [transactions, setTransactions] = useState(preloadedTxs);
  const { data: walletClient, isError, isLoading } = useWalletClient();

  const explorerUrl = chain?.blockExplorers?.default.url ?? "";
  // console.log("block explorer", explorerUrl);

  // Fetches and sets transactions on switching chain.
  useEffect(() => {
    const switchedChain = async () => {
      console.log("switchedChain", chain?.id);
      if (!chain) return;
      const covalentApi = new CovalentApi(devMode);
      // const res = await covalentApi.getTransaction(
      //   "0x1a9e0c436d3afce7039f89fa91af9820cee8d44fdc6b1a215089a6e29edd2508",
      //   420,
      // );
      const transactions: CovalentApiResponseTransaction[] =
        await covalentApi.getAllTransactions(
          "0xEcb715b972De16D0074689ea39398e50095bA9E7",
          chain.id,
        );
      console.log(transactions);
      setTransactions(transactions);
    };
    switchedChain();
  }, [chain]);

  // Only for testing purposes to conveniently create failed tx's.
  const onFail = () => {
    if (!walletClient) return;
    const send = async () => {
      await createFailedDepositTX(walletClient);
    };
    send();
  };

  return (
    <Flex
      direction={"column"}
      gap="32px"
      px={"32px"}
      py={"16px"}
      boxShadow={"md"}
      minW={"860px"}
    >
      {/* // TODO: uncomment for creating failed tx's */}
      {/* <Button onClick={() => onFail()}>Fail</Button> */}
      <InputGroup mt={"16px"}>
        <InputLeftAddon children="Search tx for hash:" />
        <Input type="text" placeholder="Tx hash 0x...00" />
        <InputRightElement width="4.5rem">
          <Button h="1.75rem" size="sm" onClick={() => console.log("find")}>
            Find
          </Button>
        </InputRightElement>
      </InputGroup>
      <TableContainer>
        <Table variant="striped" colorScheme="blue">
          <TableCaption>
            Recent failed transactions from the connected account
          </TableCaption>
          <Thead>
            <Tr>
              <Th>success</Th>
              <Th>hash</Th>
              <Th isNumeric>gas spent</Th>
              <Th isNumeric>value</Th>
            </Tr>
          </Thead>
          <Tbody>
            {transactions.length > 0 &&
              transactions.map((tx) => (
                <Tr>
                  <Td>{tx.successful ? <CheckIcon /> : <WarningTwoIcon />}</Td>
                  <Td>
                    <Link href={`${explorerUrl}/tx/${tx.tx_hash}`} isExternal>
                      {tx.tx_hash}
                    </Link>
                  </Td>
                  <Td isNumeric>{tx.pretty_gas_quote}</Td>
                  <Td isNumeric>{tx.pretty_value_quote}</Td>
                </Tr>
              ))}
          </Tbody>
          <Tfoot>
            <Tr>
              <Th>success</Th>
              <Th>hash</Th>
              <Th isNumeric>gas spent</Th>
              <Th isNumeric>value</Th>
            </Tr>
          </Tfoot>
        </Table>
      </TableContainer>
    </Flex>
  );
}
