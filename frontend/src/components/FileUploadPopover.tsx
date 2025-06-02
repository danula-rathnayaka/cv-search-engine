import React, { useState } from "react";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@radix-ui/react-popover";
import { Button } from "./ui/button";

const FileUploadPopover = () => {
  const [fileName, setFileName] = useState<string | null>("No file chosen");
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [isAddCv, setIsAddCv] = useState(false);
  const [isUploading, setIsUploading] = useState(false);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setSelectedFile(file);
      setFileName(file.name);
    }
  };

  const handleFileUpload = async () => {
    if (!selectedFile) {
      alert("Please choose a file before saving.");
      return;
    }

    setIsUploading(true);

    const formData = new FormData();
    formData.append("file", selectedFile);

    try {
      const response = await fetch("http://127.0.0.1:8000/upload_pdf", {
        method: "POST",
        body: formData,
      });

      if (!response.ok) {
        throw new Error("Upload failed");
      }

      alert("File uploaded successfully!");
    } catch (error) {
      console.error("Upload error:", error);
      alert("There was an error uploading your file.");
    } finally {
      setSelectedFile(null);
      setFileName("No file chosen");
    }
  };

  return (
    <Popover>
      <PopoverTrigger>
        <Button
          className="font-medium text-sm transition-all ease-in-out duration-300 flex text-center gap-2 h-10 w-35"
          onClick={() => setIsAddCv(!isAddCv)}
        >
          {isAddCv ? "Close" : "Upload CV"}
        </Button>
      </PopoverTrigger>

      <PopoverContent className="w-[450px] h-[250px] max-w-md bg-neutral-900 rounded-lg shadow-xl p-6 space-y-4 border-2 border-neutral-700">
        <h2 className="text-lg font-semibold text-white">Upload a CV</h2>
        <p className="text-sm text-gray-300">
          Choose a file from your device to upload.
        </p>

        <div className="flex items-center justify-center bg-neutral-800 border-2 border-neutral-700 p-4 rounded-md hover:border-blue-500 transition-all ease-in-out duration-300">
          <label
            htmlFor="cv-upload"
            className="cursor-pointer text-sm text-white hover:text-blue-500 transition-all duration-200"
          >
            <span className="mr-2">Choose File</span>
            <input
              id="cv-upload"
              type="file"
              className="hidden"
              onChange={handleFileChange}
            />
            <span className="text-sm text-gray-400">{fileName}</span>{" "}
          </label>
        </div>

        <div className="mt-4">
          <p className="text-xs text-gray-400">Accepted format: PDF</p>
        </div>

        <div className="flex gap-3 -mt-1 justify-end w-full">
          <Button
            className="h-[30px]"
            onClick={handleFileUpload}
            disabled={isUploading}
          >
            {isUploading ? "Saving..." : "Save"}
          </Button>
        </div>
      </PopoverContent>
    </Popover>
  );
};

export default FileUploadPopover;
