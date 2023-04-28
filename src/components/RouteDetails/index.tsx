import { useBalance, useRoutes } from "../../hooks/apis";
import { useDispatch, useSelector } from "react-redux";
import { useContext, useEffect, useMemo, useState } from "react";
import { ethers } from "ethers";

// actions
import { setSelectedRoute } from "../../state/selectedRouteSlice";
import { setBestRoute } from "../../state/quotesSlice";
import { setTxDetails } from "../../state/txDetails";

// components
import { ReviewModal } from "./ReviewModal";
import { Button } from "../common/Button";
import { Spinner } from "../common/Spinner";
import { InnerCard } from "../common/InnerCard";

import { Web3Context } from "../../providers/Web3Provider";
import {
  BRIDGE_DISPLAY_NAMES,
  QuoteStatus,
  ButtonTexts,
  NATIVE_TOKEN_ADDRESS,
} from "../../consts";
import { Info } from "react-feather";
import { formatCurrencyAmount } from "../../utils/";
import { SortOptions } from "@socket.tech/socket-v2-sdk";

export const RouteDetails = () => {
  const dispatch = useDispatch();

  const sourceChainId = useSelector(
    (state: any) => state.networks.sourceChainId
  );
  const sourceToken = useSelector((state: any) => state.tokens.sourceToken);
  const destToken = useSelector((state: any) => state.tokens.destToken);
  const sortPref = useSelector((state: any) => state.quotes.sortPref);
  const sourceAmount = useSelector((state: any) => state.amount.sourceAmount);
  const isTxModalOpen = useSelector((state: any) => state.modals.isTxModalOpen);
  const refuelEnabled = useSelector((state: any) => state.quotes.refuelEnabled);
  const includeBridges = useSelector(
    (state: any) => state.customSettings.includeBridges
  );
  const excludeBridges = useSelector(
    (state: any) => state.customSettings.excludeBridges
  );
  const isEnoughBalance = useSelector(
    (state: any) => state.amount.isEnoughBalance
  );
  const web3Context = useContext(Web3Context);
  const { userAddress } = web3Context.web3Provider;
  const singleTxOnly = useSelector((state: any) => state.quotes.singleTxOnly);
  const swapSlippage = useSelector((state: any) => state.quotes.swapSlippage);

  // Hook to fetch the quotes for given params.
  const { data, isQuotesLoading } = useRoutes(
    sourceToken ?? "",
    destToken,
    sourceAmount,
    sortPref,
    userAddress,
    refuelEnabled,
    includeBridges,
    excludeBridges,
    singleTxOnly,
    swapSlippage
  );

  // Boolean variable to fill all condition before the api call is made to fetch quotes.
  const shouldFetch = sourceAmount && sourceToken && destToken && sortPref;

  const bestRoute = useSelector((state: any) => state.quotes.bestRoute);
  const [isReviewOpen, setIsReviewOpen] = useState<boolean>(false);

  // Hook to get Balance for the native token.
  const { data: nativeTokenWithBalance } = useBalance(
    NATIVE_TOKEN_ADDRESS,
    sourceChainId,
    userAddress
  );

  // SetTxDetails from local storage to state
  useEffect(() => {
    if (localStorage) {
      const prevTxDetails = JSON.parse(localStorage.getItem("txData")) ?? {};
      dispatch(
        setTxDetails({
          prevTxDetails,
        })
      );
    }
  }, []);

  useEffect(() => {
    isTxModalOpen && setIsReviewOpen(false);
  }, [isTxModalOpen]);

  const [isNativeTokenEnough, setIsNativeTokenEnough] = useState(false);

  useEffect(() => {
    if (data) {
      // Reversing the order in case of sort-by-time because the API returns the list in descendind order of service time
      const bestRoute =
        sortPref === SortOptions.Time ? data.reverse()[0] : data[0];
      dispatch(setBestRoute(bestRoute));

      // Check if there is sufficient native token for refuel
      // If selected source token is same as native token, add the 2
      if (!!bestRoute?.refuel) {
        let nativeTokenRequired: string;
        const nativeTokenTransferAmount = bestRoute?.refuel?.fromAmount;

        if (sourceToken?.address === NATIVE_TOKEN_ADDRESS) {
          nativeTokenRequired = ethers.BigNumber.from(sourceAmount)
            .add(nativeTokenTransferAmount)
            .toString();
        } else {
          nativeTokenRequired = nativeTokenTransferAmount;
        }

        if (
          ethers.BigNumber.from(nativeTokenRequired).lte(
            nativeTokenWithBalance?.balance
          )
        ) {
          setIsNativeTokenEnough(true);
        } else setIsNativeTokenEnough(false);
      }
    } else {
      dispatch(setBestRoute(null));
    }
  }, [data]);

  function review() {
    dispatch(setSelectedRoute(bestRoute));
    setIsReviewOpen(true);
  }

  // Function that returns status once the fetching has started to get quotes.
  function quotesStatus() {
    const bridgeKey = bestRoute?.route?.usedBridgeNames?.[0];
    const bridgeName = BRIDGE_DISPLAY_NAMES[bridgeKey] || bridgeKey;

    // Checking for min native token requirement
    if (!!bestRoute?.refuel && !isNativeTokenEnough) {
      let minReq: string;

      // If selected source token is same as source native token, add the input amount with minimum tokens required for refuel
      // Else, show only the minimum amount required for refuel
      if (bestRoute?.path?.fromToken?.address === NATIVE_TOKEN_ADDRESS) {
        const inputAmount = bestRoute?.amount;
        const refuelAmount = bestRoute?.refuel?.fromAmount;
        const totalAmount = ethers.BigNumber.from(inputAmount)
          .add(ethers.BigNumber.from(refuelAmount))
          .toString();
        minReq = formatCurrencyAmount(
          totalAmount,
          bestRoute?.refuel?.fromAsset?.decimals,
          2
        );
      } else {
        minReq = formatCurrencyAmount(
          bestRoute?.refuel?.fromAmount,
          bestRoute?.refuel?.fromAsset?.decimals,
          2
        );
      }
      return `Not enough ${nativeTokenWithBalance?.symbol} for Refuel (${minReq} required)`;
    }

    const sourceAmount = formatCurrencyAmount(
      bestRoute?.route?.fromAmount,
      bestRoute?.path?.fromToken?.decimals
    );
    const destAmount = formatCurrencyAmount(
      bestRoute?.route?.toAmount,
      bestRoute?.path?.toToken?.decimals
    );
    const conversion = Number(destAmount) / Number(sourceAmount);
    const conversionMessage = `1 ${
      bestRoute?.path?.fromToken?.symbol
    } = ${conversion?.toFixed(4)} ${bestRoute?.path?.toToken?.symbol}`;

    return shouldFetch
      ? isQuotesLoading
        ? QuoteStatus.FETCHING_QUOTE
        : bestRoute
        ? bridgeName ?? conversionMessage
        : QuoteStatus.NO_ROUTES_AVAILABLE
      : QuoteStatus.ENTER_AMOUNT;
  }

  // Returns the text shown on the button depending on the status.
  const getButtonStatus = useMemo(() => {
    if (!sourceAmount || sourceAmount === "0") {
      return QuoteStatus.ENTER_AMOUNT;
    }
    if (isQuotesLoading) {
      return QuoteStatus.FETCHING_QUOTE;
    }
    if (!isEnoughBalance) {
      return ButtonTexts.NOT_ENOUGH_BALANCE;
    }
    return ButtonTexts.REVIEW_QUOTE;
  }, [sourceAmount, isEnoughBalance, isQuotesLoading]);

  return (
    <InnerCard classNames="bg-gray-700">
      {/* <div className="skt-w text-widget-secondary mb-3 text-sm flex items-center">
        {sourceAmount && sourceAmount !== "0" && isQuotesLoading ? (
          <span className="mr-1">
            <Spinner size={4} />
          </span>
        ) : !!bestRoute?.refuel && !isNativeTokenEnough ? (
          <Info className="w-4 h-4 mr-1" />
        ) : (
          ""
        )}
        {quotesStatus()}
      </div> */}
      <Button
        onClick={review}
        isLoading={sourceAmount && sourceAmount !== "0" && isQuotesLoading}
        disabled={
          !bestRoute ||
          isQuotesLoading ||
          !isEnoughBalance ||
          (bestRoute?.refuel && !isNativeTokenEnough)
        }
        classNames="bg-primary-200 h-11 text-md rounded-2xl text-gray-800 font-medium"
      >
        {getButtonStatus}
      </Button>
      {/* <div className="skt-w flex items-center justify-between text-widget-secondary mt-2.5 text-xs">
        <a
          href="http://socket.tech/"
          target="_blank"
          rel="noopener noreferrer"
          className="skt-w skt-w-anchor"
        >
          Powered by Socket
        </a>
        <a
          href="https://socketdottech.zendesk.com/hc/en-us"
          target="_blank"
          rel="noopener noreferrer"
          className="skt-w skt-w-anchor"
        >
          Support
        </a>
      </div> */}

      {isReviewOpen && (
        <ReviewModal
          closeModal={() => setIsReviewOpen(false)}
          style={{ display: isReviewOpen ? "block" : "none" }}
        />
      )}
    </InnerCard>
  );
};
