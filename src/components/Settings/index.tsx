import { setIsSettingsModalOpen } from "../../state/modals";
import { useDispatch } from "react-redux";
// import { Settings as SettingsIcon } from "react-feather";
// import { Sliders as SettingsIcon } from "react-feather";
import SettingIcons from "../icons/SettingIcon";

// Component that lets you set the parameters for fetching quotes or building a transaction.
export const Settings = () => {
  const dispatch = useDispatch();

  const toggleSettingsModal = (value: boolean) => {
    dispatch(setIsSettingsModalOpen(value));
  };

  return (
    <>
      <button
        onClick={() => toggleSettingsModal(true)}
        className="skt-w skt-w-button skt-w-input flex ml-3 p-2 rounded-full text-gray-200 hover:text-primary-200"
        style={{
          backgroundColor: "#010101",
        }}
      >
        <SettingIcons />
      </button>
    </>
  );
};
