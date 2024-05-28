import base64
import os
import json

import requests
from PIL import Image
from PIL import ImageFont
from PIL import ImageDraw
import re

from config import *


def set_metadata_token_id_from_0_index():
    metadata_list = []

    # Read the metadata from the JSON file
    with open(metadata_file_path, "r") as file:
        existing_json_metadata = json.load(file)

    # Loop through each metadata object
    for metadata in existing_json_metadata:
        id = int(metadata["id"])

        new_metadata = {**metadata, "id": id - 1}

        metadata_list.append(new_metadata)

    temp_file_path = "./temp_metadata.json"

    update_json_document(metadata_list, temp_file_path)


def create_token_uri_batches():
    with open(token_uris_filename, "r") as file:
        token_uris = json.load(file)

    batch_size = 25

    for i in range(0, len(token_uris), batch_size):
        batch = token_uris[i : i + batch_size]
        update_json_document(batch, f"{token_uris_dir_path}/token-uris-batch-{i}.json")
        print(f"create_token_uri_batches: {i}")


def create_token_uri_from_metadata_object(metadata_filename, to_filename_path):
    token_uris = []

    with open(metadata_filename, "r") as file:
        metadata_list = json.load(file)

    for metadata in metadata_list:
        temp_file_path = "./temp_metadata.json"
        with open(temp_file_path, "w") as temp_file:
            json.dump(metadata, temp_file)

        token_uri = upload_file_to_ipfs(temp_file_path)

        print(
            f"create_token_uri_from_metadata_object.token_uri: {token_uri} for {metadata['id']}"
        )

        token_uris.append(token_uri)

        os.remove(temp_file_path)

    update_json_document(token_uris, to_filename_path)


def encode_image(image_path):
    with open(image_path, "rb") as image_file:
        return base64.b64encode(image_file.read()).decode("utf-8")


def is_image_extension(filename):
    return filename.lower().endswith(".png") or filename.lower().endswith(".jpg")


def create_img_thumbnails(from_directory_path, to_directory_path):
    for filename in os.listdir(from_directory_path):

        if is_image_extension(filename):

            file_path = os.path.join(from_directory_path, filename)

            with Image.open(file_path) as img:
                size = (187, 187)

                img.thumbnail(size)

                file_extension = filename.split(".")[-1]

                filename = (
                    filename.split(".")[0] + thumbnail_extension + "." + file_extension
                )

                img.save(os.path.join(to_directory_path, filename))


def add_image_watermark():
    # Loop through each file in the directory
    for filename in os.listdir(src_dir_path):
        # Check if the file is an image file
        if is_image_extension(filename):
            print(f"add_image_watermark: {filename}")
            # Open an image file
            file_path = os.path.join(src_dir_path, filename)
            with Image.open(file_path) as img:
                draw = ImageDraw.Draw(img)
                w, h = img.size
                font_size = int(w * 0.02)
                x, y = w - font_size * 4, h - font_size * 4
                font = ImageFont.truetype("oldenglishtextmt.ttf", font_size)

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
        print(f"upload_to_ipfs: {file_path}, {ipfs_hash}")
        return ipfs_hash
    else:
        # Handle the error case
        print(f"Failed to upload file to IPFS. Error: {response.text}")
        return None


def get_claude_image_description(image_url, name, id):
    print(f"get_claude_image_description.image_url: {image_url} for {name}, {id}")

    res = [
        filename
        for filename in sorted(os.listdir(watermarks_dir_path))
        if re.search(rf"{name}*_thumbnail\.(PNG|jpg|png|jpeg|JPG)$", filename)
    ]

    for file in res:
        filename = file
        image_data = base64.b64encode(
            open(f"{src_dir_path}/{file}", "rb").read()
        ).decode("utf-8")

    file_extension = filename.split(".")[-1].lower()
    file_extension = "jpeg" if file_extension == "jpg" else file_extension
    image_media_type = f"image/{file_extension}"
    message = claude_anthropic_client.messages.create(
        model="claude-3-opus-20240229",
        max_tokens=140,
        messages=[
            {
                "role": "user",
                "content": [
                    {
                        "type": "image",
                        "source": {
                            "type": "base64",
                            "media_type": image_media_type,
                            "data": image_data,
                        },
                    },
                    {
                        "type": "text",
                        "text": f"Describe what you see in no more than 140 characters. The language should be inspired in the author's common style but you are not limited to use his same words. Examples of the author's style are: 'In a field of poppies, crimson shadows loom, Death's silent whispers, a dark, haunting tomb.' OR 'Veiled in the midnight realm, a clandestine assembly of elderly spirits murmur incantations. Enigmatic shadows embrace the ritual, weaving a tapestry of arcane whispers. A spectral convergence, a dance of the ages obscured in the shroud of shrieking voices.' OR 'In the desolate skeletal graveyard, shadows cling to the weathered bones, and a spectral gloom pervades the air as forgotten souls languish in eternal decay. A haunting silence reigns, broken only by the mournful whispers of the departed, their essence dissolving into the abyss of an endless, somber night.' OR 'Steel shadows dance, humanity's hush, Silent echoes in circuits' cold rush. Whispers of life, now swallowed by automation, In the kingdom of machines, we fade from sight.'",
                    },
                ],
            }
        ],
    )

    content = message.content[0].text

    print(f"get_claud_image_description.content: {content}")

    return content


def get_openai_image_description(image_url):
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


