'use client';

import { useEffect } from 'react';

export default function GitHubRedirectScreen() {
  const url = 'https://github.com/sarthakgarg1204';
  const appId = 'github';

  useEffect(() => {
    const timer = setTimeout(() => {
      window.open(url, '_blank');

      window.dispatchEvent(new CustomEvent('closeWindow', { detail: appId }));
    }, 800); // Delay to let the user read the message

    return () => clearTimeout(timer);
  }, []);

  return (
    <div className="p-6 text-white font-mono text-sm">
      🔗 Redirecting you to <span className="text-blue-400 underline">{url}</span>...
    </div>
  );
}
