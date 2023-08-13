import { createWalletClient, http, parseEther } from "viem";
import { privateKeyToAccount } from "viem/accounts";
import { WalletClient } from "wagmi";
import { optimism, optimismGoerli } from "@wagmi/chains";

import { ERC20_ABI } from "./abis/erc20";
import { WETH_ABI } from "./abis/weth";

/**
 * Helpers to create failed tx's (for testing the tool).
 *
 * You have to use contract interactions as e.g. for something simple as sending
 * a token, wallets like MetaMask won't be able to let you manipulate the gas
 * limit (to make the tx fail).
 */

// Fails trying to approve an ERC20 token.
export async function createFailedApprovalTx(client: WalletClient) {
  const [address] = await client.getAddresses();
  console.log(address);
  const hash = await client.writeContract({
    // TODO: use WETH on goerli (and mainnet?)
    // 0xEB466342C4d449BC9f53A865D5Cb90586f405215 axlUSDC on Base
    address: "0x7F5c764cBc14f9669B88837ca1490cCa17c31607", // USDC
    abi: ERC20_ABI,
    functionName: "approve",
    args: ["0x7F5c764cBc14f9669B88837ca1490cCa17c31607", parseEther("1")],
    account: address,
    // Low gas limit makes the tx fail
    gas: BigInt(30_000),
  });
  console.log("tx.hash", hash);
  return hash;
}

// Fails trying to deposit ETH for WETH.
export async function createFailedDepositTX(client: WalletClient) {
  const [address] = await client.getAddresses();
  console.log(address);
  const hash = await client.writeContract({
    address: "0x4200000000000000000000000000000000000006", // WETH9 on Optimism + Base
    abi: WETH_ABI,
    functionName: "deposit",
    account: address,
    // Low gas limit makes the tx fail
    gas: BigInt(21_010),
    value: parseEther("0.001"),
  });
  console.log("tx.hash", hash);
  return hash;
}

// const url = `https://opt-mainnet.g.alchemy.com/v2/${
//   import.meta.env.VITE_ALCHEMY_API_KEY
// }`;

// const account = privateKeyToAccount("0x00dead");

// const client = createWalletClient({
//   account,
//   chain: optimism,
//   transport: http(url),
// });

// export async function main() {
//   // sendTransactionFail(client).then((hash) => {
//   //   console.log("sent", hash);
//   // });
// }
