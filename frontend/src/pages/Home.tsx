import { loading } from "@/assets";
import CvCard from "@/components/CvCard";
import DropdownSelector from "@/components/DropdownSelector";
import TagInput from "@/components/TagInput";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useState } from "react";

const Home = () => {
  const [cvs, setCvs] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [query, setQuery] = useState<string>("");
  const [numOfResults, setNumOfResults] = useState<number>(4);

  const [requiredSkills, setRequiredSkills] = useState<string[]>([]);
  const [softSkills, setSoftSkills] = useState<string[]>([]);
  const [languages, setLanguages] = useState<string[]>([]);
  const [experience, setExperience] = useState<string>("");
  const [education, setEducation] = useState<string>("");
  const [location, setLocation] = useState<string>("");

  const fetchCVs = async () => {
    if (query === "") {
      alert("Query can not be empty.");
      return;
    }

    setIsLoading(true);
    try {
      const params = new URLSearchParams();

      params.append("query", query);
      params.append("num_of_results", numOfResults.toString());

      if (requiredSkills.length > 0) {
        requiredSkills.forEach((skill) =>
          params.append("requiredSkills", skill)
        );
      }

      if (softSkills.length > 0) {
        softSkills.forEach((skill) => params.append("softSkills", skill));
      }

      if (languages.length > 0) {
        languages.forEach((language) => params.append("languages", language));
      }

      if (experience) params.append("experience", experience);
      if (education) params.append("education", education);
      if (location) params.append("location", location);

      const response = await fetch(
        `http://127.0.0.1:8000/search_cv?${params.toString()}`
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
    <div className="min-h-screen bg-neutral-950 flex flex-col items-center justify-start py-10 px-4">
      {/* Main Search Form Container */}
      <div className="w-full max-w-[75%] lg:max-w-5xl bg-neutral-900 rounded-xl shadow-xl p-8 border border-neutral-700">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* LEFT COLUMN */}
          <div className="flex flex-col h-full">
            <div>
              <h1 className="text-2xl font-semibold text-white mb-2">
                Search CV
              </h1>
              <p className="text-sm text-gray-400 mb-6">
                Enter the details to search for candidates' CVs.
              </p>
            </div>

            <Textarea
              placeholder="e.g. React Developer"
              className="w-full h-28 resize-none bg-neutral-800 text-white border border-neutral-700 rounded-md p-3 text-sm"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
            />

            <div className="flex items-center justify-between mt-4">
              <div className="flex items-center">
                <span className="text-white whitespace-nowrap mr-3">
                  Results:
                </span>
                <DropdownSelector<number>
                  selected={numOfResults}
                  onSelect={setNumOfResults}
                  options={[4, 8, 16, 20]}
                />
              </div>

              <Button className="px-10 py-5" onClick={fetchCVs}>
                Find CVs
              </Button>
            </div>
          </div>

          {/* RIGHT COLUMN */}
          <div className="mt-6">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="col-span-1 sm:col-span-2 flex gap-4">
                <div className="flex-[3]">
                  <TagInput
                    label="Required Skills"
                    tags={requiredSkills}
                    setTags={setRequiredSkills}
                    placeholder="e.g. JavaScript"
                  />
                </div>

                <div className="flex-[1]">
                  <label className="block text-sm text-gray-300 mb-1">
                    Experience (Years)
                  </label>
                  <Input
                    type="number"
                    value={experience}
                    onChange={(e) => setExperience(e.target.value)}
                    className="bg-neutral-800 text-white border border-neutral-700 rounded-md h-10 px-3 text-sm"
                    placeholder="e.g. 3"
                  />
                </div>
              </div>

              <div className="col-span-1 sm:col-span-2 flex gap-4">
                <div className="flex-[3]">
                  <TagInput
                    label="Soft Skills"
                    tags={softSkills}
                    setTags={setSoftSkills}
                    placeholder="e.g. Communication"
                  />
                </div>

                <div className="flex-[1]">
                  <label className="block text-sm text-gray-300 mb-1">
                    Education
                  </label>
                  <DropdownSelector<string>
                    selected={education}
                    onSelect={setEducation}
                    options={["All", "Bachelor", "Master", "PhD", "Diploma"]}
                  />
                </div>
              </div>

              <div className="col-span-1 sm:col-span-2 flex gap-4">
                <div className="flex-[3]">
                  <TagInput
                    label="Languages"
                    tags={languages}
                    setTags={setLanguages}
                    placeholder="e.g. English, Spanish"
                  />
                </div>

                <div className="flex-[1]">
                  <div>
                    <label className="block text-sm text-gray-300 mb-1">
                      Work Preference
                    </label>
                    <DropdownSelector<string>
                      selected={location}
                      onSelect={setLocation}
                      options={["All", "Remote", "Physical"]}
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* CV Cards Section */}
      <div className="w-full flex justify-center mt-10 px-4 -ml-32">
        <div className="w-full max-w-6xl">
          {isLoading ? (
            <div className="flex justify-center mt-20">
              <img
                src={loading}
                alt="loader"
                className="size-10 animate-spin"
              />
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 md:gap-8 lg:gap-40 mt-10 mb-10">
              {cvs.map((element: any, index: number) => (
                <CvCard
                  key={index}
                  cv={element}
                  jobRequirement={{
                    requiredSkills,
                    softSkills,
                    languages,
                    experience: experience ? parseInt(experience) : null,
                    education,
                    location,
                  }}
                />
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Home;
