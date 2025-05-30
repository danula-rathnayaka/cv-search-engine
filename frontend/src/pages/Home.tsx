import { loading } from "@/assets";
import CvCard from "@/components/CvCard";
import DropdownSelector from "@/components/DropdownSelector";
import FileUploadPopover from "@/components/FileUploadPopover";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { useState } from "react";

const Home = () => {
  const [cvs, setCvs] = useState<any>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [query, setQuery] = useState("");
  const [numOfResults, setNumOfResults] = useState(3);

  const fetchCVs = async () => {
    if (query === "") {
      alert("Query can not be empty.");
      return;
    }

    setIsLoading(true);
    try {
      const response = await fetch(
        `http://127.0.0.1:8000/search_cv?query=${encodeURIComponent(
          query
        )}&num_of_results=${encodeURIComponent(numOfResults)}`
      );
      if (!response.ok) {
        throw new Error("Network response was not ok");
      }
      const data = await response.json();
      setCvs(data.results);

      console.log("Fetched CVs:", data.results);
    } catch (error) {
      console.error("Error fetching CVs:", error);
    } finally {
      setIsLoading(false);
    }
    try {
      await new Promise((resolve) => setTimeout(resolve, 1000));
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex flex-col items-center justify-center px-4">
      <FileUploadPopover />

      <div className="w-full max-w-md bg-neutral-900 rounded-lg shadow-md p-6 space-y-4 border-2">
        <h1 className="text-xl font-semibold text-gray-800 dark:text-white">
          Search CV
        </h1>
        <p className="text-sm text-gray-500 dark:text-gray-400">
          Enter the details below to search for candidates CVs.
        </p>

        <Textarea
          placeholder="e.g. React Developer"
          className="w-full"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
        />

        <div className="flex items-center gap-4">
          <Button className="w-75" onClick={() => fetchCVs()}>
            Find CVs
          </Button>{" "}
          <DropdownSelector
            selected={numOfResults}
            onSelect={setNumOfResults}
          />
        </div>
      </div>

      <div className="mt-5">
        {isLoading ? (
          <img
            src={loading}
            alt="loader"
            className="size-10 animate-spin mt-20"
          />
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mt-10 mb-10 px-4">
            {cvs.map((element: any, index: any) => (
              <CvCard key={index} cv={element} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Home;
