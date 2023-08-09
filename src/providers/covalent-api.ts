function getChainName(chainId: number) {
  switch (chainId) {
    case 1:
      return "eth-mainnet";
    case 5:
      return "eth-goerli";
    case 10:
      return "optimism-mainnet";
    case 420:
      return "optimism-goerli";
    case 8453:
      return "base-mainnet";
    case 84531:
      return "base-testnet";
    case 7777777:
      return "zora-mainnet";
    case 999:
      return "zora-testnet";
    default:
      throw new Error("Unsupported network");
  }
}

export class CovalentApi {
  private baseUrl = "https://api.covalenthq.com/v1/";
  /**
   * Fetches path and returns a json.
   * @returns JSON on success or throws error.
   */
  async get(path: string) {
    try {
      const username = import.meta.env.VITE_COVALENT_API_KEY;
      const headers = {
        Authorization:
          "Basic " + Buffer.from(username + ":" + username).toString("base64"),
      };
      const resp = await fetch(`${this.baseUrl}${path}`, {
        headers,
      });
      return resp.json();
    } catch (error) {
      console.log("Error fetching Covalent API for path", path);
      console.log(error);
      throw error;
    }
  }

  async getAllTransactions(address: string, chainId: number) {
    const chainName = getChainName(chainId);
    const path = `${chainName}/address/${address}/transactions_v3/`;
    const res = await this.get(path);
    return res;
  }

  async getTransaction(hash: string, chainId: number) {
    const chainName = getChainName(chainId);
    console.log(chainName, hash);
    const path = `${chainName}/transaction_v2/${hash}/`;
    const res = await this.get(path);
    return res;
  }
}
