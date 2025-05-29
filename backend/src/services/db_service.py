import os

from pymongo.mongo_client import MongoClient
from pymongo.server_api import ServerApi

from dotenv import load_dotenv

from src import logger

load_dotenv()


class DbService:
    def __init__(self):
        """
        Initialize the MongoDB client, test the connection, and set the working collection.
        """
        uri = f"mongodb+srv://{os.environ.get('MONGO_DB_USERNAME')}:{os.environ.get('MONGO_DB_PASSWORD')}@cv-cluster.hqmsbvp.mongodb.net/?retryWrites=true&w=majority&appName=cv-cluster"

        # Create a new client and connect to the server
        client = MongoClient(uri, server_api=ServerApi('1'))

        # Send a ping to confirm a successful connection
        try:
            client.admin.command('ping')
            logger.info("Pinged your deployment. You successfully connected to MongoDB!")

            db = client["cv_db"]
            self.collection = db["candidates"]
        except Exception as e:
            logger.info("Error while connecting to the database")
            logger.info(e)

    def insert_candidate(self, candidate):
        """
        Insert multiple candidate documents.

        :param candidate: List of candidate dictionaries to insert
        :return: List of inserted candidate IDs
        """
        result = self.collection.insert_many(candidate)
        logger.info(f"Inserted {len(result.inserted_ids)} documents")
        return result.inserted_ids

    def insert_one_candidate(self, candidate):
        """
        Insert a single candidate document.

        :param candidate: Dictionary representing a candidate
        :return: Candidate ID
        """
        result = self.collection.insert_one(candidate)
        logger.info(f"Inserted document with id: {result.inserted_id}")
        return result.inserted_id

    def get_all_candidates(self):
        """
        Retrieve all candidate documents from the collection.

        :return: List of all candidates
        """
        return list(self.collection.find({}))

    def get_candidate_by_id(self, candidate_id):
        """
        Retrieve a candidate by its unique ID.

        :param candidate_id: ObjectId of the candidate
        :return: Candidate document or None
        """
        return self.collection.find_one({"_id": candidate_id})

    def find_candidates(self, query):
        """
        Find candidates matching a specific query.

        :param query: MongoDB query dict
        :return: List of matching candidate documents
        """
        return list(self.collection.find(query))

    def update_candidate(self, candidate_id, new_data):
        """
        Update a single candidate's information.

        :param candidate_id: ObjectId of the candidate
        :param new_data: Dictionary of fields to update
        """
        result = self.collection.update_one(
            {"_id": candidate_id},
            {"$set": new_data}
        )
        logger.info(f"Modified {result.modified_count} document(s)")

    def update_many_candidates(self, query, new_data):
        """
        Update multiple candidates matching the query.

        :param query: MongoDB filter query
        :param new_data: Dictionary of fields to update
        """
        result = self.collection.update_many(
            query,
            {"$set": new_data}
        )
        logger.info(f"Modified {result.modified_count} document(s)")

    def delete_candidate(self, candidate_id):
        """
        Delete a single candidate by ID.

        :param candidate_id: ObjectId of the candidate
        """
        result = self.collection.delete_one({"_id": candidate_id})
        logger.info(f"Deleted {result.deleted_count} document(s)")

    def delete_many_candidates(self, query):
        """
        Delete multiple candidates matching the query.

        :param query: MongoDB filter query
        """
        result = self.collection.delete_many(query)
        logger.info(f"Deleted {result.deleted_count} document(s)")

    def delete_all_candidates(self):
        """
        Delete all documents in the candidates collection.
        """
        result = self.collection.delete_many({})
        logger.info(f"Deleted {result.deleted_count} document(s)")

    def count_candidates(self, query=None):
        """
        Count the number of candidate documents matching the query.

        :param query: Optional filter query counts all if None
        :return: Integer count of documents
        """
        if query is None:
            query = {}
        return self.collection.count_documents(query)

    def add_or_update_embedding(self, candidate_id, embedding):
        """
        Add or update the vector embedding for a candidate.

        :param candidate_id: ObjectId of the candidate
        :param embedding: List or array representing the vector
        """
        self.collection.update_one(
            {"_id": candidate_id},
            {"$set": {"embedding": embedding}}
        )

    def vector_search(self, query_embedding, limit=5):
        """
        Perform a vector similarity search using MongoDB's $vectorSearch operator.

        :param query_embedding: Query embedding vector
        :param limit: Number of top results to return
        :return: List of candidate documents ranked by similarity
        """
        pipeline = [
            {
                "$vectorSearch": {
                    "index": "vector_index",
                    "path": "embedding",
                    "queryVector": query_embedding,
                    "numCandidates": 100,
                    "limit": limit
                }
            }
        ]
        return list(self.collection.aggregate(pipeline))
