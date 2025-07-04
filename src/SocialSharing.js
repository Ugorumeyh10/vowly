import React from "react";

const FacebookIcon = () => <svg viewBox="0 0 24 24" fill="currentColor" className="w-6 h-6"><path d="M22 12c0-5.52-4.48-10-10-10S2 6.48 2 12c0 4.84 3.44 8.87 8 9.8V15H8v-3h2V9.5C10 7.57 11.57 6 13.5 6H16v3h-2c-.55 0-1 .45-1 1v2h3v3h-3v6.95c5.05-.5 9-4.76 9-9.95z"></path></svg>;
const XIcon = () => <svg viewBox="0 0 24 24" fill="currentColor" className="w-6 h-6"><path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"></path></svg>;
const InstagramIcon = () => <svg viewBox="0 0 24 24" fill="currentColor" className="w-6 h-6"><path d="M7.8 2h8.4C19.4 2 22 4.6 22 7.8v8.4a5.8 5.8 0 0 1-5.8 5.8H7.8C4.6 22 2 19.4 2 16.2V7.8A5.8 5.8 0 0 1 7.8 2m-.2 2A3.6 3.6 0 0 0 4 7.6v8.8C4 18.39 5.61 20 7.6 20h8.8c1.99 0 3.6-1.61 3.6-3.6V7.6C20 5.61 18.39 4 16.4 4H7.6m9.65 1.5a1.25 1.25 0 0 1 1.25 1.25A1.25 1.25 0 0 1 17.25 8 1.25 1.25 0 0 1 16 6.75a1.25 1.25 0 0 1 1.25-1.25M12 7a5 5 0 0 1 5 5 5 5 0 0 1-5 5 5 5 0 0 1-5-5 5 5 0 0 1 5-5m0 2a3 3 0 0 0-3 3 3 3 0 0 0 3 3 3 3 0 0 0 3-3 3 3 0 0 0-3-3z"></path></svg>;

function SocialSharing({ mediaUrl }) {
  const text = encodeURIComponent("Check out this photo from the wedding!");

  const facebookShareUrl = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(mediaUrl)}`;
  const xShareUrl = `https://twitter.com/intent/tweet?url=${encodeURIComponent(mediaUrl)}&text=${text}`;

  return (
    <div className="flex items-center space-x-4 mt-4">
      <span className="text-sm font-medium text-gray-600">Share on:</span>
      <a
        href={facebookShareUrl}
        target="_blank"
        rel="noopener noreferrer"
        className="text-gray-500 hover:text-blue-600 transition-colors"
        aria-label="Share on Facebook"
      >
        <FacebookIcon />
      </a>
      <a
        href={xShareUrl}
        target="_blank"
        rel="noopener noreferrer"
        className="text-gray-500 hover:text-black transition-colors"
        aria-label="Share on X"
      >
        <XIcon />
      </a>
      <a
        href="https://instagram.com"
        target="_blank"
        rel="noopener noreferrer"
        className="text-gray-500 hover:text-pink-600 transition-colors"
        aria-label="Share on Instagram"
        title="Instagram sharing must be done from a mobile device."
      >
        <InstagramIcon />
      </a>
    </div>
  );
}

export default SocialSharing;