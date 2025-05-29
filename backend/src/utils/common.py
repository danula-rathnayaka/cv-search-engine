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
            "full_name": cv["full_name"],
            "current_title": cv["current_title"],
            "current_employer": cv["current_employer"],
            "years_of_experience": cv["years_of_experience"],
            "email": cv["contact_info"]["email"],
            "phone": cv["contact_info"]["phone"],
            "location": cv["contact_info"]["location"],
            "skills": cv["skills"],
            "work_experience": [{
                "job_title": exp["job_title"],
                "company": exp["company"],
                "summary": exp["summary"]
            } for exp in cv["work_experience"]]
        }
        cv_summaries.append(summary)

    return cv_summaries