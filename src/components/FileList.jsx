import React, { useState } from 'react';
import { Worker, Viewer } from '@react-pdf-viewer/core';
import '@react-pdf-viewer/core/lib/styles/index.css';
import { useSelector, useDispatch } from 'react-redux';
import { setFiles } from '../store/fileSlice';

function FileList() {
  const [previewFile, setPreviewFile] = useState(null);
  const dispatch = useDispatch();
  const files = useSelector((store) => store.files);

  const loadFolderFiles = async () => {
    const selectedFiles = await window.electronAPI.selectFolder();
    dispatch(setFiles(selectedFiles)); 
    setPreviewFile(null);
  };

const loadFiles =  async()=>{
  const selectedFiles = await window.electronAPI.selectFiles();
  dispatch (setFiles(selectedFiles));
  setPreviewFile(null)
}

  const makeFileUrl = (filePath) => {
    const normalized = filePath.replace(/\\/g, '/');
    return `file://${normalized}`;
  };

  return (
    <div>
      <div className='flex items-center justify-end w-full gap-2'>
         <button
        className="px-4 py-2 text-white rounded bg-white/10"
        onClick={loadFolderFiles}
      >
        Select Folder
      </button>

      <button
        className="px-4 py-2 text-white rounded bg-white/10"
        onClick={loadFiles}
      >
        Select File
      </button>
      </div>
     
      <div className="grid grid-cols-8 gap-4 mt-4">
        {files.map((file, index) => (
          <div
            key={`${file.path}-${index}`}
            className="cursor-pointer hover:shadow"
            onClick={() => setPreviewFile(file)}
            title={file.name}
          >
            <img
              src={
                file.ext === '.pdf'
                  ? 'https://cdn-icons-png.flaticon.com/512/337/337946.png'
                  : 'https://cdn-icons-png.flaticon.com/512/337/337932.png'
              }
              alt="File"
              className="w-12 h-12 mx-auto mb-2"
            />
            <p className="text-xs text-center truncate">{file.name}</p>
          </div>
        ))}
      </div>

      {/* Modal Preview */}
      {previewFile && (
        <div
          onClick={() => setPreviewFile(null)}
          className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-70"
        >
          <div
            onClick={(e) => e.stopPropagation()}
            className=" text-white  rounded max-w-5xl w-full h-[90vh] overflow-hidden relative"
          >
            <button
              className="absolute z-30 px-3 py-1 text-white bg-red-500 rounded top-2 right-2"
              onClick={() => setPreviewFile(null)}
            >
              X
            </button>

            {previewFile.ext === '.pdf' ? (
              <div className="h-full">
                <Worker workerUrl="https://unpkg.com/pdfjs-dist@3.11.174/build/pdf.worker.min.js">
                  <Viewer
                    fileUrl={makeFileUrl(previewFile.path)}
                    theme="dark"
                    renderLoader={() => (
                      <div className="flex items-center justify-center h-full text-lg text-white">
                        <span className="mr-2 animate-spin">🔄</span> Loading PDF...
                      </div>
                    )}
                  />
                </Worker>
              </div>
            ) : (
              <div className="mt-10 text-center">
                <p className="mb-2">DOC/DOCX preview not supported.</p>
                <a
                  href={makeFileUrl(previewFile.path)}
                  target="_blank"
                  rel="noreferrer"
                  className="text-blue-400 underline"
                >
                  Open with system default app
                </a>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

export default FileList;
