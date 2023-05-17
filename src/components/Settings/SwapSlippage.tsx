import useDebounce from "../../hooks/useDebounce";
import { useEffect, useState } from "react";
import { setSwapSlippage } from "../../state/quotesSlice";

// Components
import { Info } from "react-feather";
import { CustomInputBox } from "../common/CustomInput";
import { RadioCheckbox } from "../common/RadioCheckbox";
import { useDispatch, useSelector } from "react-redux";
import { DisclaimerBox } from "../common/DisclaimerBox";
import { SubTitle } from "./SubTitle";
import { Popover } from "../common/Popover";

export const SwapSlippage = () => {
  const [buttonInput, setButtonInput] = useState<number | null>(null);
  const [customInput, setCustomInput] = useState<string>("");
  const slippageValues = {
    1: 0.5,
    2: 1,
    3: 3,
  };
  const MIN_SLIPPAGE = 0;
  const MAX_SLIPPAGE = 50;

  const swapSlippage = useSelector((state: any) => state.quotes.swapSlippage);
  const dispatch = useDispatch();

  // if the swap slippage is one of the slippageValues, check the relevant checkbox,
  // else fill the custom input box
  useEffect(() => {
    if (Object.values(slippageValues).includes(swapSlippage)) {
      setButtonInput(swapSlippage);
    } else {
      setCustomInput(swapSlippage);
    }
  }, []);

  function handleButtonInput(value: number) {
    setCustomInput("");
    setButtonInput(value);
  }

  function handleCustomInput(value: string) {
    setButtonInput(null);
    let _value;
    if (Number(value) < 0) {
      _value = "0";
    } else if (value && value.indexOf(".") > -1) {
      // if it's a decimal value, restrict the deimal upto 3 places.
      if (value.split(".")[1].length <= 2) {
        _value = value;
      }
    } else _value = value;

    setCustomInput(_value ?? customInput);
  }

  //   For transition
  const [showLowSlippageDisclaimer, setShowLowSlippageDisclaimer] =
    useState<boolean>(false);
  const [showInputLimitDisclaimer, setInputLimitDisclaimer] =
    useState<boolean>(false);

  useDebounce(
    () => {
      if (customInput || buttonInput) {
        const _value = buttonInput ?? Number(customInput);
        // if value is within the range, dispatch it
        if (_value > MIN_SLIPPAGE && _value <= MAX_SLIPPAGE) {
          setInputLimitDisclaimer(false);
          dispatch(setSwapSlippage(_value));
          localStorage.setItem("swapSlippage", `${_value}`);

          // if value is between 0 and 1 (excluding 0), show the low slippage disclaimer
          setShowLowSlippageDisclaimer(_value > 0 && _value < 1);
        } else {
          setShowLowSlippageDisclaimer(false);
          setInputLimitDisclaimer(true);
        }
      }
    },
    300,
    [customInput, buttonInput]
  );

  return (
    <div className="bg-gray-900 rounded-2xl p-7">
      <div className="flex justify-between relative">
        <div className="skt-w flex items-center mb-1.5">
          <SubTitle>Swap Slippage</SubTitle>
          <Popover
            content="Your swap transaction will revert if the price changes unfavourably by more than this percentage."
            classNames="bg-gray-200 bottom-8 gray"
            cursor="cursor-help"
          >
            <Info className="ml-1.5 w-4 h-4 text-widget-secondary" />
          </Popover>
        </div>
        {/* {buttonInput || customInput ? (
          <span className="text-sm text-widget-secondary ml-3">
            Slippage: {buttonInput ?? customInput}%
          </span>
        ) : null} */}
      </div>
      <div className="flex -mx-1 justify-between mt-3">
        <RadioCheckbox
          id="swap-slippage-1"
          name="swap-slippage"
          label={`${slippageValues[1]}%`}
          checked={buttonInput === slippageValues[1]}
          onChange={() => handleButtonInput(slippageValues[1])}
        />
        <RadioCheckbox
          id="swap-slippage-2"
          name="swap-slippage"
          label={`${slippageValues[2]}%`}
          checked={buttonInput === slippageValues[2]}
          onChange={() => handleButtonInput(slippageValues[2])}
        />
        <RadioCheckbox
          id="swap-slippage-3"
          name="swap-slippage"
          label={`${slippageValues[3]}%`}
          checked={buttonInput === slippageValues[3]}
          onChange={() => handleButtonInput(slippageValues[3])}
        />
        <CustomInputBox
          value={customInput}
          onChange={(e) => handleCustomInput(e)}
        />
      </div>

      {showLowSlippageDisclaimer && (
        <p className="text-sm text-yellow-400 mb-0 mt-4 text-left">
          Transactions with extremely low slippage tolerance might be reverted
          because of very small market movement
          {/* <DisclaimerBox>
            Transactions with extremely low slippage tolerance might be reverted
            because of very small market movement
          </DisclaimerBox> */}
        </p>
      )}

      {/* Input off limit disclaimer */}
      {showInputLimitDisclaimer && (
        <p className="text-sm text-red-400 mb-0 mt-4 text-left">
          Please input a value greater than 0 and less than 50
        </p>
      )}
    </div>
  );
};
