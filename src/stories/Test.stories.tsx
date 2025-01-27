import { Bridge } from "../index";
import { useEffect, useState } from "react";
import { SOCKET_API_KEY } from "../consts";
import { ethers } from "ethers";
import { transactionDetails, WidgetProps } from "../types";

enum FormatterSupportedType {
  VALUE = "value",
  FEE = "fee",
}

type fmOptionsType = {
  targetCurrency?: string;
  formatType?: FormatterSupportedType;
  format?: (value: string) => string;
};
declare global {
  interface Window {
    ethereum: any;
  }
}

export default {
  title: "Bridge",
  component: Bridge,
};

const Template = (args: WidgetProps) => {
  const [provider, setProvider] = useState<any>();
  const [userAddress, setUserAddress] = useState<string>();
  const [chain, setChain] = useState<number>();
  const [currentChain, setCurrentChain] = useState(56);
  const [tab, setTab] = useState("tab1");
  const fetchWalletData = async () => {
    const provider = new ethers.providers.Web3Provider(window.ethereum, "any");

    const signer = await provider.getSigner();
    const userAddress = await signer.getAddress();
    const chain = await signer.getChainId();

    if (provider) {
      setProvider(provider);
      setUserAddress(userAddress);
      setChain(chain);
    }
  };

  const connectWallet = async () => {
    try {
      if (window.ethereum) {
        const provider = new ethers.providers.Web3Provider(
          window.ethereum,
          "any"
        );
        await provider.send("eth_requestAccounts", []);
        const signer = await provider.getSigner();
        const userAddress = await signer.getAddress();
        const chain = await signer.getChainId();
        setProvider(provider);
        setUserAddress(userAddress);
        setChain(chain);
      } else {
        alert("Web3 wallet not detected");
      }
    } catch (e) {
      alert("Error in connecting wallet");
      console.log(e);
    }
  };

  useEffect(() => {
    if (window.ethereum) {
      fetchWalletData();

      window.ethereum.on("chainChanged", () => {
        fetchWalletData();
      });

      window.ethereum.on("accountsChanged", () => {
        fetchWalletData();
      });
    }
  }, [window.ethereum]);

  const handleDisplayValue = (
    value: number | string,
    options?: fmOptionsType
  ) => {
    console.log({ value });
    return `${value}BTC`;
  };

  return (
    <div
      className="skt-w bg-gray-900 p-10 text-white-900"
      style={{ height: "calc(100vh - 40px)" }}
    >
      <p>
        User Address : {userAddress}
        <br />
        ChainId: {chain}
      </p>

      <div style={{ marginBottom: "30px" }}>
        {!userAddress && (
          <button
            onClick={connectWallet}
            style={{
              backgroundColor: "white",
              borderRadius: "5px",
              padding: "5px 12px",
            }}
          >
            Connect Wallet
          </button>
        )}
      </div>
      <div>
        <div onClick={() => setTab("tab1")}>tab1</div>
        <div onClick={() => setTab("tab2")}>tab2</div>
      </div>

      {tab === "tab2" && (
        <div>
          <select
            name="Select network"
            id="cars"
            value={currentChain}
            onChange={(e: any) => {
              setCurrentChain(e.target.value);
            }}
          >
            <option value={1}>Ethereum</option>
            <option value={137}>Polygon</option>
            <option value={56}>BSC</option>
            <option value={250}>Fantom</option>
          </select>
        </div>
      )}

      {tab === "tab1" && (
        <>
          <Bridge
            {...args}
            handleDisplayValue={handleDisplayValue}
            provider={provider}
            // defaultSourceNetwork={+currentChain}
            onSourceNetworkChange={(network: any) => {
              const inputChainId = Number(network?.chainId);
              if (!network.chainId) return;
              if (+currentChain === inputChainId) return;

              setCurrentChain(inputChainId);
            }}
          />
        </>
      )}
    </div>
  );
};

const Customize = {
  secondary: "rgb(68,69,79)",
  primary: "rgb(31,34,44)",
  accent: "rgb(131,249,151)",
  onAccent: "rgb(0,0,0)",
  interactive: "rgb(0,0,0)",
  onInteractive: "rgb(240,240,240)",
  text: "rgb(255,255,255)",
  secondaryText: "rgb(200,200,200)",
  // fontFamily: '"Comic Sans MS", cursive'
  // width: 400
};

function showAlert(value) {
  console.log("showing alert", value);
}

const UNISWAP_DEFAULT_LIST = "https://gateway.ipfs.io/ipns/tokens.uniswap.org";
const displayName = <span style={{ color: "red" }}>Salil</span>;

export const Default = Template.bind({});
Default.args = {
  API_KEY: SOCKET_API_KEY,
  customize: Customize,
  enableSameChainSwaps: true,
  // title: [displayName],
  // includeBridges: ['hyphen'],
  // singleTxOnly: true,
  // excludeBridges: ['hop', 'polygon-bridge'],
  enableRefuel: true,
  // onBridgeSuccess: showAlert,
  // onSourceTokenChange: (value) => console.log('Source Token:', value),
  onSourceNetworkChange: (value) => console.log("Source Network:", value),
  // onDestinationTokenChange: (value) => console.log('Dest Token:', value),
  // onDestinationNetworkChange: (value) => console.log('Dest Network:', value),
  // onError: (value) => console.log('Error', value),
  // onSubmit: (value: transactionDetails) => console.log('Submitted: ', value, value?.txData?.[0]?.chainId),

  // tokenList: MY_LIST,
  // tokenList: UNISWAP_DEFAULT_LIST,
  destNetworks: [
    1, 56, 137, 25, 250, 43114, 42161, 1313161554, 8217, 101, 10, 5,
  ],
  sourceNetworks: [
    1, 56, 137, 25, 250, 43114, 42161, 1313161554, 8217, 101, 10, 5,
  ],

  defaultSourceNetwork: 137,
  defaultDestNetwork: 56,
  defaultSourceToken: "0xc2132d05d31c914a87c6611c10748aeb04b58e8f", // usdt
  defaultDestToken: "0x55d398326f99059ff775485246999027b3197955",
  // defaultDestToken: "0x8c6f28f2F1A3C87F0f938b96d27520d9751ec8d9",
  // defaultSourceToken: "0xeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeee",
  // defaultDestToken: "0xbe662058e00849C3Eef2AC9664f37fEfdF2cdbFE",
  // defaultDestToken: "0xeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeee",
  // defaultDestToken: "0x8c6f28f2f1a3c87f0f938b96d27520d9751ec8d9",
};
