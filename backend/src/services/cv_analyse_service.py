import json
from pathlib import Path
from langchain_groq import ChatGroq
from langchain.prompts import PromptTemplate

from src import logger

from dotenv import load_dotenv

load_dotenv()  # Load environment variables from a .env file


async def analyse_cv_to_json(cv, job_req, prompt_file_path=Path("src/prompts/cv_analyse_prompt.txt"), max_attempts=3,
                           model="llama-3.1-8b-instant"):
    # Initialize Groq LLM with specified parameters
    llm = ChatGroq(
        model=model,
        temperature=0,
        max_tokens=None,
        timeout=None
    )

    # Load prompt template from file
    with open(prompt_file_path, "r") as file:
        prompt_template = file.read()

    # Construct the prompt with expected variable
    prompt = PromptTemplate(
        input_variables=["cv", "job_req"],
        template=prompt_template
    )

    # System instruction sets behavior expectations for the LLM
    system_prompt = """
    You are an expert information extractor trained to analyze resumes (CVs) and assess how well a candidate matches a given job description. 
    Strictly follow the format outlined in the provided prompt and do not include any extra commentary or explanations.
    """
    for attempt in range(max_attempts):
        try:
            messages = [
                ("system", system_prompt),
                ("human", prompt.format(cv=cv, job_req=job_req)),
            ]

            response = await llm.ainvoke(messages)

            # Parse the raw string response as JSON
            parsed_json = json.loads(response.content)

            return parsed_json

        except json.JSONDecodeError as e:
            logger.warning(f"Attempt {attempt + 1}: LLM output is not valid JSON. Retrying...: {e}")
        except Exception as e:

            logger.error(f"Unexpected error while parsing CV: {e}")
            break

    logger.error("Failed to parse a valid JSON from the CV after multiple attempts.")
    return None
