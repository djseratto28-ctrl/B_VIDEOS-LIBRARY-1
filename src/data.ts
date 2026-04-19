import { Movie } from './App';

export const INITIAL_MOVIES: Movie[] = [
  {
    id: '1',
    title: 'Inception Luganda',
    description: 'A thief who steals corporate secrets through the use of dream-sharing technology is given the inverse task of planting an idea into the mind of a C.E.O.',
    category: 'Sci-Fi',
    videoUrl: 'https://www.youtube.com/watch?v=YoHD9XEInc0',
    thumbnailUrl: 'https://picsum.photos/seed/inception/800/1200',
    downloadUrl: 'https://example.com/dl/inception',
    vj: 'VJ Emmy',
    quality: '4K ULTRA HD',
    order: 1,
    releaseYear: 2010,
    views: 12450
  },
  {
    id: '2',
    title: 'The Dark Knight Translated',
    description: 'When the menace known as the Joker wreaks havoc and chaos on the people of Gotham, Batman must accept one of the greatest psychological and physical tests of his ability to fight injustice.',
    category: 'Action',
    videoUrl: 'https://www.youtube.com/watch?v=EXeTwQWrcwY',
    thumbnailUrl: 'https://picsum.photos/seed/darkknight/800/1200',
    downloadUrl: 'https://example.com/dl/darkknight',
    vj: 'VJ Mark',
    quality: 'HD',
    order: 2,
    releaseYear: 2008,
    views: 9800
  },
  {
    id: '3',
    title: 'Interstellar Luganda Edition',
    description: 'A team of explorers travel through a wormhole in space in an attempt to ensure humanity\'s survival.',
    category: 'Adventure',
    videoUrl: 'https://www.youtube.com/watch?v=zSWdZVtXT7E',
    thumbnailUrl: 'https://picsum.photos/seed/interstellar/800/1200',
    downloadUrl: 'https://example.com/dl/interstellar',
    vj: 'VJ Junior',
    quality: 'HDR',
    order: 3,
    releaseYear: 2014,
    views: 15600
  },
  {
    id: '4',
    title: 'Avatar Way of Water',
    description: 'Jake Sully lives with his newfound family formed on the extrasolar moon Pandora. Once a familiar threat returns to finish what was previously started, Jake must work with Neytiri and the army of the Na\'vi race to protect their home.',
    category: 'Sci-Fi',
    videoUrl: 'https://www.youtube.com/watch?v=d9MyW72ELq0',
    thumbnailUrl: 'https://picsum.photos/seed/avatar/800/1200',
    downloadUrl: 'https://example.com/dl/avatar',
    vj: 'VJ Emmy',
    quality: '4K',
    order: 4,
    releaseYear: 2022,
    views: 22000
  }
];
