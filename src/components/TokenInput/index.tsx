import { Currency } from "../../types";
import { TokenSelect } from "./TokenSelect2";
import { TokenChipPlaceholder } from "../common/TokenChipPlaceholder";
import { RefuelAmount } from "./RefuelAmount";

interface TokenInputProps {
  amount: string;
  onChangeInput?: (input: string) => void;
  updateToken: (token: Currency) => void;
  source?: boolean;
  activeToken?: Currency;
  tokens: Currency[];
  noTokens: boolean;
  tokenToDisable?: Currency;
  chainId: number;
}

export const TokenInput = (props: TokenInputProps) => {
  const {
    amount,
    onChangeInput,
    updateToken,
    source = false,
    activeToken,
    tokens,
    noTokens = false,
    tokenToDisable,
    chainId,
  } = props;
  return (
    <div className="skt-w flex items-center justify-between mt-2.5 overflow-hidden pb-[1.125rem]">
      {noTokens ? (
        <TokenChipPlaceholder>No Tokens</TokenChipPlaceholder>
      ) : (
        <TokenSelect
          updateToken={updateToken}
          activeToken={activeToken}
          tokens={tokens}
          tokenToDisable={tokenToDisable}
          chainId={chainId}
        />
      )}
      <div className="skt-w flex flex-1">
        <div className="stk-w flex flex-1 flex-col relative">
          <input
            className={`skt-w skt-w-input text-right text-widget-primary text-2xl focus:outline-none w-full h-full overflow-ellipsis bg-transparent`}
            value={amount}
            onChange={(e) => onChangeInput(e.target.value)}
            placeholder="0.0"
            type={source ? "number" : "string"}
            onWheel={(e) => (document.activeElement as HTMLElement).blur()}
            inputMode="decimal"
            readOnly={!source}
          />
          <RefuelAmount src={source} />
        </div>
      </div>
    </div>
  );
};
