import base64
import os
import json
from openai import OpenAI
import requests
from dotenv import load_dotenv
from PIL import Image
from PIL import ImageFont
from PIL import ImageDraw
import re

PY_ENV = "prod"

# Load the environment variables from the .env file
load_dotenv()

open_ai_client = OpenAI(
    api_key=os.getenv("OPENAI_API_KEY"),
)

src_dir_path = "./files/svpervnder"
watermarks_dir_path = "./files/svpervnder"
thumbnail_extension = "_thumbnail"
metadata_file_name = "metadata-svpervnder.json"
watermark_text = "@svpervnder"
generic_description_text = "The svpervnder trademark logo NFT"

ipfs_gateway_url = "https://blockchainassetregistry.infura-ipfs.io/ipfs/"

# Get the values of projectId and projectSecret from the environment variables
infura_project_id = os.getenv("INFURA_PROJECT_ID")
infura_project_secret = os.getenv("INFURA_PROJECT_SECRET")


def create_token_uri_from_metadata_object():
    # Read the metadata from the JSON file
    with open(metadata_file_name, "r") as f:
        metadata_list = json.load(f)

    # Loop through each metadata object
    for metadata in metadata_list:
        # Create a temporary JSON file for the metadata object
        temp_file_path = "./temp_metadata.json"
        with open(temp_file_path, "w") as temp_file:
            json.dump(metadata, temp_file)

        # Upload the temporary JSON file to IPFS
        token_uri = upload_file_to_ipfs(temp_file_path)
        print(f"create_token_uri_from_metadata_object.token_uri: {token_uri}")

        with open("tokenURIs.txt", "a") as f:
            # Write the token URI to a text file
            f.write(f"\n{token_uri}")
            f.close()

        # Remove the temporary JSON file
        os.remove(temp_file_path)


def encode_image(image_path):
    with open(image_path, "rb") as image_file:
        return base64.b64encode(image_file.read()).decode("utf-8")


def create_img_thumbnails():
    # Loop through each file in the directory
    for filename in os.listdir(src_dir_path):
        # Check if the file is an image file
        if filename.lower().endswith(".png") or filename.lower().endswith(".jpg"):
            # Open an image file
            file_path = os.path.join(src_dir_path, filename)
            with Image.open(file_path) as img:
                # Specify the size of the thumbnail
                size = (187, 187)
                img.thumbnail(size)
                # get the file extension
                file_extension = filename.split(".")[-1]
                # change the file name to include _thumbnail
                filename = (
                    filename.split(".")[0] + thumbnail_extension + "." + file_extension
                )
                # Save the thumbnail
                img.save(os.path.join(src_dir_path, filename))


def add_image_watermark():
    # Loop through each file in the directory
    for filename in os.listdir(src_dir_path):
        # Check if the file is an image file
        if filename.lower().endswith(".png") or filename.lower().endswith(".jpg"):
            print(f"add_image_watermark: {filename}")
            # Open an image file
            file_path = os.path.join(src_dir_path, filename)
            with Image.open(file_path) as img:
                draw = ImageDraw.Draw(img)
                w, h = img.size
                font_size = int(w * 0.02)
                x, y = w - font_size * 4, h - font_size * 4
                font = ImageFont.truetype("PPNeueMachina-InktrapRegular.otf", font_size)
                draw.text(
                    (x, y), watermark_text, fill=(64, 64, 74), font=font, anchor="ms"
                )
                img.save(os.path.join(watermarks_dir_path, filename))


def upload_file_to_ipfs(file_path):
    print(f"upload_to_ipfs: {file_path}")

    if PY_ENV == "test":
        return "test_ipfs_hash"

    # Read the file as binary data
    with open(file_path, "rb") as file:
        file_data = file.read()

    # Create the IPFS upload API endpoint URL
    endpoint_url = "https://ipfs.infura.io:5001/api/v0/add"

    # Set the request parameters
    params = {"pin": "true"}  # Pin the uploaded file to ensure it is not removed

    # Send the POST request to upload the file
    response = requests.post(
        endpoint_url,
        params=params,
        files={"file": file_data},
        auth=(infura_project_id, infura_project_secret),
    )

    # Check if the request was successful
    if response.status_code == 200:
        # Extract the IPFS hash from the response
        ipfs_hash = response.json()["Hash"]
        return ipfs_hash
    else:
        # Handle the error case
        print(f"Failed to upload file to IPFS. Error: {response.text}")
        return None


def get_image_description(image_url):
    print(f"get_image_description: {image_url}")

    response = open_ai_client.chat.completions.create(
        model="gpt-4-vision-preview",
        messages=[
            {
                "role": "user",
                "content": [
                    {"type": "text", "text": "What's in this image?"},
                    {
                        "type": "image_url",
                        "image_url": {"url": f"data:image/jpeg;base64,{image_url}"},
                        "detail": "auto",
                    },
                ],
            }
        ],
        max_tokens=140,
    )
    description = response.choices[0].message[1].content[0].text
    print(f"get_image_description: {description}")

    return response.choices[0].message[1].content[0].text


