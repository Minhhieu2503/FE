export interface Studio {
  id: string;
  name: string;
  rating: number;
  priceLevel: number; // 1 to 3 ($)
  location: string;
  tags: string[];
  image: string;
}

export const CATEGORIES = [
  { id: '1', name: 'All', count: 12 },
  { id: '2', name: 'Wedding', count: 5 },
  { id: '3', name: 'Lookbook', count: 3 },
  { id: '4', name: 'Nature', count: 2 },
  { id: '5', name: 'Portrait', count: 2 },
];

export const MOCK_STUDIOS: Studio[] = [
  {
    id: '1',
    name: 'Lumina Studio',
    rating: 4.9,
    priceLevel: 2,
    location: 'Paris',
    tags: ['Chic'],
    image: 'https://images.unsplash.com/photo-1598488035139-bdbb2231ce04?q=80&w=500&auto=format&fit=crop',
  },
  {
    id: '2',
    name: 'Verdant Frames',
    rating: 4.8,
    priceLevel: 3,
    location: 'Milan',
    tags: ['Eco'],
    image: 'https://images.unsplash.com/photo-1516035069371-29a1b244cc32?q=80&w=500&auto=format&fit=crop',
  },
  {
    id: '3',
    name: 'Focus Artistry',
    rating: 5.0,
    priceLevel: 1,
    location: 'London',
    tags: ['Retro'],
    image: 'https://images.unsplash.com/photo-1542038784456-1ea8e935640e?q=80&w=500&auto=format&fit=crop',
  },
  {
    id: '4',
    name: 'Aether Captures',
    rating: 4.7,
    priceLevel: 2,
    location: 'Berlin',
    tags: ['Minimal'],
    image: 'https://images.unsplash.com/photo-1493863641943-9b68991a8d07?q=80&w=500&auto=format&fit=crop',
  },
];
