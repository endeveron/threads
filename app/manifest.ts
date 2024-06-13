import { MetadataRoute } from 'next';

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: 'Threads - Share your thoughts',
    short_name: 'Threads',
    description:
      'Share your thoughts, follow interesting people and topics, engage in real-time discussions',
    start_url: '/',
    display: 'standalone',
    background_color: '#9d174d',
    theme_color: '#9d174d',
    icons: [
      {
        src: '/icons/favicon.ico',
        sizes: '256x256 192x192 128x128 96x96 64x64 32x32 24x24 16x16',
        type: 'image/ico',
      },
      {
        src: '/icons/icon.svg',
        sizes: 'any',
        type: 'image/svg+xml',
      },
    ],
  };
}
