export interface CovalentApiResponseTransaction {
  block_signed_at: string;
  successful: boolean;
  tx_hash: string;
  from_address: string;
  to_address: string;
  pretty_gas_quote: string;
  pretty_value_quote: number;
  gas_offered: number; // gas limit
  gas_spent: number;
  gas_price: number;
  value: string;
  value_quote: number;
}

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
  constructor(private readonly devMode: boolean = false) {}
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
    console.log(covalentDummyRes.data.items.length);
    if (this.devMode) return covalentDummyRes.data.items;
    console.log("fetching from api");
    const chainName = getChainName(chainId);
    const path = `${chainName}/address/${address}/transactions_v3/`;
    const res = await this.get(path);
    return res.data.items;
  }

  async getTransaction(hash: string, chainId: number) {
    const chainName = getChainName(chainId);
    console.log(chainName, hash);
    const path = `${chainName}/transaction_v2/${hash}/`;
    const res = await this.get(path);
    return res;
  }
}

/**
 * Originally tried using the client SDK but it wouldn't work for all required chains.
 * See `FIXME` in code below for where the issue appeared.
 *
 */

// import { Client } from "@covalenthq/client-sdk";

// class TransactionsService {
//   private client: Client;
//   constructor() {
//     this.client = new Client(import.meta.env.VITE_COVALENT_API_KEY);
//   }
//   async getRecentTransactions(address: string, chainId: number) {
//     const chainName = getChainName(chainId);
//     // const resp =
//     //   await this.client.TransactionService.getAllTransactionsForAddress(
//     //     chainName,
//     //     address,
//     //   );
//     const res = await this.client.TransactionService.getTransaction(
//       // FIXME: won't work as e.g. `optimism-goerli` is not recognized by type chains
//       chainName,
//       "0x1a9e0c436d3afce7039f89fa91af9820cee8d44fdc6b1a215089a6e29edd2508",
//     );
//     console.log(res);
//   }
// }

