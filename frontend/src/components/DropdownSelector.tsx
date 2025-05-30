import { dropdownArrow } from "@/assets";
import {
  DropdownMenu,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuContent, // Import DropdownMenuContent
} from "./ui/dropdown-menu";
import { useState } from "react";

const DropdownSelector = () => {
  const [selected, setSelected] = useState<number>(3);

  const handleSelect = (value: number) => {
    setSelected(value);
  };

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
          <DropdownMenuItem onClick={() => handleSelect(1)}>1</DropdownMenuItem>
          <DropdownMenuItem onClick={() => handleSelect(2)}>2</DropdownMenuItem>
          <DropdownMenuItem onClick={() => handleSelect(3)}>3</DropdownMenuItem>
          <DropdownMenuItem onClick={() => handleSelect(4)}>4</DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
};

export default DropdownSelector;
