export type JobRequirement = {
  query: string;
  numOfResults: number;
  requiredSkills: string[];
  experience: number;
  softSkills: string[];
  education: "All" | "Bachelor" | "Master" | "PhD" | "Diploma";
  languages: string[];
  location: "All" | "Remote" | "Physical";
};
