import { formatCurrencyAmount } from "../../utils";
import { Spinner } from "./Spinner";
import { TokenBalanceReponseDTO } from "@socket.tech/socket-v2-sdk";
import WalletIcon from "../icons/WalletIcon";

export const Balance = ({
  token,
  isLoading,
  onClick,
}: {
  token: TokenBalanceReponseDTO["result"];
  isLoading: boolean;
  onClick?: () => void;
}) => {
  const _formattedBalance = formatCurrencyAmount(
    token?.balance,
    token?.decimals,
    5
  );
  return (
    <button
      disabled={!onClick}
      className={`skt-w font-semibold skt-w-input skt-w-button text-widget-primary text-opacity-70 text-sm text-right flex items-center transition-all ${
        onClick ? "" : ""
      }`}
      onClick={onClick}
    >
      <WalletIcon width="24px" height="24px" />
      <span className="mx-1 text-primary-200">
        {token && _formattedBalance} {token?.symbol}
      </span>
      {isLoading && <Spinner size={3} />}
    </button>
  );
};
