from openai import OpenAI
import os
import anthropic
from dotenv import load_dotenv

load_dotenv()

PY_ENV = "prod"

open_ai_client = OpenAI(
    api_key=os.getenv("OPENAI_API_KEY"),
)

claude_anthropic_client = anthropic.Anthropic(api_key=os.getenv("ANTHROPICAI_API_KEY"))

src_dir_path = "./files/hellheadz/20240523_0-21"
thumbnails_dir_path = "./files/hellheadz/20240523_0-21/thumbnails"
watermarks_dir_path = "./files/hellheadz/20240523_0-21/watermarked"
token_uris_dir_path = "./files/hellheadz/20240523_0-21"

thumbnail_extension = "_thumbnail"

metadata_file_path = "metadata/hellheadz/20240523_metadata-batch-0-21.json"
metadata_ai_descriptions_file_name = "20240523_metadata-batch-0-21.json"

watermark_text = "LarsKristo"
author_text = "LarsKristo"
generic_description_text = "Larskristo Hellheadz"

token_uris_filename = f"{token_uris_dir_path}/20240523_token-uris-batch-0-21.json"

ipfs_gateway_url = "https://blockchainassetregistry.infura-ipfs.io/ipfs/"

# Get the values of projectId and projectSecret from the environment variables
infura_project_id = os.getenv("INFURA_PROJECT_ID")
infura_project_secret = os.getenv("INFURA_PROJECT_SECRET")
