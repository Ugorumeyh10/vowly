import React from 'react';
import MediaItem from './MediaItem';

function MediaGallery({ mediaList }) {
  return (
    <div className="p-6 bg-gray-50 rounded-lg shadow-inner">
      <h2 className="text-3xl font-bold text-rose-800 mb-6 text-center">Our Gallery</h2>
      {mediaList.length === 0 ? (
        <p className="text-center text-gray-500">No photos or videos have been uploaded yet. Be the first!</p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {mediaList.map((media) => <MediaItem key={media.id} media={media} />)}
        </div>
      )}
    </div>
  );
}

export default MediaGallery;