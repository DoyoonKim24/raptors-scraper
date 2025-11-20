import { useState, useRef, useEffect } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faChevronDown } from "@fortawesome/free-solid-svg-icons";
import { faX } from "@fortawesome/free-solid-svg-icons";
import type { MouseEvent, ChangeEvent } from "react";


interface DropdownProps {
  options?: string[];
  placeholder?: string;
  selected: string[];
  setSelected: (selected: string[] | string) => void;
}

export default function Dropdown({ options = [], placeholder, selected, setSelected }: DropdownProps) {
  const [open, setOpen] = useState<boolean>(false);
  const [query, setQuery] = useState<string>("");
  const inputRef = useRef<HTMLInputElement>(null);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Auto-focus input when dropdown opens
  useEffect(() => {
    const handleClickOutside = (event: globalThis.MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setOpen(false);
      }
    };
    if (open && inputRef.current) {
      inputRef.current.focus();
    }

    if (open) {
      document.addEventListener('mousedown', handleClickOutside);
      return () => document.removeEventListener('mousedown', handleClickOutside);
    }
  }, [open]);
  

  const filtered = options.filter((o) => {
    return typeof o === 'string' && o.toLowerCase().includes(query.toLowerCase());
  });

  return (
    <div ref={dropdownRef} className="relative flex flex-col h-full">
      <div
        tabIndex={0}
        onClick={() => setOpen(true)}
        className={`border border-[#440C0C] bg-[#581d1d20] rounded-md flex justify-between items-center cursor-pointer py-1 pl-3 pr-2 h-9.5 overflow-hidden
           ${open && "bg-hover"}`}
      >
        <div className="flex items-start gap-1 overflow-y-auto flex-1">
          {selected.length === 0 ? (
            <p> All Sections </p>
          ) : (
            <div className="flex gap-1">
              {selected.map((item, index) => (
                <div key={index} className="text-xs rounded-full flex bg-[#38354740] border border-[#2A1135] py-1 px-2 items-center gap-1 flex-shrink-0">
                  {item}
                  <FontAwesomeIcon 
                    icon={faX} 
                    className="cursor-pointer hover:text-black" 
                    onClick={(e: MouseEvent) => {
                      e.stopPropagation();
                      const newSelected = selected.filter((_, i) => i !== index);
                      setSelected(newSelected);
                    }}
                  />
                </div>
              ))}
            </div>
          )}
        </div>
        <hr className="bg-gray-100 h-5 w-[1px]" />
        <div 
          className={`pl-2`}
          onClick={(e: MouseEvent) => {
            e.stopPropagation();
            setOpen(!open);
          }}
        >
          <FontAwesomeIcon icon={faChevronDown} className="fa-sm" />
        </div>
      </div>
      {open && (
          <div className="absolute top-full border-2 border-[#440C0C] bg-[#351E1E90] rounded-md z-10 mt-2 w-full md:w-[16vw] md:min-w-[200px] overflow-hidden">
            <div className="overflow-y-auto flex flex-col max-h-160">
              {filtered.map((opt) => {
                const option = opt as string;
                const isSelected = selected.includes(option);
                return (
                  <div
                    key={option}
                    onClick={() => {
                      setQuery("");
                      if (!isSelected) {
                        setSelected([...selected, option]);
                      } else {
                        setSelected(selected.filter(item => item !== option));
                      }
                    }}
                    className={`cursor-pointer px-3 py-2 gap-1 flex flex-col text-wrap break-words hover:bg-[#37141480]
                      ${isSelected && 'bg-[#4C0000]'}`}
                  >
                    <p className="font-semibold text-blue">{option}</p>
                  </div>
                );
              })}
            </div>
          </div>
        )
      }
    </div>
  );
}
