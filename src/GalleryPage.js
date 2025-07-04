import React, { useState, useEffect, useCallback } from 'react';
import { useAuth } from './AuthContext';
import MediaUploader from './MediaUploader';
import MediaGallery from './MediaGallery';

function GalleryPage() {
  const { isAuthenticated } = useAuth();
  const [mediaList, setMediaList] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchMedia = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const response = await fetch('https://vowly-backend.vowly.workers.dev/media');
      if (!response.ok) throw new Error('Failed to fetch media');
      const data = await response.json();
      setMediaList(data);
    } catch (error) {
      console.error('Error fetching media:', error);
      setError('Could not load the media gallery. Please try refreshing the page.');
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchMedia();
  }, [fetchMedia]);

  return (
    <div className="container mx-auto p-4 md:p-8 space-y-8">
      {error && <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative" role="alert"><span className="block sm:inline">{error}</span></div>}
      {isAuthenticated && <MediaUploader onUploadSuccess={fetchMedia} />}
      {isLoading ? (
        <div className="text-center p-10"><p className="text-gray-500">Loading gallery...</p></div>
      ) : (
        <MediaGallery mediaList={mediaList} />
      )}
    </div>
  );
}

export default GalleryPage;