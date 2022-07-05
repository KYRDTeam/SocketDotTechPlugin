import { ChainId } from "socket-v2-sdk/lib/src/client/models/ChainId";
import { UserTxType } from "socket-v2-sdk/lib/src/client/models/UserTxType";

export interface WidgetProps {
  provider: any;
  API_KEY: string;

  // Chain Ids array
  sourceNetworks?: number[];
  destNetworks?: number[];

  // Chain Id
  defaultSourceNetwork?: number;
  defaultDestNetwork?: number;

  // Token address' array
  sourceTokens?: string[];
  destTokens?: string[];

  // Token address
  // Pass the string 'native' for native token
  defaultSourceToken?: string;
  defaultDestToken?: string;
  
  locale?: string; 
  customize?: Customize;
}

export interface Customize {
  // Width of the widget
  width?: number;

  // To make the widget responsive to the parent element.
  responsiveWidth?: boolean;

  // Border radius [0-1]
  borderRadius?: number;
}


export interface Network {
  chainId: number;
  currency: Currency;
  explorers: string[];
  icon: string;
  isL1: boolean;
  name: string;
  receivingEnabled: boolean;
  refuel: {
    sendingEnabled: boolean;
    receivingEnabled: boolean;
  };
  rpcs: string[];
  sendingEnabled: string;
}

export interface Currency {
  address: string;
  decimals: number;
  icon: string;
  minNativeCurrencyForGas?: string;
  name: string;
  symbol: string;
  chainId?: number;
  logoURI?: string;
  chainAgnosticId?: string | null;
}

export interface TokenWithBalance {
  chainId?: ChainId;
  tokenAddress?: string;
  userAddress?: string;
  balance?: string;
  decimals?: number;
  icon?: string;
  symbol?: string;
  name?: string;
}

export interface Route {
  routeId: string;
  fromAmount: string;
  chainGasBalances: any;
  minimumGasBalances: any;
  toAmount: string;
  userBridgeNames: Array<BridgeName>;
  totalUserTx: number;
  totalGasFeesInUsd: number;
  recipient: string;
  sender: string;
  userTxs: Array<UserTx>;
  serviceTime: number;
}

export interface UserTx {
  userTxType: UserTxType;
}

export interface BridgeName {
  name: string;
  icon?: string;
  serviceTime: number;
  displayName: string;
}
