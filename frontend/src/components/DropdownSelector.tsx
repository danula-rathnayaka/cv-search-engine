// DropdownSelector.tsx
import { dropdownArrow } from "@/assets";
import {
  DropdownMenu,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuContent,
} from "./ui/dropdown-menu";

type DropdownSelectorProps = {
  selected: number;
  onSelect: (value: number) => void;
};

const DropdownSelector = ({ selected, onSelect }: DropdownSelectorProps) => {
  return (
    <div className="w-25">
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <button className="w-full p-[5.5px] border rounded-md text-left flex gap-4">
            <div className="pl-3">{selected}</div>
            <img src={dropdownArrow} width={24} height={24} />
          </button>
        </DropdownMenuTrigger>

        <DropdownMenuContent className="rounded-md border">
          {[1, 2, 3, 4].map((num) => (
            <DropdownMenuItem key={num} onClick={() => onSelect(num)}>
              {num}
            </DropdownMenuItem>
          ))}
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
};

export default DropdownSelector;
