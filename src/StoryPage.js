import React from 'react';

function StoryPage() {
  return (
    <div className="p-4 md:p-8">
      {/* Wide romantic picture */}
      <div className="relative w-full h-64 md:h-96 rounded-2xl shadow-2xl overflow-hidden mb-12">
        <img
          src="/img/IMG_6508.JPG"
          alt="A romantic moment of the couple"
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent"></div>
        <div className="absolute bottom-0 left-0 p-8">
          <h2 className="text-5xl md:text-7xl text-white font-great-vibes">Our Love Story</h2>
        </div>
      </div>

      {/* The Story Content */}
      <div className="bg-white/70 backdrop-blur-sm p-8 md:p-12 rounded-2xl shadow-lg max-w-4xl mx-auto">
        <p className="text-lg leading-relaxed mb-6">
          Welcome! We're so glad you're here to share in our journey. Our story is one of serendipity, laughter, and a love that grew from a simple hello into a lifelong promise.
        </p>
        <p className="text-lg leading-relaxed mb-6">
          It all began on a crisp autumn afternoon at a local coffee shop. A spilled latte and a shared laugh were all it took to spark a connection. We talked for hours, discovering a shared passion for old movies, spicy food, and the dream of traveling the world. That one chance meeting blossomed into countless adventures, from spontaneous road trips along the coast to quiet evenings spent building our future together.
        </p>
        <p className="text-lg leading-relaxed mb-6">
          Through every high and every low, our bond has only deepened. We've learned that love isn't just about the grand gestures, but about the quiet moments: the shared smiles over breakfast, the comforting hugs after a long day, and the unwavering support for each other's dreams.
        </p>
        <p className="text-lg leading-relaxed">
          Now, as we stand on the brink of forever, we are filled with gratitude for the journey that brought us here and overwhelming excitement for the chapters we have yet to write. Thank you for being a part of our story.
        </p>
      </div>
    </div>
  );
}

export default StoryPage;