def extend_image_description_of_metadata_items():
    with open(metadata_ai_descriptions_file_name, "r") as final_descriptions_json_file:
        existing_json_metadata = json.load(final_descriptions_json_file)

    with open(metadata_file_path, "r") as descriptions_json_file:
        json_metadata = json.load(descriptions_json_file)

    existing_names = [metadata["name"] for metadata in existing_json_metadata]

    # Loop through each metadata object
    for metadata in json_metadata:
        if metadata["name"] in existing_names:
            continue

        description = get_claude_image_description(
            metadata["thumbnail"], metadata["name"], metadata["id"]
        )

        new_metadata = {
            **metadata,
            "description": description,
        }

        existing_json_metadata.append(new_metadata)

        update_json_document(existing_json_metadata, metadata_ai_descriptions_file_name)


def remove_digits_from_name(name):
    just_name = re.sub(r"\d+", "", name)
    return just_name


def append_real_image_urls_to_metadata_file():
    metadata_list = []

    # Read the metadata from the JSON file
    with open(metadata_file_path, "r") as f:
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
                    **metadata,
                    "image": unsorted_metadata["image"],
                    "thumbnail": unsorted_metadata["thumbnail"],
                }

                metadata_list.append(new_metadata)

    update_json_document(metadata_list, metadata_file_path)


def sort_metadata_file():
    # Read the metadata from the JSON file
    with open(metadata_file_path, "r") as f:
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

    update_json_document(metadata_list, metadata_file_path)

    return sorted_metadata


def complete_image_filenames():
    with open(metadata_file_path, "r") as f:
        metadata_list = json.load(f)

    for filename in sorted(os.listdir(watermarks_dir_path)):
        if thumbnail_extension not in filename and is_image_extension(filename):

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


def create_metadata_from_image_files(dir_path):
    counter = 0

    total_items = len([filename for filename in os.listdir(dir_path)])

    with open(metadata_file_path, "r") as metadata_file:
        existing_json_metadata = json.load(metadata_file)

    for filename in sorted(os.listdir(dir_path)):
        if thumbnail_extension not in filename and is_image_extension(filename):
            # Create a variable for the actual file
            file_path = os.path.join(dir_path, filename)
            # base64_image = encode_image(file_path)

            # Upload the file to IPFS and get the IPFS hash
            image_ipfs_hash = upload_file_to_ipfs(file_path)
            print(f"create_metadata.image_ipfs_hash: {image_ipfs_hash}")

            # change the file name to include _thumbnail
            file_extension = filename.split(".")[-1]
            name = filename.split(".")[0]
            name = remove_digits_from_name(name)

            # Extract numbers from the beginning of the name
            token_id = re.match(r"\d+", name)
            if token_id:
                token_id = int(token_id.group()) - 1
            else:
                token_id = ""

            thumbnail_filename = name + thumbnail_extension + "." + file_extension
            thumbnail_path = os.path.join(dir_path, thumbnail_filename)
            thumbnail_ipfs_hash = upload_file_to_ipfs(thumbnail_path)
            print(f"create_metadata.thumbnail_ipfs_hash: {thumbnail_ipfs_hash}")

            description = get_claude_image_description(
                thumbnail_filename, name, token_id
            )

            metadata = {
                "id": token_id,
                "name": name,
                "author": author_text,
                "description": description,
                "image": f"{ipfs_gateway_url}{image_ipfs_hash}",
                "thumbnail": f"{ipfs_gateway_url}{thumbnail_ipfs_hash}",
            }

            # Append the metadata object to the list
            existing_json_metadata.append(metadata)
            counter += 1
            print(f"create_metadata: {counter} of {total_items} items")

            update_json_document(existing_json_metadata, metadata_file_path)


def update_json_document(data, filename):
    with open(filename, "w") as file:
        json.dump(
            data,
            file,
            indent=2,
            separators=(",", ": "),
        )


def update_image_urls_on_existing_metadata_file(
    from_directory_path, metadata_filename, metadata_prop_key
):
    print(
        f"update_image_urls_on_existing_metadata_file: {from_directory_path}, {metadata_filename}, {metadata_prop_key}"
    )

    with open(metadata_filename, "r") as file:
        existing_json_metadata = json.load(file)

    for index, existing_metadata in enumerate(existing_json_metadata):
        for filename in sorted(os.listdir(from_directory_path)):
            if existing_metadata["name"] in filename:
                print(
                    f'update_image_urls_on_existing_metadata_file: {filename}, {existing_metadata["name"]}'
                )

                file_path = os.path.join(from_directory_path, filename)
                image_ipfs_hash = upload_file_to_ipfs(file_path)

                existing_json_metadata[index][
                    metadata_prop_key
                ] = f"{ipfs_gateway_url}{image_ipfs_hash}"

                update_json_document(existing_json_metadata, metadata_filename)


def main():
    # sort_metadata_file()
    # complete_image_filenames()
    # create_metadata_from_image_files(watermarks_dir_path)
    # update_image_urls_on_existing_metadata_file(
    #     watermarks_dir_path, metadata_file_path, "image"
    # )
    # update_image_urls_on_existing_metadata_file(
    #     thumbnails_dir_path, metadata_file_path, "thumbnail"
    # )
    # append_real_image_urls_to_metadata_file()
    # remove_digits_from_name()
    # create_metadata()
    create_token_uri_from_metadata_object(metadata_file_path, token_uris_filename)
    # create_token_uri_batches()
    # set_metadata_token_id_from_0_index()
    # extend_image_description_of_metadata_items()
    # create_img_thumbnails(watermarks_dir_path, thumbnails_dir_path)
    # add_image_watermark()


if __name__ == "__main__":
    main()
