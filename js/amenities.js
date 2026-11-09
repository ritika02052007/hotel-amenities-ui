export const CATEGORIES = ['All', 'Wellness', 'Dining', 'Leisure', 'Services'];

export const AMENITIES = [
  { id: 1, name: 'Rooftop Spa', category: 'Wellness', description: 'Massage and steam rooms with city views.', hours: '9am to 9pm', status: 'Open' },
  { id: 2, name: 'Garden Breakfast', category: 'Dining', description: 'Seasonal breakfast served in the courtyard.', hours: '7am to 11am', status: 'Open' },
  { id: 3, name: 'Plunge Pool', category: 'Leisure', description: 'Heated pool with towel service.', hours: '8am to 8pm', status: 'Open' },
  { id: 4, name: 'In-room Dining', category: 'Dining', description: 'Full menu delivered to the room.', hours: '24 hours', status: 'Open' },
  { id: 5, name: 'Private Yoga', category: 'Wellness', description: 'One-to-one session with an instructor.', hours: '6am to 6pm', status: 'By appointment' },
  { id: 6, name: 'Library Lounge', category: 'Leisure', description: 'Quiet reading room with tea and coffee.', hours: '10am to 10pm', status: 'Closed' },
  { id: 7, name: 'Laundry Service', category: 'Services', description: 'Same-day wash and press.', hours: '8am to 5pm', status: 'Open' },
  { id: 8, name: 'Airport Transfer', category: 'Services', description: 'Chauffeured pickup and drop-off.', hours: '24 hours', status: 'By appointment' }
];

export function fetchAmenities({ fail = false, delay = 600 + Math.random() * 900 } = {}) {
  return new Promise((resolve, reject) => {
    setTimeout(() => (fail ? reject(new Error('Network error')) : resolve(AMENITIES.map((a) => ({ ...a })))), delay);
  });
}

export function filterAmenities(list, { query = '', category = 'All' } = {}) {
  const q = query.trim().toLowerCase();
  return list.filter((a) =>
    (category === 'All' || a.category === category) &&
    (!q || `${a.name} ${a.description} ${a.category}`.toLowerCase().includes(q)));
}

const STATUS_ORDER = { Open: 0, 'By appointment': 1, Closed: 2 };

export function sortAmenities(list, key = 'name') {
  const copy = [...list];
  if (key === 'status') return copy.sort((a, b) => STATUS_ORDER[a.status] - STATUS_ORDER[b.status] || a.name.localeCompare(b.name));
  return copy.sort((a, b) => a[key].localeCompare(b[key]) || a.name.localeCompare(b.name));
}
