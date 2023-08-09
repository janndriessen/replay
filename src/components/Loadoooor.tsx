import { useEffect } from "react";
import { Spinner } from "@chakra-ui/react";

import { devMode } from "../constants";
import {
  CovalentApi,
  CovalentApiResponseTransaction,
} from "../providers/covalent-api";

interface LoaderProps {
  address: string;
  chainId: number;
  onFinishedLoading: (transactions: CovalentApiResponseTransaction[]) => void;
}

export function Loader({ address, chainId, onFinishedLoading }: LoaderProps) {
  useEffect(() => {
    console.log("call");
    if (!address || !chainId) return;
    const fetch = async () => {
      const covalentApi = new CovalentApi(devMode);
      const transactions: CovalentApiResponseTransaction[] =
        await covalentApi.getAllTransactions(address, chainId);
      onFinishedLoading(transactions);
    };
    fetch();
  }, [address, chainId]);
  return (
    <>
      <Spinner color="op" size="lg" />
    </>
  );
}
