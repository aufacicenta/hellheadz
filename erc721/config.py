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

src_dir_path = "./files/hellheadz/20240723_22-44"
originals_dir_path = f"{src_dir_path}/originals"
thumbnails_dir_path = f"{src_dir_path}/thumbnails"
websize_dir_path = f"{src_dir_path}/websize"
watermarks_dir_path = f"{src_dir_path}/watermarked"
token_uris_dir_path = f"{src_dir_path}"

thumbnail_extension = "_thumbnail"

metadata_file_path = "metadata/hellheadz/20240723_metadata-batch-22-44.json"
metadata_ai_descriptions_file_name = "20240723_metadata-batch-22-44.json"

watermark_text = "LarsKristo"
author_text = "LarsKristo"
generic_description_text = "Larskristo Hellheadz"

token_uris_filename = f"{token_uris_dir_path}/20240723_token-uris-batch-22-44.json"

ipfs_gateway_url = "https://blockchainassetregistry.infura-ipfs.io/ipfs/"

# Get the values of projectId and projectSecret from the environment variables
infura_project_id = os.getenv("INFURA_PROJECT_ID")
infura_project_secret = os.getenv("INFURA_PROJECT_SECRET")
