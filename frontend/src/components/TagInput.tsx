import React, { useState } from "react";
import type { ChangeEvent, KeyboardEvent } from "react";

interface TagInputProps {
  label?: string;
  tags: string[];
  setTags: (tags: string[]) => void;
  placeholder?: string;
}

const TagInput: React.FC<TagInputProps> = ({
  label,
  tags,
  setTags,
  placeholder,
}) => {
  const [input, setInput] = useState<string>("");

  const addTag = () => {
    const trimmed = input.trim();
    if (trimmed && !tags.includes(trimmed)) {
      setTags([...tags, trimmed]);
      setInput("");
    }
  };

  const removeTag = (index: number) => {
    setTags(tags.filter((_, i) => i !== index));
  };

  const handleKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      e.preventDefault();
      addTag();
    }
  };

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    setInput(e.target.value);
  };

  return (
    <div>
      {label && (
        <label className="block text-sm mb-1 text-white">{label}</label>
      )}
      <div className="flex flex-wrap gap-2 p-2 border rounded-md bg-neutral-800 border-neutral-700">
        {tags.map((tag, index) => (
          <div
            key={index}
            className="bg-neutral-300 text-black px-2 rounded flex items-center"
          >
            {tag}
            <button
              type="button"
              className="ml-2 text-black focus:outline-none"
              onClick={() => removeTag(index)}
            >
              ×
            </button>
          </div>
        ))}
        <input
          value={input}
          onChange={handleChange}
          onKeyDown={handleKeyDown}
          className="bg-transparent text-white outline-none flex-1 min-w-[120px]"
          placeholder={tags.length === 0 ? placeholder : ""}
        />
      </div>
    </div>
  );
};

export default TagInput;
