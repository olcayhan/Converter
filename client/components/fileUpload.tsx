"use client";

import Image from "next/image";
import React, { useCallback, useState } from "react";
import { useDropzone } from "react-dropzone";

type ImageData = {
  name: string;
  src: string;
};

enum fileTypes {
  "png",
  "jpeg",
  "gif",
  "webp",
}

const FileUpload = () => {
  const [base64, setBase64] = useState<ImageData | undefined>(undefined);
  const [image, setImage] = useState<string | undefined>(undefined);
  const [type, setType] = useState<string>(fileTypes[0]);

  const typeArray: string[] = Object.keys(fileTypes).filter((key) =>
    isNaN(Number(key))
  );

  const onDrop = useCallback((acceptedFiles: any) => {
    if (acceptedFiles.length) {
      try {
        const reader = new FileReader();

        reader.onload = (e: any) => {
          const base64Data = e.target.result;
          setBase64({ name: acceptedFiles[0].name, src: base64Data });
        };

        reader.readAsDataURL(acceptedFiles[0]);
      } catch (err) {
        console.log(err);
      } finally {
        setImage(undefined);
      }
    }
  }, []);

  const handleConvert = async () => {
    try {
      const image = await fetch(
        `http://localhost:5000/convert/upload/${type}`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ data: base64?.src }),
        }
      );
      const data = await image.json();
      setImage(data);
    } catch (err) {
      console.log(err);
    }
  };

  const handleTypeChange = (e: any) => {
    setType(e.target.value);
    setImage(undefined);
    setBase64(undefined);
  };

  const deleteImage = () => {
    setBase64(undefined);
    setImage(undefined);
  };

  const { getRootProps, getInputProps, isDragActive } = useDropzone({ onDrop });
  return (
    <div className="flex flex-col items-center justify-center gap-3">
      <div className="flex flex-row items-center justify-start p-3 gap-2">
        <p>Convert to :</p>
        <select
          name="fileType"
          id="fileType"
          className="border-[1px] border-blue-500 py-2 px-3"
          value={type}
          onChange={handleTypeChange}
        >
          {typeArray.map((type) => (
            <option value={type}>{type.toUpperCase()}</option>
          ))}
        </select>
      </div>
      <div
        {...getRootProps()}
        className="p-56 text-center rounded-md border-2 border-solid border-[#cccccc]"
      >
        <input {...getInputProps()} />
        <p className={`${base64 && "text-blue-500"}`}>
          {isDragActive ? "Buraya Bırakınız" : "Sürükleyin ya da tıklayın"}
        </p>
      </div>

      <div className="flex flex-row gap-3">
        {base64 && (
          <div className="relative flex flex-col items-center justify-center p-2 gap-3">
            <button
              className="absolute top-0 right-0 z-50 text-white bg-red-400 w-7 h-7 rounded-full"
              onClick={deleteImage}
            >
              x
            </button>
            <Image src={base64.src} alt="" width={100} height={100} />
            <p>{base64.name}</p>
          </div>
        )}
      </div>

      {image ? (
        <a
          className="p-3 bg-blue-600 rounded-xl text-white font-semibold"
          href={image}
          download={base64?.name.split(".")[0]}
        >
          Download
        </a>
      ) : (
        <button
          className={`p-3 ${
            base64 ? "bg-blue-600" : "bg-blue-200"
          } rounded-xl text-white font-semibold`}
          onClick={handleConvert}
          disabled={!base64}
        >
          Convert
        </button>
      )}
    </div>
  );
};

export default FileUpload;
