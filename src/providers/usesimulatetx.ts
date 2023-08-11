import { useNetwork } from "wagmi";

import { TxSimulator } from "./simulator";

export const useSimulateTransaction = () => {
  const { chain } = useNetwork();

  async function simulateTx(tx: any): Promise<boolean> {
    if (!chain) return false;
    if (!tx) return false;
    const accessKey = import.meta.env.VITE_TENDERLY_ACCESS_KEY;
    const user = import.meta.env.VITE_TENDERLY_USER;
    let success = false;
    try {
      const simulator = new TxSimulator(accessKey, user);
      success = await simulator.simulate(tx);
    } catch (error: unknown) {
      console.log("Error simulating tx:", error);
    }
    return success;
  }

  return { simulateTx };
};
