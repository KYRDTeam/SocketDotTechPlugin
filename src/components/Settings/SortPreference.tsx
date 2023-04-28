import { useState, useContext, ReactNode, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { ChevronDown } from "react-feather";

import { CustomizeContext } from "../../providers/CustomizeProvider";
import useClickOutside from "../../hooks/useClickOutside";
import { setSortPref } from "../../state/quotesSlice";
import { SubTitle } from "./SubTitle";

export const SortPreference = () => {
  const dispatch = useDispatch();
  const sortPrefFromStore = useSelector((state: any) => state.quotes.sortPref);
  const [_sortPref, _setSortPref] = useState<string>(sortPrefFromStore);
  const [dropdown, openDropdown] = useState<boolean>(false);
  const [label, setLabel] = useState<string>("");

  const dropdownRef = useClickOutside(() => openDropdown(false));

  const customSettings = useContext(CustomizeContext);
  const { borderRadius } = customSettings.customization;

  // Option Labels
  const LABEL_STATE = {
    OUTPUT: "High Return",
    TIME: "Fastest",
  };

  // Option Values
  const sortOptions = [
    { id: "output", label: LABEL_STATE.OUTPUT },
    { id: "time", label: LABEL_STATE.TIME },
  ];

  const handleChange = (item) => {
    _setSortPref(item.id);
    dispatch(setSortPref(item.id));
    setLabel(item.label);
    openDropdown(false);
  };

  useEffect(() => {
    setLabel(sortOptions.filter((x) => x.id === _sortPref)?.[0].label);
  }, []);

  return (
    <div className="mt-6 skt-w flex items-center relative z-30 justify-between bg-gray-900 rounded-2xl p-7">
      <SubTitle>Preferred Route</SubTitle>
      <div
        className="skt-w relative border border-gray-800 flex w-auto ml-2 rounded-xl"
        ref={dropdownRef}
      >
        <Option onClick={() => openDropdown(!dropdown)} active>
          {label}{" "}
          <ChevronDown
            className={`skt-w w-4 h-4 text-widget-secondary transition-all ${
              dropdown ? "rotate-180" : ""
            }`}
          />
        </Option>
        {dropdown && (
          <div
            className="skt-w absolute top-10 left-0 w-full overflow-hidden bg-gray-550 rounded-xl"
            style={{
              boxShadow: "0px 6px 42px rgba(0, 0, 0, 0.8)",
            }}
          >
            {sortOptions.map((x) => {
              return (
                <Option onClick={() => handleChange(x)} key={x.id}>
                  {x.label}
                </Option>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};

const Option = ({
  children,
  onClick,
  active = false,
}: {
  children: ReactNode;
  onClick: () => void;
  active?: boolean;
}) => {
  return (
    <button
      className={`skt-w skt-w-input skt-w-button w-32 px-2 py-2 text-widget-secondary text-sm flex items-center justify-between ${
        active
          ? "border border-gray-550 bg-gray-550 rounded-xl"
          : "hover:bg-whiteAlpha-100"
      }`}
      onClick={onClick}
    >
      {children}
    </button>
  );
};
