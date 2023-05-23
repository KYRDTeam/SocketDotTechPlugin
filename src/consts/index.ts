import { constants } from "@socket.tech/ll-core";
export * from "./time";

// API-KEY needed for calling socket apis.
export const SOCKET_API_KEY = process.env.REACT_APP_SOCKET_API_KEY;

// SOCKET API URL
export const SOCKET_API = process.env.REACT_APP_SOCKET_API;

// Socket uses this address for native tokens. For example -> ETH on Ethereum, MATIC on Polygon, etc.
export const NATIVE_TOKEN_ADDRESS =
  "0xeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeee";

// Types of Txs possible in a route.
export enum UserTxType {
  FUND_MOVR = "fund-movr",
  DEX_SWAP = "dex-swap",
  APPROVE = "approve",
  CLAIM = "claim",
  SIGN = "sign",
}

// Labels for the tx types.
export const USER_TX_LABELS = {
  [UserTxType.APPROVE]: "Approve",
  [UserTxType.FUND_MOVR]: "Bridge",
  [UserTxType.DEX_SWAP]: "Swap",
  [UserTxType.CLAIM]: "Claim",
  [UserTxType.SIGN]: "Sign",
};

// Display Names for bridges.
export const BRIDGE_DISPLAY_NAMES = {
  [constants.bridges.PolygonBridge]: "Polygon",
  [constants.bridges.Hop]: "Hop",
  [constants.bridges.Across]: "Across",
  [constants.bridges.Hyphen]: "Hyphen",
  [constants.bridges.refuel]: "Refuel",
  [constants.bridges.AnySwapRouterV4]: "Multichain",
  [constants.bridges.Celer]: "Celer",
  [constants.bridges.ArbitrumBridge]: "Arbitrum",
  [constants.bridges.OptimismBridge]: "Optimism",
};

// Status of the prepare API.
export enum PrepareTxStatus {
  COMPLETED = "completed",
  PENDING = "pending",
  READY = "ready",
}

export enum QuoteStatus {
  FETCHING_QUOTE = "Fetching the best route...",
  NO_ROUTES_AVAILABLE = "No routing option found",
  ENTER_AMOUNT = "Enter an amount",
}

export enum ButtonTexts {
  NOT_ENOUGH_NATIVE_BALANCE = "Native token not enough",
  NOT_ENOUGH_BALANCE = "Insufficient balance",
  REVIEW_QUOTE = "Review Transfer",
  NO_ROUTES_AVAILABLE = "No routing option found",
  CHECKING_APPROVAL = "Checking approval",
  APPROVING = "Approving",
  APPROVE = "Approve",
  APPROVAL_DONE = "Approved",
  BRIDGE_IN_PROGRESS = "Bridging in progress",
  INITIATING = "Initiating...",
  IN_PROGRESS = "In progress",
  REFETCHING = "Refetching...",
}

export enum ChainId {
  MAINNET = 1,
  BSC = 56,
  POLYGON = 137,
  CRONOS = 25,
  FANTOM = 250,
  AVALANCHE = 43114,
  ARBITRUM = 42161,
  AURORA = 1313161554,
  KLAYTN = 8217,
  OPTIMISM = 10,
  SOLANA = 101,
  GOERLI = 5,
}

export const SUPPORTED_BRIDGE_CHAINS = [
  ChainId.MAINNET,
  ChainId.BSC,
  ChainId.POLYGON,
  ChainId.AVALANCHE,
  ChainId.CRONOS,
  ChainId.FANTOM,
  ChainId.ARBITRUM,
  ChainId.AURORA,
  ChainId.KLAYTN,
  ChainId.OPTIMISM,
];

export enum FormatterSupportedType {
  VALUE = "value",
  FEE = "fee",
  TVL = "tvl",
}
