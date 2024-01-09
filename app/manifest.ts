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
        src: '/favicon.ico',
        sizes: 'any',
        type: 'image/x-icon',
      },
      {
        src: '/icons/apple-touch-icon.png',
        sizes: '180x180',
        type: 'image/png',
      },
      {
        src: '/icons/icon.png',
        sizes: '256x256',
        type: 'image/png',
      },
      {
        src: '/icons/android-icon-192x192.png',
        sizes: '192x192',
        type: 'image/png',
      },
      {
        src: '/icons/android-icon-96x96.png',
        sizes: '96x96',
        type: 'image/png',
      },
      {
        src: '/icons/favicon-32x32.png',
        sizes: '32x32',
        type: 'image/png',
      },
      {
        src: '/icons/favicon-24x24.png',
        sizes: '24x24',
        type: 'image/png',
      },
      {
        src: '/icons/favicon-16x16.png',
        sizes: '16x16',
        type: 'image/png',
      },
    ],
  };
}
