def json_to_text(cv):
    text = (
        f"Name: {cv['full_name']}\n"
        f"Title: {cv['current_title']}\n"
        f"Current Employer: {cv['current_employer']}\n"
        f"Experience: {cv['years_of_experience']} years\n"
        f"Contact: {cv['contact_info']['email']}, {cv['contact_info']['phone']} - {cv['contact_info']['location']}\n"
        f"Availability: {cv['availability']}\n"
        f"Remote/Relocation: {cv['remote_or_relocation']}\n"
        f"Skills: {', '.join(cv['skills'])}\n"
        f"Certifications: {', '.join(cv['certifications'])}\n"
        f"Languages: {', '.join(cv['languages'])}\n\n"
        "Work Experience:\n"
    )

    text += "\n".join(
        f"- {exp['job_title']} at {exp['company']} ({exp['start_date']} - {exp['end_date']}): {exp['summary']}"
        for exp in cv['work_experience']
    )

    text += "\n\nEducation:\n" + "\n".join(
        f"- {edu['degree']} in {edu['field_of_study']}, {edu['institution']} ({edu['graduation_year']})"
        for edu in cv['education']
    )

    return text


def extract_from_json(results):
    cv_summaries = []
    for cv in results:
        summary = {
            "full_name": cv.get("full_name", ""),
            "current_title": cv.get("current_title", ""),
            "current_employer": cv.get("current_employer", ""),
            "years_of_experience": cv.get("years_of_experience", ""),
            "availability": cv.get("availability", ""),
            "remote_or_relocation": cv.get("remote_or_relocation", ""),
            "contact_info": {
                "email": cv.get("contact_info", {}).get("email", ""),
                "phone": cv.get("contact_info", {}).get("phone", ""),
                "location": cv.get("contact_info", {}).get("location", ""),
            },
            "skills": cv.get("skills", []),
            "certifications": cv.get("certifications", []),
            "languages": cv.get("languages", []),
            "work_experience": [
                {
                    "job_title": exp.get("job_title", ""),
                    "company": exp.get("company", ""),
                    "start_date": exp.get("start_date", ""),
                    "end_date": exp.get("end_date", ""),
                    "summary": exp.get("summary", ""),
                }
                for exp in cv.get("work_experience", [])
            ],
            "education": [
                {
                    "degree": edu.get("degree", ""),
                    "field_of_study": edu.get("field_of_study", ""),
                    "institution": edu.get("institution", ""),
                    "graduation_year": edu.get("graduation_year", ""),
                }
                for edu in cv.get("education", [])
            ],
        }
        cv_summaries.append(summary)
    return cv_summaries
