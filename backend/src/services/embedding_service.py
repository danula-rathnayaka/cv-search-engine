from langchain_huggingface import HuggingFaceEmbeddings

from backend.src import logger


def get_embedding(query, model_name="BAAI/bge-base-en-v1.5"):
    """
    Generates a normalized embedding vector for a given text query using a specified Hugging Face model.

    :param query: String, the input text to be embedded.
    :param model_name: String, Optional, Hugging Face model to use for embedding. Default "BAAI/bge-base-en-v1.5".

    :return list: A list of float values representing the normalized embedding vector.
    """
    try:
        # Initialize the HuggingFaceEmbeddings model with normalization enabled
        embedding_model = HuggingFaceEmbeddings(
            model_name=model_name,
            encode_kwargs={'normalize_embeddings': True}
        )

        # Generate the embedding for the input query
        embedding = embedding_model.embed_query(query)

        logger.info(f"Successfully generated embedding for query: '{query[:15]}...' using model: '{model_name}'")
        return embedding

    except Exception:
        logger.error(f"Error generating embedding for query: '{query[:15]}' with model: '{model_name}'")
        raise
