"use client";

import Image from "next/image";
import React, { useCallback, useState } from "react";
import { useDropzone } from "react-dropzone";

type ImageData = {
  name: string;
  src: string;
};

const FileUpload = () => {
  const [base64, setBase64] = useState<ImageData | undefined>(undefined);
  const [image, setImage] = useState<any>(undefined);
  console.log(image)

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
      const image = await fetch("http://localhost:5000/convert/upload/png", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ data: base64?.src }),
      });
      const data = await image.json();
      setImage(data);
    } catch (err) {
      console.log(err);
    }
  };

  const { getRootProps, getInputProps, isDragActive } = useDropzone({ onDrop });
  return (
    <div className="flex flex-col items-center justify-center gap-3">
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
          <div className="flex flex-col items-center justify-center p-2 gap-3">
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
