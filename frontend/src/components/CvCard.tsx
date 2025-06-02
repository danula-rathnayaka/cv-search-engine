import React, { useState } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "./ui/card";
import { Button } from "./ui/button";
import type { CvType } from "@/types/cv";
import CandidateDetailsPopup from "./CandidateDetailsPopup";
import AnalyseCandidatePopup from "./AnalyseCandidatePopup";
import type { JobRequirement } from "@/types/JobRequirement";

const CvCard = ({
  cv,
  jobRequirement,
}: {
  cv: CvType;
  jobRequirement: JobRequirement;
}) => {
  const [showDetailsModal, setShowDetailsModal] = useState(false);
  const [showAnalyseModal, setShowAnalyseModal] = useState(false);

  return (
    <>
      <Card className="w-[300px] bg-neutral-800 text-white">
        <CardHeader>
          <CardTitle className="text-lg font-semibold">
            {cv.full_name.toUpperCase()}
          </CardTitle>
          <CardDescription className="text-sm">
            {cv.current_title} at {cv.current_employer}
          </CardDescription>
        </CardHeader>

        <CardContent className="space-y-4">
          <div className="text-sm text-neutral-300">
            <strong>Email:</strong> {cv.contact_info.email.toLocaleLowerCase()}
          </div>
          <div className="text-sm text-neutral-300">
            <strong>Phone:</strong> {cv.contact_info.phone}
          </div>
          <div className="text-sm text-neutral-300">
            <strong>Location:</strong> {cv.contact_info.location}
          </div>
          <div className="text-sm text-neutral-300">
            <strong>Experience:</strong> {cv.years_of_experience} years
          </div>
          <div className="text-sm text-neutral-300">
            <strong>Availability:</strong> {cv.availability}
          </div>
          <div className="text-sm text-neutral-300">
            <strong>Remote/Relocation:</strong> {cv.remote_or_relocation}
          </div>
        </CardContent>

        <CardFooter className="mt-auto justify-between">
          <Button
            className="w-28 opacity-80 hover:opacity-100"
            onClick={() => setShowDetailsModal(true)}
          >
            View Details
          </Button>
          <Button
            className="w-28 opacity-80 hover:opacity-100"
            onClick={() => setShowAnalyseModal(true)}
          >
            Analyse
          </Button>
        </CardFooter>
      </Card>

      {showDetailsModal && (
        <CandidateDetailsPopup
          cv={cv}
          onClose={() => setShowDetailsModal(false)}
        />
      )}
      {showAnalyseModal && (
        <AnalyseCandidatePopup
          cv={cv}
          jobRequirement={jobRequirement}
          onClose={() => setShowAnalyseModal(false)}
        />
      )}
    </>
  );
};

export default CvCard;
