import { dropdownArrow } from "@/assets";
import {
  DropdownMenu,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuContent,
} from "./ui/dropdown-menu";

type DropdownSelectorProps<T> = {
  selected: T;
  onSelect: (value: T) => void;
  options: T[];
  className?: string;
};

const DropdownSelector = <T extends string | number>({
  selected,
  onSelect,
  options,
  className = "",
}: DropdownSelectorProps<T>) => {
  return (
    <div className={`w-full ${className}`}>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <button className="w-full py-2.5 px-3 border rounded-md text-left flex justify-between items-center bg-neutral-800 text-white text-sm">
            <span className="mr-3">{selected || "Select"}</span>
            <img src={dropdownArrow} alt="dropdown" width={18} height={18} />
          </button>
        </DropdownMenuTrigger>

        <DropdownMenuContent className="rounded-md border bg-neutral-800 text-white text-sm">
          {options.map((option) => (
            <DropdownMenuItem
              key={option.toString()}
              onClick={() => onSelect(option)}
              className="cursor-pointer hover:bg-neutral-700 px-3 py-1"
            >
              {option}
            </DropdownMenuItem>
          ))}
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
};

export default DropdownSelector;
