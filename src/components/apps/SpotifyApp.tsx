"use client";
import { useRef } from "react";

export default function SpotifyApp() {
  const iframeRef = useRef<HTMLIFrameElement | null>(null);

  const embedUrl = `https://open.spotify.com/embed/playlist/37i9dQZEVXbLZ52XmnySJg`;

  return (
    <div className="relative w-full h-full bg-ub-cool-grey overflow-hidden">
      <iframe
        ref={iframeRef}
        src={embedUrl}
        title="Spotify Embedded Playlist"
        aria-label="Spotify Embedded Playlist"
        frameBorder="0"
        allow="autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture"
        allowFullScreen
        className="absolute top-0 left-0 w-full h-full rounded-none"
        style={{
          borderRadius: 0,
        }}
      />
    </div>
  );
}
