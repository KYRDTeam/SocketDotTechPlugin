import { SetStateAction, useContext } from "react";
import { CustomizeContext } from "../../providers/CustomizeProvider";
import { Search, XCircle } from "react-feather";

interface SearchBarProps {
  handleInput: (e) => void;
  searchInput: string;
  setSearchInput: React.Dispatch<SetStateAction<string>>;
}

export const SearchBar = (props: SearchBarProps) => {
  const { handleInput, searchInput, setSearchInput } = props;
  const customSettings = useContext(CustomizeContext);
  const { borderRadius } = customSettings.customization;

  return (
    <div className="skt-w rounded-2xl flex items-center px-4 py-2 w-full bg-gray-800 text-widget-primary text-sm overflow-hidden focus-within:border-widget-secondary-text relative">
      <Search className="skt-w w-5 h-5 text-gray-400 mr-2" />
      <input
        onChange={(e) => handleInput(e.target.value)}
        placeholder="Find a token by name, symbol or address"
        className="stk-w skt-w-input w-full border-none py-2 pr-7 bg-gray-800 overflow-x-hidden overflow-ellipsis"
        role="search"
        value={searchInput}
        spellCheck={false}
      />

      {!!searchInput && (
        <XCircle
          className="skt-w bg-gray-800 w-5 h-5 text-widget-secondary hover:text-secondary absolute right-3 top-.25 cursor-pointer"
          onClick={() => {
            setSearchInput("");
            handleInput("");
          }}
        />
      )}
    </div>
  );
};
