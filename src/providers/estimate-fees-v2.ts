import {
  serializeTransaction,
  Transaction,
  TransactionSerializedEIP1559,
  PublicClient,
} from "viem";

import { getGasPriceOracleContract } from "./estimate-fees";

interface EstimateFeesResponse {
  l1Fee: bigint;
  l2Fee: bigint;
  total: bigint;
}

// Inspired by Optimism's estimateFees in `estimate-fees.ts`; adapted to my needs.
export async function estimateFees(
  tx: Transaction,
  publicClient: PublicClient,
): Promise<EstimateFeesResponse> {
  const contract = getGasPriceOracleContract(publicClient);
  console.log(contract.address);
  const serializedTransaction = serializeTransaction({
    chainId: tx.chainId!,
    to: tx.to!,
    account: tx.from!,
    accessList: tx.accessList,
    data: tx.input,
    value: tx.value,
    type: tx.type,
  }) as TransactionSerializedEIP1559;
  const l1Fee: bigint = await contract.read.getL1Fee([serializedTransaction]);
  const l2Fee = await publicClient.estimateGas({
    to: tx.to!,
    account: tx.from!,
    accessList: tx.accessList,
    data: tx.input,
    value: tx.value,
  });
  return { l1Fee, l2Fee, total: l1Fee + l2Fee };
}
