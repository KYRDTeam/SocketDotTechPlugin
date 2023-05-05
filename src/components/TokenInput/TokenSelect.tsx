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
        x?.name?.toLowerCase()?.includes(searchInput.toLowerCase()) ||
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
            <span className="mr-0.5 text-lg font-semibold">
              {activeToken?.symbol}
            </span>
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
                  className="skt-w skt-w-input skt-w-button flex hover:bg-gray-800 items-center px-7 py-4 w-full justify-between disabled:opacity-30 disabled:pointer-events-none"
                  onClick={() => selectToken(token)}
                  key={token?.address}
                  disabled={tokenToDisable?.address === token?.address}
                >
                  <div className="skt-w flex items-center">
                    <img
                      src={token?.logoURI}
                      className="skt-w w-35 h-35 rounded-full"
                      onError={(e) => {
                        e.currentTarget.src =
                          "data:image/png;base64,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";
                      }}
                    />
                    <div className="skt-w items-start ml-2 text-widget-secondary">
                      <div
                        className="text-md mb-1 text-left"
                        title={token?.symbol}
                      >
                        {token?.name}
                      </div>
                      {isNativeToken && (
                        <div className="text-md text-gray-400 mr-2">
                          {currentNetwork?.name} Native token
                        </div>
                      )}
                      {!isNativeToken && (
                        <div className="flex items-center">
                          <div className="text-md text-gray-400 mr-2">
                            {ellipsis(token?.address, 7, 4)}
                          </div>
                          <CopyToClipboard value={token.address} />
                          <a
                            href={`${currentNetwork.explorers[0]}/token/${token.address}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            onClick={(e) => e.stopPropagation()}
                            className="skt-w skt-w-anchor flex items-center hover:underline"
                          >
                            <ExternalLink className="w-4 h-4 text-gray-400 hover:text-primary-200" />
                          </a>
                        </div>
                      )}
                    </div>
                  </div>

                  <span className="skt-w text-whiteAlpha-900 text-md text-right font-medium">
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
