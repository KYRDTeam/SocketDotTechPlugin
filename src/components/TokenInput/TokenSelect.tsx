import { useAllTokenBalances } from "../../hooks/apis";
import { Currency } from "../../types";
import { useContext, useEffect, useMemo } from "react";
import { useState } from "react";
import { ChevronDown, Copy, ExternalLink } from "react-feather";
import { CustomizeContext } from "../../providers/CustomizeProvider";
import { Modal } from "../common/Modal";
import { SearchBar } from "./SearchBar";
import { ellipsis, compareAddressWeb3 } from "../../utils";
import { NATIVE_TOKEN_ADDRESS } from "@socket.tech/socket-v2-sdk/lib/src/constants";
import { useSelector } from "react-redux";
import CopyToClipboard from "../common/CopyToClipboard";
interface Props {
  activeToken: Currency;
  updateToken: (token: Currency) => void;
  tokens: Currency[];
  tokenToDisable?: Currency;
  chainId: number;
}

export const TokenSelect = (props: Props) => {
  const { activeToken, updateToken, tokens, tokenToDisable, chainId } = props;
  const [openTokenList, setOpenTokenList] = useState<boolean>(false);
  const [filteredTokens, setFilteredTokens] = useState(null);
  const [displayTokens, setDisplayTokens] = useState(null);
  const customSettings = useContext(CustomizeContext);
  const { borderRadius } = customSettings.customization;
  const allNetworks = useSelector((state: any) => state.networks.allNetworks);

  const currentNetwork = useMemo(() => {
    return allNetworks?.find((e) => e.chainId === chainId);
  }, [allNetworks, chainId]);

  // Hook that gives you all the balances for a user on all chains.
  const { data: tokensWithBalances } = useAllTokenBalances();

  function selectToken(token: Currency) {
    updateToken(token);
    setOpenTokenList(false);
  }

  function showBalance(token: Currency) {
    const _token = tokensWithBalances?.filter(
      (x) =>
        x.address.toLowerCase() === token.address.toLowerCase() &&
        x.chainId === token.chainId
    );
    if (_token?.[0]) {
      return _token[0].amount.toFixed(5);
    } else return "0";
  }

  // compare tokens with tokensWithBalances and return the tokens with balance
  function getTokenWithBalance(token: Currency) {
    const filteredTokens = tokensWithBalances?.filter(
      (x) =>
        x.address.toLowerCase() === token.address.toLowerCase() &&
        x.chainId === token.chainId
    );
    return filteredTokens?.length > 0;
  }

  useEffect(() => {
    // Filtering out tokens with balance
    const tokensWithBalance = tokens?.filter((token: Currency) =>
      getTokenWithBalance(token)
    );

    // Sorting the tokens as per amount
    const sortedTokens = tokensWithBalance?.sort((a, b) => {
      // corresponding tokens with balances
      const _tokenA = tokensWithBalances.filter(
        (x) => x.address === a.address
      )[0];
      const _tokenB = tokensWithBalances.filter(
        (x) => x.address === b.address
      )[0];

      return _tokenB?.amount - _tokenA?.amount;
    });

    // Filtering out tokens without balance
    const restTokens = tokens?.filter((x) => !sortedTokens?.includes(x));

    // Merging both the lists
    const _filteredTokens = sortedTokens &&
      restTokens && [...sortedTokens, ...restTokens];

    setFilteredTokens(_filteredTokens);
    setDisplayTokens(_filteredTokens);
  }, [tokens, tokensWithBalances]);

  const [searchInput, setSearchInput] = useState<string>("");

  function handleSearchInput(searchKeyword) {
    setSearchInput(searchKeyword);
  }

  useEffect(() => {
    const _filteredTokens = filteredTokens?.filter(
      (x: Currency) =>
        x?.symbol?.toLowerCase()?.includes(searchInput.toLowerCase()) ||
        x?.address?.toLowerCase() === searchInput.toLowerCase()
    );
    setDisplayTokens(_filteredTokens);
  }, [searchInput]);

  return (
    <div>
      {activeToken && (
        <button
          onClick={() => setOpenTokenList(!openTokenList)}
          className={`skt-w skt-w-input skt-w-button flex items-center flex-1 bg-widget-interactive flex-shrink-0 flex-nowrap w-auto overflow-hidden p-1 text-widget-on-interactive`}
          style={{ borderRadius: `calc(1rem * ${borderRadius})` }}
        >
          <img
            src={activeToken?.logoURI}
            className="skt-w h-28px w-28px rounded-full mr-1.5"
          />
          <div className="skt-w flex items-center">
            <span className="mr-0.5 text-lg">{activeToken?.symbol}</span>
            <ChevronDown className="skt-w w-4 h-4" />
          </div>
        </button>
      )}

      {openTokenList && (
        <Modal
          title="Select a token"
          closeModal={() => {
            setOpenTokenList(false);
            handleSearchInput("");
          }}
          classNames="p-0"
          style={{ display: openTokenList ? "block" : "none" }}
          noBorder
          noPadding
        >
          <div className="skt-w px-7 pt-2 mb-2">
            <SearchBar
              searchInput={searchInput}
              setSearchInput={setSearchInput}
              handleInput={(e) => handleSearchInput(e)}
            />
          </div>
          <div className="skt-w h-full overflow-y-auto ">
            {displayTokens?.map((token: Currency) => {
              const isNativeToken = compareAddressWeb3(
                token?.address,
                NATIVE_TOKEN_ADDRESS
              );
              return (
                <button
                  className="skt-w skt-w-input skt-w-button flex hover:bg-gray-800 items-center px-7 py-3 w-full justify-between disabled:opacity-30 disabled:pointer-events-none"
                  onClick={() => selectToken(token)}
                  key={token?.address}
                  disabled={tokenToDisable?.address === token?.address}
                >
                  <div className="skt-w flex items-center">
                    <img
                      src={token?.logoURI}
                      className="skt-w w-35 h-35 rounded-full"
                    />
                    <div className="skt-w items-start ml-2 text-widget-secondary">
                      <div
                        className="text-md mb-1 text-left"
                        title={token?.symbol}
                      >
                        {token?.name}
                      </div>
                      {isNativeToken && (
                        <div className="text-sm text-gray-400 mr-2">
                          {currentNetwork?.name} Native token
                        </div>
                      )}
                      {!isNativeToken && (
                        <div className="flex items-center">
                          <div className="text-sm text-gray-400 mr-2">
                            {ellipsis(token?.address, 7, 4)}
                          </div>
                          <CopyToClipboard value={token.address} />
                          <a
                            href={`${currentNetwork.explorers[0]}/token/${token.address}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="skt-w skt-w-anchor flex items-center hover:underline"
                          >
                            <ExternalLink className="w-4 h-4 text-gray-400 hover:text-primary-200" />
                          </a>
                        </div>
                      )}
                    </div>
                  </div>

                  <span className="skt-w text-widget-secondary text-sm text-right font-medium">
                    {showBalance(token)} {token.symbol}
                  </span>
                </button>
              );
            })}
          </div>
        </Modal>
      )}
    </div>
  );
};
