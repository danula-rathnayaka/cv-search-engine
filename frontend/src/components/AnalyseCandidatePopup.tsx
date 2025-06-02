import React, { useEffect, useState } from "react";
import { Button } from "./ui/button";
import type { CvType } from "@/types/cv";
import type { JobRequirement } from "@/types/JobRequirement";
import { loading } from "@/assets";

type AnalyseCandidatePopupProps = {
  cv: CvType;
  jobRequirement: JobRequirement;
  onClose: () => void;
};

const AnalyseCandidatePopup = ({
  cv,
  jobRequirement,
  onClose,
}: AnalyseCandidatePopupProps) => {
  const [isLoading, setIsLoading] = useState(true);
  const [fetchedData, setFetchedData] = useState<any>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Serialize cv and jobRequirement as strings
        const cvString = encodeURIComponent(JSON.stringify(cv));
        const jobReqString = encodeURIComponent(JSON.stringify(jobRequirement));

        const requestBody = `cv=${cvString}&jobRequirement=${jobReqString}`;

        const response = await fetch("http://127.0.0.1:8000/analyse_cv", {
          method: "POST",
          headers: {
            "Content-Type": "application/x-www-form-urlencoded",
          },
          body: requestBody,
        });

        if (!response.ok) {
          throw new Error("Network response was not ok");
        }

        const data = await response.json();
        setFetchedData(data.results);
        console.log("Fetched data:", data.results);
      } catch (error) {
        console.error("Error fetching data:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, []);

  if (isLoading) {
    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 p-6 overflow-auto">
        <div className="bg-neutral-900 text-gray-200 p-8 max-w-6xl w-full h-[90vh] shadow-xl border-2 border-neutral-700 rounded-md flex flex-col gap-12 overflow-hidden">
          <div className="flex justify-center mt-20">
            <img src={loading} alt="loader" className="size-10 animate-spin" />
          </div>
          <div className="flex justify-center mt-auto">
            <Button
              onClick={onClose}
              variant="outline"
              className="px-8 py-3 text-gray-300 hover:text-white hover:bg-neutral-800-700 transition-colors focus:outline-none focus:ring-2 focus:ring-gray-500 rounded border-2 border-neutral-700"
            >
              Close
            </Button>
          </div>
        </div>
      </div>
    );
  }

  if (!fetchedData) {
    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 p-6 overflow-auto">
        <div className="bg-neutral-900 text-gray-200 p-8 max-w-6xl w-full h-[90vh] shadow-xl border-2 border-neutral-700 rounded-md flex flex-col gap-12 overflow-hidden">
          <h2 className="text-3xl font-bold text-gray-300">
            No Data Available
          </h2>

          <div className="flex justify-center mt-auto">
            <Button
              onClick={onClose}
              variant="outline"
              className="px-8 py-3 text-gray-300 hover:text-white hover:bg-neutral-800-700 transition-colors focus:outline-none focus:ring-2 focus:ring-gray-500 rounded border-2 border-neutral-700"
            >
              Close
            </Button>
          </div>
        </div>
      </div>
    );
  }

  const {
    strong_areas,
    weak_areas,
    overall_quality_score,
    detailed_scoring,
    role_fit,
  } = fetchedData;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 p-6 overflow-auto">
      <div className="bg-neutral-900 text-gray-200 p-8 max-w-6xl w-full max-h-[90vh] shadow-xl border-2 border-neutral-700 rounded-md flex flex-col gap-12 overflow-hidden">
        {/* Main Content: two columns */}
        <div className="overflow-y-scroll">
          {/* Left Column */}
          <h2 className="text-3xl font-bold text-gray-300">
            Candidate Analysis
          </h2>

          <section className="mt-5">
            <div className="flex space-x-8">
              <div className="flex-1">
                <h3 className="text-xl font-semibold mb-4 text-gray-300">
                  Strong Areas
                </h3>
                <div className="space-y-4">
                  {strong_areas.map((area: any, index: any) => (
                    <div key={index}>
                      <h4 className="font-medium text-lg">
                        {area.skill_or_experience}
                      </h4>
                      <p className="text-sm text-gray-400">
                        Rating: {area.rating}
                      </p>
                      <p className="text-sm">{area.reason}</p>
                    </div>
                  ))}
                </div>
              </div>

              {/* Weak Areas Section */}
              <div className="flex-1">
                <h3 className="text-xl font-semibold mb-4 text-gray-300">
                  Weak Areas
                </h3>
                <div className="space-y-4">
                  {weak_areas.map((area: any, index: any) => (
                    <div key={index}>
                      <h4 className="font-medium text-lg">
                        {area.skill_or_experience}
                      </h4>
                      <p className="text-sm text-gray-400">
                        Rating: {area.rating}
                      </p>
                      <p className="text-sm">{area.reason}</p>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </section>

          <section className="mt-5">
            <h3 className="text-xl font-semibold mb-4 text-gray-300">
              Detailed Scoring
            </h3>

            <div className="overflow-x-auto">
              <table className="min-w-full text-gray-200 rounded-lg shadow-md">
                <thead>
                  <tr>
                    {Object.keys(detailed_scoring).map((key, index) => (
                      <th
                        key={index}
                        className="p-4 text-md text-center border-b border-gray-700"
                      >
                        {key.replace(/_/g, " ").toUpperCase()}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    {Object.entries(detailed_scoring).map(
                      ([key, value], index) => (
                        <td
                          key={index}
                          className="p-4 text-md text-gray-400 border-b border-gray-700 text-center"
                        >
                          {String(value)}
                        </td>
                      )
                    )}
                  </tr>
                </tbody>
              </table>
            </div>
          </section>

          <section className="mt-5">
            <h3 className="text-xl font-semibold mb-4 text-gray-300">
              Overall Quality Score - {overall_quality_score}
            </h3>
            <div>
              <p className="text-lg">{role_fit}</p>
            </div>
          </section>
        </div>

        {/* Close Button centered below */}
        <div className="flex justify-center">
          <Button
            onClick={onClose}
            variant="outline"
            className="px-8 py-3 text-gray-300 hover:text-white hover:bg-neutral-800-700 transition-colors focus:outline-none focus:ring-2 focus:ring-gray-500 rounded border-2 border-neutral-700"
          >
            Close
          </Button>
        </div>
      </div>
    </div>
  );
};

export default AnalyseCandidatePopup;