def remove_digits_from_name():
    metadata_list = []

    # Read the metadata from the JSON file
    with open(metadata_file_name, "r") as f:
        json_metadata = json.load(f)

    # Loop through each metadata object
    for metadata in json_metadata:
        name = metadata["name"]
        just_name = re.sub(r"\d+", "", name)
        # just_name = re.match(r"\w+", name)

        new_metadata = {
            "id": metadata["id"],
            "name": just_name.strip(),
            "description": metadata["description"],
            "image": metadata["image"],
            "thumbnail": metadata["thumbnail"],
        }

        metadata_list.append(new_metadata)

    with open(metadata_file_name, "w") as f:
        json.dump(metadata_list, f)


def append_real_image_urls_to_metadata_file():
    metadata_list = []

    # Read the metadata from the JSON file
    with open(metadata_file_name, "r") as f:
        json_metadata = json.load(f)
    with open("metadata.json", "r") as f:
        unsorted_metadata_json = json.load(f)

    # Loop through each metadata object
    for metadata in json_metadata:
        name = metadata["name"]

        for unsorted_metadata in unsorted_metadata_json:
            xname = unsorted_metadata["name"]

            if (xname in name) or (name in xname):
                new_metadata = {
                    "id": metadata["id"],
                    "name": metadata["name"],
                    "description": metadata["description"],
                    "image": unsorted_metadata["image"],
                    "thumbnail": unsorted_metadata["thumbnail"],
                }
                metadata_list.append(new_metadata)

    with open(metadata_file_name, "w") as f:
        json.dump(metadata_list, f)


def sort_metadata_file():
    # Read the metadata from the JSON file
    with open(metadata_file_name, "r") as f:
        metadata_list = json.load(f)

    # Loop through each metadata object
    for metadata in metadata_list:
        name = metadata["name"]
        token_id = re.match(r"\d+", name)

        if token_id:
            token_id = int(token_id.group())
        else:
            token_id = ""

        metadata["id"] = token_id

    # Sort the metadata list by the "name" property ascending
    sorted_metadata = sorted(metadata_list, key=lambda x: x["id"])

    with open(metadata_file_name, "w") as f:
        json.dump(metadata_list, f)

    return sorted_metadata


def complete_image_filenames():
    with open(metadata_file_name, "r") as f:
        metadata_list = json.load(f)

    for filename in sorted(os.listdir(watermarks_dir_path)):
        if thumbnail_extension not in filename and (
            filename.lower().endswith(".png") or filename.lower().endswith(".jpg")
        ):

            for metadata in metadata_list:
                name = metadata["name"]
                filename_digit = re.match(r"\d+", filename).group()
                token_id = re.match(r"\d+", name).group()
                if token_id in filename_digit:
                    print(f"complete_image_filenames: {filename}:{name}")
                    with Image.open(os.path.join(watermarks_dir_path, filename)) as img:
                        # Rename the image file
                        file_extension = filename.split(".")[-1]
                        new_filename = name + "." + file_extension
                        os.rename(
                            os.path.join(watermarks_dir_path, filename),
                            os.path.join(watermarks_dir_path, new_filename),
                        )


def create_metadata_from_image_files():
    metadata_list = []
    counter = 0
    total_items = len([filename for filename in os.listdir(watermarks_dir_path)])

    for filename in sorted(os.listdir(watermarks_dir_path)):
        if thumbnail_extension not in filename and (
            filename.lower().endswith(".png") or filename.lower().endswith(".jpg")
        ):
            # Create a variable for the actual file
            file_path = os.path.join(watermarks_dir_path, filename)
            # base64_image = encode_image(file_path)

            # Upload the file to IPFS and get the IPFS hash
            image_ipfs_hash = upload_file_to_ipfs(file_path)
            print(f"create_metadata.image_ipfs_hash: {image_ipfs_hash}")

            # change the file name to include _thumbnail
            file_extension = filename.split(".")[-1]
            name = filename.split(".")[0]

            # Extract numbers from the beginning of the name
            token_id = re.match(r"\d+", name)
            if token_id:
                token_id = int(token_id.group())
            else:
                token_id = ""

            # Rest of the code...
            thumbnail_filename = name + thumbnail_extension + "." + file_extension
            thumbnail_path = os.path.join(watermarks_dir_path, thumbnail_filename)
            thumbnail_ipfs_hash = upload_file_to_ipfs(thumbnail_path)
            print(f"create_metadata.thumbnail_ipfs_hash: {thumbnail_ipfs_hash}")

            # description = get_image_description(f"{ipfs_gateway_url}{image_ipfs_hash}")

            # Create a metadata object
            metadata = {
                "id": token_id,
                "name": name,
                "description": generic_description_text,
                "image": f"{ipfs_gateway_url}{image_ipfs_hash}",
                "thumbnail": f"{ipfs_gateway_url}{thumbnail_ipfs_hash}",
            }

            # Append the metadata object to the list
            metadata_list.append(metadata)
            counter += 1
            print(f"create_metadata: {counter} of {total_items} items")

    # Write the list of metadata objects to a JSON file
    with open(metadata_file_name, "w") as f:
        json.dump(metadata_list, f)


def main():
    # sort_metadata_file()
    # complete_image_filenames()
    # create_metadata_from_image_files()
    # append_real_image_urls_to_metadata_file()
    # remove_digits_from_name()
    # create_metadata()
    create_token_uri_from_metadata_object()
    # create_img_thumbnails()
    # add_image_watermark()


if __name__ == "__main__":
    main()