const covalentDummyRes = {
  data: {
    address: "0xecb715b972de16d0074689ea39398e50095ba9e7",
    updated_at: "2023-08-07T17:12:39.975278630Z",
    next_update_at: "2023-08-07T17:17:39.975279391Z",
    quote_currency: "USD",
    chain_id: 420,
    chain_name: "optimism-goerli",
    current_page: 0,
    links: {
      prev: null,
      next: null,
    },
    items: [
      {
        block_signed_at: "2023-08-07T17:10:26Z",
        block_height: 13000079,
        tx_hash:
          "0x8c7d625a74d0190a73514620735284a1d1a2337310938172aa93e73e8184b3e5",
        tx_offset: 1,
        successful: true,
        from_address: "0xecb715b972de16d0074689ea39398e50095ba9e7",
        miner_address: "0x4200000000000000000000000000000000000011",
        from_address_label: null,
        to_address: "0x4200000000000000000000000000000000000006",
        to_address_label: null,
        value: "1000000000000000",
        value_quote: 1.8125947897049592,
        pretty_value_quote: "$1.81",
        gas_metadata: {
          contract_decimals: 18,
          contract_name: "Ether",
          contract_ticker_symbol: "ETH",
          contract_address: "0xeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeee",
          supports_erc: null,
          logo_url:
            "https://www.datocms-assets.com/86369/1670347457-optimism-icon-white.svg",
        },
        gas_offered: 45000,
        gas_spent: 27766,
        gas_price: 1500000050,
        fees_paid: "41649068727280",
        gas_quote: 0.07549276291284719,
        pretty_gas_quote: "$0.08",
        gas_quote_rate: 1812.594789704959,
        log_events: [
          {
            block_signed_at: "2023-08-07T17:10:26Z",
            block_height: 13000079,
            tx_offset: 1,
            log_offset: 0,
            tx_hash:
              "0x8c7d625a74d0190a73514620735284a1d1a2337310938172aa93e73e8184b3e5",
            raw_log_topics: [
              "0xe1fffcc4923d04b559f4d29a8bfc6cda04eb5b0d3c460751c2402c5c5cc9109c",
              "0x000000000000000000000000ecb715b972de16d0074689ea39398e50095ba9e7",
            ],
            sender_contract_decimals: null,
            sender_name: null,
            sender_contract_ticker_symbol: null,
            sender_address: "0x4200000000000000000000000000000000000006",
            sender_address_label: null,
            sender_logo_url:
              "https://logos.covalenthq.com/tokens/420/0x4200000000000000000000000000000000000006.png",
            raw_log_data:
              "0x00000000000000000000000000000000000000000000000000038d7ea4c68000",
            decoded: {
              name: "Deposit",
              signature: "Deposit(indexed address dst, uint256 wad)",
              params: [
                {
                  name: "dst",
                  type: "address",
                  indexed: true,
                  decoded: true,
                  value: "0xecb715b972de16d0074689ea39398e50095ba9e7",
                },
                {
                  name: "wad",
                  type: "uint256",
                  indexed: false,
                  decoded: true,
                  value: "1000000000000000",
                },
              ],
            },
          },
        ],
      },
      {
        block_signed_at: "2023-08-07T17:09:38Z",
        block_height: 13000055,
        tx_hash:
          "0xb950715f824861674ab79887088b0bdf9a4eafc33872544880da847cb0a2fb2c",
        tx_offset: 1,
        successful: true,
        from_address: "0xecb715b972de16d0074689ea39398e50095ba9e7",
        miner_address: "0x4200000000000000000000000000000000000011",
        from_address_label: null,
        to_address: "0x4200000000000000000000000000000000000006",
        to_address_label: null,
        value: "1000000000000000",
        value_quote: 1.8125947897049592,
        pretty_value_quote: "$1.81",
        gas_metadata: {
          contract_decimals: 18,
          contract_name: "Ether",
          contract_ticker_symbol: "ETH",
          contract_address: "0xeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeee",
          supports_erc: null,
          logo_url:
            "https://www.datocms-assets.com/86369/1670347457-optimism-icon-white.svg",
        },
        gas_offered: 44866,
        gas_spent: 44866,
        gas_price: 1500000050,
        fees_paid: "67299070520032",
        gas_quote: 0.12198582081854793,
        pretty_gas_quote: "$0.12",
        gas_quote_rate: 1812.594789704959,
        log_events: [
          {
            block_signed_at: "2023-08-07T17:09:38Z",
            block_height: 13000055,
            tx_offset: 1,
            log_offset: 0,
            tx_hash:
              "0xb950715f824861674ab79887088b0bdf9a4eafc33872544880da847cb0a2fb2c",
            raw_log_topics: [
              "0xe1fffcc4923d04b559f4d29a8bfc6cda04eb5b0d3c460751c2402c5c5cc9109c",
              "0x000000000000000000000000ecb715b972de16d0074689ea39398e50095ba9e7",
            ],
            sender_contract_decimals: null,
            sender_name: null,
            sender_contract_ticker_symbol: null,
            sender_address: "0x4200000000000000000000000000000000000006",
            sender_address_label: null,
            sender_logo_url:
              "https://logos.covalenthq.com/tokens/420/0x4200000000000000000000000000000000000006.png",
            raw_log_data:
              "0x00000000000000000000000000000000000000000000000000038d7ea4c68000",
            decoded: {
              name: "Deposit",
              signature: "Deposit(indexed address dst, uint256 wad)",
              params: [
                {
                  name: "dst",
                  type: "address",
                  indexed: true,
                  decoded: true,
                  value: "0xecb715b972de16d0074689ea39398e50095ba9e7",
                },
                {
                  name: "wad",
                  type: "uint256",
                  indexed: false,
                  decoded: true,
                  value: "1000000000000000",
                },
              ],
            },
          },
        ],
      },
      {
        block_signed_at: "2023-08-07T17:08:48Z",
        block_height: 13000030,
        tx_hash:
          "0xf55ace9c3318852ef541e9fbc575f6e80af554f70fa0bed5147340bf396270cc",
        tx_offset: 1,
        successful: false,
        from_address: "0xecb715b972de16d0074689ea39398e50095ba9e7",
        miner_address: "0x4200000000000000000000000000000000000011",
        from_address_label: null,
        to_address: "0x4200000000000000000000000000000000000006",
        to_address_label: null,
        value: "1000000000000000",
        value_quote: 1.8125947897049592,
        pretty_value_quote: "$1.81",
        gas_metadata: {
          contract_decimals: 18,
          contract_name: "Ether",
          contract_ticker_symbol: "ETH",
          contract_address: "0xeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeee",
          supports_erc: null,
          logo_url:
            "https://www.datocms-assets.com/86369/1670347457-optimism-icon-white.svg",
        },
        gas_offered: 30000,
        gas_spent: 30000,
        gas_price: 1500000050,
        fees_paid: "45000073222780",
        gas_quote: 0.08156676825561533,
        pretty_gas_quote: "$0.08",
        gas_quote_rate: 1812.594789704959,
      },
      {
        block_signed_at: "2023-08-07T17:06:00Z",
        block_height: 12999946,
        tx_hash:
          "0x346d2154f5130ad1f842c65ecbd7b540ff36a888b8314907dd6edcb259c3ace4",
        tx_offset: 1,
        successful: false,
        from_address: "0xecb715b972de16d0074689ea39398e50095ba9e7",
        miner_address: "0x4200000000000000000000000000000000000011",
        from_address_label: null,
        to_address: "0x4200000000000000000000000000000000000006",
        to_address_label: null,
        value: "500000000000000",
        value_quote: 0.9062973948524796,
        pretty_value_quote: "$0.91",
        gas_metadata: {
          contract_decimals: 18,
          contract_name: "Ether",
          contract_ticker_symbol: "ETH",
          contract_address: "0xeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeee",
          supports_erc: null,
          logo_url:
            "https://www.datocms-assets.com/86369/1670347457-optimism-icon-white.svg",
        },
        gas_offered: 30000,
        gas_spent: 30000,
        gas_price: 1500000050,
        fees_paid: "45000066879612",
        gas_quote: 0.08156676825561533,
        pretty_gas_quote: "$0.08",
        gas_quote_rate: 1812.594789704959,
      },
      {
        block_signed_at: "2023-08-07T10:39:38Z",
        block_height: 12988355,
        tx_hash:
          "0xf7574b8e2703b89287c4c037b0a7f274370e5da9dc38a6ac3e4d4814891d0605",
        tx_offset: 1,
        successful: true,
        from_address: "0xecb715b972de16d0074689ea39398e50095ba9e7",
        miner_address: "0x4200000000000000000000000000000000000011",
        from_address_label: null,
        to_address: "0xd8da6bf26964af9d7eed9e03e53415d37aa96045",
        to_address_label: null,
        value: "100000000000000",
        value_quote: 0.1812594789704959,
        pretty_value_quote: "$0.18",
        gas_metadata: {
          contract_decimals: 18,
          contract_name: "Ether",
          contract_ticker_symbol: "ETH",
          contract_address: "0xeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeee",
          supports_erc: null,
          logo_url:
            "https://www.datocms-assets.com/86369/1670347457-optimism-icon-white.svg",
        },
        gas_offered: 21000,
        gas_spent: 21000,
        gas_price: 1000000000,
        fees_paid: "21000013960992",
        gas_quote: 0.038064490583804136,
        pretty_gas_quote: "$0.04",
        gas_quote_rate: 1812.594789704959,
      },
      {
        block_signed_at: "2023-08-07T10:01:14Z",
        block_height: 12987203,
        tx_hash:
          "0x1a9e0c436d3afce7039f89fa91af9820cee8d44fdc6b1a215089a6e29edd2508",
        tx_offset: 2,
        successful: true,
        from_address: "0xd6015c64561d2296e3af872fce263b59f4a4d9de",
        miner_address: "0x4200000000000000000000000000000000000011",
        from_address_label: null,
        to_address: "0x4bfcf30c5120a20d200cb7671f0a99fca8160450",
        to_address_label: null,
        value: "0",
        value_quote: 0.0,
        pretty_value_quote: "$0.00",
        gas_metadata: {
          contract_decimals: 18,
          contract_name: "Ether",
          contract_ticker_symbol: "ETH",
          contract_address: "0xeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeee",
          supports_erc: null,
          logo_url:
            "https://www.datocms-assets.com/86369/1670347457-optimism-icon-white.svg",
        },
        gas_offered: 163430,
        gas_spent: 161371,
        gas_price: 1500000050,
        fees_paid: "242056602989750",
        gas_quote: 0.4387503653392301,
        pretty_gas_quote: "$0.44",
        gas_quote_rate: 1812.594789704959,
        log_events: [
          {
            block_signed_at: "2023-08-07T10:01:14Z",
            block_height: 12987203,
            tx_offset: 2,
            log_offset: 13,
            tx_hash:
              "0x1a9e0c436d3afce7039f89fa91af9820cee8d44fdc6b1a215089a6e29edd2508",
            raw_log_topics: [
              "0x2cebdf1cc706a50e1b28bf2fc5cfbd7204747a3b82439b85721a474df3a355a4",
              "0x9205789496f4f997ecc39b19fa77593cf6ddffdcdcdd172beac1b25dd0beedd0",
              "0x25c16599f3f52d2289ade5e1a91b83e237430ff8fcd094ca3923f4e8ea2cb2eb",
              "0x000000000000000000000000ecb715b972de16d0074689ea39398e50095ba9e7",
            ],
            sender_contract_decimals: null,
            sender_name: null,
            sender_contract_ticker_symbol: null,
            sender_address: "0x4bfcf30c5120a20d200cb7671f0a99fca8160450",
            sender_address_label: null,
            sender_logo_url:
              "https://logos.covalenthq.com/tokens/420/0x4bfcf30c5120a20d200cb7671f0a99fca8160450.png",
            raw_log_data:
              "0x00000000000000000000000000000000000000000000000000b1a2bc2ec50000",
            decoded: null,
          },
        ],
      },
    ],
  },
  error: false,
  error_message: null,
  error_code: null,
};
