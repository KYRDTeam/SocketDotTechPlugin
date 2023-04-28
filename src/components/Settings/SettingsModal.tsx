import { useDispatch, useSelector } from "react-redux";
import { setIsSettingsModalOpen } from "../../state/modals";

// components
import { Modal } from "../common/Modal";
import { SwapSlippage } from "./SwapSlippage";
import { SortPreference } from "./SortPreference";
import { SingleTx } from "./SingleTx";

export const SettingsModal = () => {
  const dispatch = useDispatch();

  const isSettingsOpen = useSelector(
    (state: any) => state.modals.isSettingsModalOpen
  );

  const toggleSettingsModal = (value: boolean) => {
    dispatch(setIsSettingsModalOpen(value));
  };

  return (
    <>
      {isSettingsOpen && (
        <Modal
          title="Settings"
          closeModal={() => toggleSettingsModal(false)}
          style={{ display: isSettingsOpen ? "block" : "none" }}
          classNames="z-50"
          noBorder
          typeHeader="center"
        >
          <div className="skt-w px-3 pt-3">
            {/* Sort options */}
            <SortPreference />

            {/* Single tx checkbox */}
            {/* <SingleTx /> */}

            {/* Swap Slippage */}
            <SwapSlippage />
          </div>
        </Modal>
      )}
    </>
  );
};
