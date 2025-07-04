import React from "react";
import CommentSection from "./CommentSection";
import SocialSharing from "./SocialSharing";

const R2_PUBLIC_URL = process.env.REACT_APP_R2_PUBLIC_URL;

if (!R2_PUBLIC_URL) {
  console.warn("Warning: REACT_APP_R2_PUBLIC_URL environment variable is not set. Media items may not display correctly.");
}

function MediaItem({ media }) {
  const mediaUrl = `${R2_PUBLIC_URL}/${media.key}`;

  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden">
      {media.contentType.startsWith("video") ? (
        <video controls src={mediaUrl} className="w-full h-auto object-cover" />
      ) : (
        <img src={mediaUrl} alt={`Uploaded by ${media.uploaderName}`} className="w-full h-auto object-cover" />
      )}
      <div className="p-4">
        <div className="flex justify-between items-center text-sm">
          <p className="text-gray-500">
            By <span className="font-medium text-gray-700">{media.uploaderName}</span>
          </p>
          <p className="text-gray-400">{new Date(media.uploadedAt).toLocaleDateString()}</p>
        </div>
        <SocialSharing mediaUrl={mediaUrl} />
        <CommentSection mediaId={media.id} />
      </div>
    </div>
  );
}

export default MediaItem;