import useClickOutside from "../../hooks/useClickOutside";
import { Network } from "../../types";
import { ReactNode, useContext, useState } from "react";
import { useEffect } from "react";
import { Check, ChevronDown } from "react-feather";
import { CustomizeContext } from "../../providers/CustomizeProvider";
import { SUPPORTED_BRIDGE_CHAINS } from "../../consts/index";

interface ChainDropdownProps {
  networks: Network[];
  activeNetworkId: number;
  onChange: (network: Network) => void;
}

function Option({
  network,
  children,
  onClick,
  isActiveNetwork = false,
  borderRadius = 1,
  onlyOneNetwork = false,
  selected,
}: {
  network: Network;
  children?: ReactNode;
  onClick?: () => void;
  isActiveNetwork?: boolean;
  borderRadius?: number;
  onlyOneNetwork?: boolean;
  selected?: boolean;
}) {
  return (
    <div
      className={`skt-w flex items-center cursor-pointer flex-shrink-0 ${
        selected
          ? ""
          : isActiveNetwork
          ? "px-4 py-2 bg-gray-900 hover:bg-gray-900 cursor-default"
          : "px-4 py-2 hover:bg-whiteAlpha-200"
      }`}
      onClick={onClick}
    >
      <div className="skt-w w-full flex justify-between items-center">
        <div className="flex items-center">
          <img
            src={network?.icon}
            className={`skt-w ${
              selected ? "h-5 w-5" : "h-6 w-6"
            } mr-1 rounded-lg`}
          />
          <span className="skt-w text-widget-primary mx-1">
            {network?.name}
          </span>
        </div>
        {isActiveNetwork && (
          <div>
            <Check className="w-4 h-4 text-primary-200" strokeWidth={2} />
          </div>
        )}
      </div>
      {selected && !onlyOneNetwork && (
        <ChevronDown className="skt-w text-widget-secondary w-4 h-4" />
      )}
      {children}
    </div>
  );
}

export function ChainSelect({
  networks,
  activeNetworkId,
  onChange,
}: ChainDropdownProps) {
  const [openDropdown, setOpenDropdown] = useState<boolean>(false);
  const chainDropdownRef = useClickOutside(() => setOpenDropdown(false));
  const [filteredNetworks, setFilteredNetworks] = useState<Network[]>(null);
  const activeNetwork = networks?.filter(
    (x: Network) => x?.chainId === activeNetworkId
  )[0];
  const customSettings = useContext(CustomizeContext);
  const { borderRadius } = customSettings.customization;

  useEffect(() => {
    setFilteredNetworks(
      networks?.filter((network) =>
        SUPPORTED_BRIDGE_CHAINS.includes(network.chainId)
      )
    );
  }, [networks]);

  return (
    <div
      onClick={
        filteredNetworks?.length === 0
          ? null
          : () => setOpenDropdown(!openDropdown)
      }
      className={`skt-w relative px-4 py-9px bg-gray-900 rounded-14px ${
        openDropdown ? "bg-widget-interactive h-auto" : ""
      }`}
      // style={{ borderRadius: `calc(0.5rem * ${borderRadius})` }}
      ref={chainDropdownRef}
    >
      {activeNetwork ? (
        <Option
          network={activeNetwork}
          borderRadius={borderRadius}
          onlyOneNetwork={networks?.length < 2}
          selected
        />
      ) : (
        <span
          className="skt-w text-sm text-widget-primary px-4 py-2"
          style={{ borderRadius: `calc(0.3rem * ${borderRadius})` }}
        >
          Loading chains
        </span>
      )}

      {openDropdown && (
        <div
          className="skt-w py-4 z-10 w-300 rounded-2xl left-0 top-10 absolute bg-gray-550 flex flex-col"
          style={{
            // borderBottomRightRadius: `calc(0.75rem * ${borderRadius})`,
            // borderBottomLeftRadius: `calc(0.75rem * ${borderRadius})`,
            boxShadow: "0px 6px 42px rgba(0, 0, 0, 0.8)",
          }}
        >
          {filteredNetworks?.map((network, index) => {
            return !!network ? (
              <Option
                network={network}
                key={`${index}-chain`}
                onClick={() => onChange(network)}
                borderRadius={borderRadius}
                isActiveNetwork={network?.chainId === activeNetworkId}
              />
            ) : null;
          })}
        </div>
      )}
    </div>
  );
}
