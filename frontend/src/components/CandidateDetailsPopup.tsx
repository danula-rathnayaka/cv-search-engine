import type { CvType } from "@/types/cv";
import React from "react";
import { Button } from "./ui/button";

type CandidateDetailsPopupProps = {
  cv: CvType;
  onClose: () => void;
};

const CandidateDetailsPopup = ({ cv, onClose }: CandidateDetailsPopupProps) => {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 p-6 overflow-auto">
      <div className="bg-neutral-900 text-gray-200 p-8 max-w-6xl w-full max-h-[90vh] shadow-xl border-2 border-neutral-700 rounded-md flex flex-col gap-12 overflow-hidden">
        {/* Main Content: two columns */}
        <div className="flex gap-12 flex-1 overflow-hidden">
          {/* Left Column */}
          <div className="flex-1 flex flex-col space-y-6 overflow-y-auto pr-6 scrollbar scrollbar-thumb-gray-700 scrollbar-track-gray-900 scrollbar-thin">
            <h2 className="text-3xl font-bold truncate">{cv.full_name}</h2>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-8 gap-y-4 text-sm leading-relaxed">
              <p>
                <strong className="text-gray-300">Title:</strong>{" "}
                {cv.current_title}
              </p>
              <p>
                <strong className="text-gray-300">Employer:</strong>{" "}
                {cv.current_employer}
              </p>
              <p>
                <strong className="text-gray-300">Email:</strong>{" "}
                {cv.contact_info.email}
              </p>
              <p>
                <strong className="text-gray-300">Phone:</strong>{" "}
                {cv.contact_info.phone}
              </p>
              <p>
                <strong className="text-gray-300">Location:</strong>{" "}
                {cv.contact_info.location}
              </p>
              <p>
                <strong className="text-gray-300">Experience:</strong>{" "}
                {cv.years_of_experience} years
              </p>
              <p>
                <strong className="text-gray-300">Availability:</strong>{" "}
                {cv.availability}
              </p>
              <p>
                <strong className="text-gray-300">Remote/Relocation:</strong>{" "}
                {cv.remote_or_relocation}
              </p>
            </div>

            {cv.skills && (
              <section>
                <h3 className="text-lg font-semibold mb-2 text-gray-300">
                  Skills
                </h3>
                <p className="text-sm">{cv.skills.join(", ")}</p>
              </section>
            )}

            {cv.languages && (
              <section>
                <h3 className="text-lg font-semibold mb-2 text-gray-300">
                  Languages
                </h3>
                <p className="text-sm">{cv.languages.join(", ")}</p>
              </section>
            )}
          </div>

          {/* Right Column */}
          <div className="flex-1 flex flex-col space-y-6 overflow-y-auto pl-6 scrollbar scrollbar-thumb-gray-700 scrollbar-track-gray-900 scrollbar-thin">
            {cv.education && (
              <section>
                <h3 className="text-lg font-semibold mb-2 text-gray-300">
                  Education
                </h3>
                <ul className="list-disc ml-5 space-y-1 text-sm">
                  {cv.education.map((edu, i) => (
                    <li key={i}>
                      {edu.degree} in {edu.field_of_study} — {edu.institution} (
                      {edu.graduation_year})
                    </li>
                  ))}
                </ul>
              </section>
            )}

            {cv.certifications && (
              <section>
                <h3 className="text-lg font-semibold mb-2 text-gray-300">
                  Certifications
                </h3>
                <ul className="list-disc ml-5 space-y-1 text-sm">
                  {cv.certifications.map((cert, i) => (
                    <li key={i}>{cert}</li>
                  ))}
                </ul>
              </section>
            )}

            {cv.work_experience && (
              <section>
                <h3 className="text-lg font-semibold mb-2 text-gray-300">
                  Work Experience
                </h3>
                <ul className="list-disc ml-5 space-y-4 text-sm">
                  {cv.work_experience.map((job, i) => (
                    <li key={i}>
                      <p className="font-medium">
                        {job.job_title} at {job.company}
                      </p>
                      <p className="text-xs italic mb-1">
                        {job.start_date} – {job.end_date}
                      </p>
                      <p>{job.summary}</p>
                    </li>
                  ))}
                </ul>
              </section>
            )}
          </div>
        </div>

        {/* Close Button centered below */}
        <div className="flex justify-center mt-6">
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

export default CandidateDetailsPopup;
