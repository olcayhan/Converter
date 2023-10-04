"use client";

import React, { useCallback, useState } from "react";
import { useDropzone } from "react-dropzone";

type File = {
  name: string;
  path: string;
};

const FileUpload = () => {
  const [files, setFiles] = useState<File[] | undefined>(undefined);

  const onDrop = useCallback(
    (acceptedFiles: any) => {
      setFiles(acceptedFiles);
    },
    [files]
  );

  const downloadBtn = async () => {
    console.log(files ? files[0].path : "Nope");

    const data = await fetch("http://localhost:5000/convert/upload", {
      method: "POST",
      body: files ? JSON.stringify({ file: files[0] }) : JSON.stringify({file:'sadasd'}),
    });
  };

  const { getRootProps, getInputProps } = useDropzone({ onDrop });
  console.log(files);
  return (
    <div className="flex flex-col items-center justify-center gap-3">
      <div
        {...getRootProps()}
        className="p-[20px] text-center rounded-md border-2 border-solid border-[#cccccc]"
      >
        <input {...getInputProps()} />
        <p className={`${files && "text-blue-500"}`}>
          {files ? files[0].name : "Sürükleyin ya da tıklayın"}
        </p>
      </div>

      <button
        className="p-3 bg-blue-400 rounded-xl text-white font-semibold"
        onClick={downloadBtn}
      >
        Convert
      </button>
    </div>
  );
};

export default FileUpload;
