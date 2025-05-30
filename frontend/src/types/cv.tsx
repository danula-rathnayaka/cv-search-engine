export type CvType = {
  full_name: string;
  current_title: string;
  current_employer: string;
  contact_info: {
    email: string;
    phone: string;
    location: string;
  };
  years_of_experience: number | string;
  availability: string;
  remote_or_relocation: string;
  education?: {
    degree: string;
    field_of_study: string;
    institution: string;
    graduation_year: string;
  }[];
  skills?: string[];
  certifications?: string[];
  languages?: string[];
  work_experience?: {
    job_title: string;
    company: string;
    start_date: string;
    end_date: string;
    summary: string;
  }[];
};
