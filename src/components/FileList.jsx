//src\components\FileList.jsx
import React, { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { setFiles } from '../store/fileSlice';

function FileList() {
  const [previewFile, setPreviewFile] = useState(null);
  const [scanStatus, setScanStatus] = useState('');
  const [scanResults, setScanResults] = useState([]);
  const dispatch = useDispatch();
  const files = useSelector((store) => store.files);

  // Load folder files
  const loadFolderFiles = async () => {
    const selectedFiles = await window.electronAPI.selectFolder();
    dispatch(setFiles(selectedFiles));
    setPreviewFile(null);
    setScanResults([]);
    setScanStatus('');
  };

  // Load individual files
  const loadFiles = async () => {
    const selectedFiles = await window.electronAPI.selectFiles();
    dispatch(setFiles(selectedFiles));
    setPreviewFile(null);
    setScanResults([]);
    setScanStatus('');
  };

  // Trigger scan all files
  const scanAllFiles = () => {
    if (!files.length) return;
    setScanResults([]); // reset previous results
    setScanStatus('Starting scan...');
    window.electronAPI.scanFiles(files);
  };

 useEffect(() => {
  // Add listeners and keep cleanup functions
  const removeProgressListener = window.electronAPI.onScanProgress((data) => {
    setScanStatus(`File ${data.index}/${data.total}: ${data.name} — ${data.status}`);
  });

  const removeDataListener = window.electronAPI.onScanData((result) => {
    setScanResults((prev) => [...prev, result]);
  });

  // Cleanup listeners on unmount
  return () => {
    removeProgressListener();
    removeDataListener();
  };
}, []);


  // Format file path for preview
  const makeFileUrl = (filePath) => {
    const normalized = filePath.replace(/\\/g, '/');
    return `file://${normalized}`;
  };

  return (
    <div>
      <div className="flex items-center justify-end w-full gap-2 mb-2">
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
          Select Files
        </button>
        <button
          className="px-4 py-2 text-white bg-green-600 rounded"
          onClick={scanAllFiles}
          disabled={files.length === 0}
        >
          Scan All Files
        </button>
      </div>

      {/* Scan Status */}
      <div className="mb-4 text-sm text-gray-300">{scanStatus}</div>

      {/* File Grid */}
      <div className="grid grid-cols-8 gap-4">
        {files.map((file, idx) => (
          <div
            key={`${file.path}-${idx}`}
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

      {/* Scan Results */}
      {scanResults.length > 0 && (
        <div className="p-4 mt-6 overflow-auto text-white bg-gray-900 rounded max-h-[57vh]">
          <h3 className="mb-2 text-lg font-semibold">Scan Results:</h3>
          {scanResults.map((res, i) => (
            <div
              key={`${res.name}-${i}`}
              className="p-3 mb-3 bg-gray-800 border border-gray-700 rounded"
            >
              <div className="font-bold">{res.name}</div>
              {res.error ? (
                <div className="mt-1 text-red-500"> {res.error}</div>
              ) : (
                <pre className="mt-1 overflow-y-auto text-sm text-gray-300 whitespace-pre-wrap max-h-[50vh]">
                  {res.text}
                </pre>
              )}
            </div>
          ))}
        </div>
      )}

      {/* Modal Preview for selected file */}
      {previewFile && (
        <div
          onClick={() => setPreviewFile(null)}
          className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-70"
        >
          <div
            onClick={(e) => e.stopPropagation()}
            className="text-white rounded max-w-5xl w-full h-[90vh] overflow-hidden relative"
          >
            <button
              className="absolute z-30 px-3 py-1 text-white bg-red-500 rounded top-2 right-2"
              onClick={() => setPreviewFile(null)}
            >
              X
            </button>

            {previewFile.ext === '.pdf' ? (
              <div className="h-full">
                {/* You can keep your PDF viewer here */}
                <embed src={makeFileUrl(previewFile.path)} type="application/pdf" width="100%" height="100%" />
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
