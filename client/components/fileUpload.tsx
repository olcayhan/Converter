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
  const [base64, setBase64] = useState<ImageData[]>([]);
  const [image, setImage] = useState<ImageData[]>([]);
  const [type, setType] = useState<string>(fileTypes[0]);
  const [zipped, setZipped] = useState<string | undefined>(undefined);

  const typeArray: string[] = Object.keys(fileTypes).filter((key) =>
    isNaN(Number(key))
  );

  const onDrop = useCallback((acceptedFiles: any) => {
    if (acceptedFiles.length) {
      try {
        acceptedFiles.forEach((acceptedFile: any) => {
          const reader = new FileReader();
          reader.onload = (e: any) => {
            setBase64((prevBase64) => [
              ...prevBase64,
              { name: acceptedFile.name, src: e.target.result },
            ]);
          };
          reader.readAsDataURL(acceptedFile);
        });
      } catch (err) {
        console.log(err);
      } finally {
        setImage([]);
        setZipped(undefined);
      }
    }
  }, []);

  const handleConvert = () => {
    try {
      base64.forEach(async (base64Item) => {
        const image = await fetch(
          `http://localhost:5000/convert/upload/${type}`,
          {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ data: base64Item?.src }),
          }
        );
        const data = await image.json();
        setImage((prevImage) => [
          ...prevImage,
          { name: base64Item.name.split(".")[0] + `.${type}`, src: data.src },
        ]);
      });
    } catch (err) {
      console.log(err);
    }
  };

  const handleTypeChange = (e: any) => {
    setType(e.target.value);
    setImage([]);
  };

  const downloadZip = async () => {
    const zip = await fetch("http://localhost:5000/convert/zip-download", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ data: image }),
    });
    const data = await zip.json();
    setZipped(data.src);
  };

  const deleteImage = (data: ImageData) => {
    const filteredBase64 = base64.filter((item) => item.name !== data.name);
    setBase64(filteredBase64);
    setZipped(undefined);
    base64.length == 0 && setImage([]);
  };
  const { getRootProps, getInputProps, isDragActive } = useDropzone({ onDrop });
  return (
    <div className="flex flex-col items-start justify-center gap-3">
      <div className="flex flex-row items-center p-3 gap-2 w-full">
        <p className=" font-semibold">Convert to :</p>
        <select
          name="fileType"
          id="fileType"
          className="border-[1px] border-blue-500 py-2 px-3 outline-none rounded-md font-semibold"
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

      <div className="flex flex-row gap-3 flex-wrap">
        {base64.map((item, key) => {
          return (
            <div className="flex flex-col gap-3 justify-between items-center">
              <div className="relative flex flex-col items-center justify-between h-full p-2 gap-3">
                <button
                  className="absolute top-0 right-0 z-50 text-white bg-red-400 w-7 h-7 rounded-full font-semibold"
                  onClick={() => deleteImage(item)}
                >
                  x
                </button>
                <Image
                  src={item.src}
                  alt={item.name}
                  width={100}
                  height={100}
                />
                <p className="max-w-[100px] truncate">{item.name}</p>

                {image.length > 0 && (
                  <a
                    className="p-3 bg-blue-600 rounded-xl text-white font-semibold"
                    href={image[key]?.src}
                    download={image[key]?.name}
                  >
                    Download
                  </a>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {image.length === 0 && (
        <button
          className={`mt-10 p-3 ${
            base64.length ? "bg-blue-600" : "bg-blue-200"
          } rounded-xl text-white font-semibold`}
          onClick={() => handleConvert()}
          disabled={!base64.length}
        >
          Convert
        </button>
      )}

      {!zipped ? (
        <button
          className={`p-3 ${
            image.length ? "bg-blue-600" : "bg-blue-200"
          } rounded-xl text-white font-semibold`}
          onClick={downloadZip}
          disabled={!image.length}
        >
          Convert Archive
        </button>
      ) : (
        <a
          className={`p-3  ${
            base64.length ? "bg-blue-600" : "bg-blue-200"
          } rounded-xl text-white font-semibold`}
          href={`data:application/zip;base64,${zipped}`}
          download={"converted.zip"}
        >
          Download Archive
        </a>
      )}
    </div>
  );
};

export default FileUpload;
