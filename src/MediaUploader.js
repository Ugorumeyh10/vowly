import React, { useState, useEffect } from "react";
import { useAuth } from "./AuthContext";
import { createId } from "@paralleldrive/cuid2";

function MediaUploader({ onUploadSuccess }) {
  const [file, setFile] = useState(null);
  const [previewUrl, setPreviewUrl] = useState(null);
  const [status, setStatus] = useState("idle"); // idle, uploading, success, error
  const [error, setError] = useState(null);
  const { token } = useAuth();

  const handleFileChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      const selectedFile = e.target.files[0];
      setFile(selectedFile);
      // If there was a previous preview, revoke it to free up memory
      if (previewUrl) {
        URL.revokeObjectURL(previewUrl);
      }
      setPreviewUrl(URL.createObjectURL(selectedFile));
    }
  };

  // Clean up the object URL when the component unmounts or the preview changes
  useEffect(() => {
    return () => {
      if (previewUrl) URL.revokeObjectURL(previewUrl);
    };
  }, [previewUrl]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null); // Clear previous errors
    if (!file) {
      setError("Please select a file to upload.");
      return;
    }

    setStatus("uploading");

    try {
      const mediaId = createId();
      const uniqueFilename = `${mediaId}-${file.name}`;

      // 1. Get a presigned URL from our backend
      const response = await fetch("https://vowly-backend.vowly.workers.dev/upload-url", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          filename: uniqueFilename,
          contentType: file.type,
        }),
      });

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`Failed to get an upload URL: ${errorText}`);
      }

      const { url: presignedUrl } = await response.json();

      // 2. Upload the file directly to R2 using the presigned URL
      const uploadResponse = await fetch(presignedUrl, {
        method: "PUT",
        headers: {
          "Content-Type": file.type,
        },
        body: file,
      });

      if (!uploadResponse.ok) {
        throw new Error("File upload to R2 failed.");
      }

      // 3. Save metadata to our backend
      const metadataResponse = await fetch("https://vowly-backend.vowly.workers.dev/media", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          id: mediaId,
          key: uniqueFilename,
          contentType: file.type,
        }),
      });

      if (!metadataResponse.ok) {
        throw new Error("File uploaded, but failed to save media metadata.");
      }

      setStatus("success");
      setFile(null); // Clear file input
      setPreviewUrl(null); // Clear the preview
      onUploadSuccess(); // Refresh the gallery
    } catch (err) {
      setStatus("error");
      setError(err.message);
    }
  };

  return (
    <div className="p-6 bg-white rounded-lg shadow-md">
      <h2 className="text-2xl font-bold text-rose-800 mb-4">Upload Photos & Videos</h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        {previewUrl && (
          <div className="mt-4">
            {file.type.startsWith("video") ? (
              <video src={previewUrl} controls className="w-full max-h-60 rounded-md object-contain bg-gray-100" />
            ) : (
              <img src={previewUrl} alt="File preview" className="w-full max-h-60 rounded-md object-contain" />
            )}
          </div>
        )}
        <input type="file" onChange={handleFileChange} accept="image/*,video/*" className="w-full border border-gray-300 rounded-md p-3" required />
        <button type="submit" disabled={!file || status === "uploading"} className="bg-rose-600 text-white px-4 py-2 rounded-md hover:bg-rose-700 transition duration-200 disabled:bg-gray-400">
          {status === "uploading" ? "Uploading..." : "Upload"}
        </button>
      </form>
      {status === "success" && <p className="text-rose-500 mt-2">Upload successful!</p>}
      {status === "error" && <p className="text-red-500 mt-2">Error: {error}</p>}
    </div>
  );
}

export default MediaUploader;