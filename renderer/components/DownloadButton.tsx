'use client';

import { MouseEvent } from 'react';

export function DownloadButton() {
  function downloadClickHandler(e: MouseEvent<HTMLButtonElement>) {
    alert('Download clicked');
  }

  return (
    <button onClick={downloadClickHandler} className="w-fit text-primary">
      &gt; <span className="underline">Download RMiM</span>
    </button>
  );
}
