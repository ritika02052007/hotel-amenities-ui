export function validateRequest({ name = '', room = '', amenity = '', time = '', notes = '' }) {
  const errors = {};
  if (!name.trim()) errors.name = 'Enter the guest name.';
  if (!/^\d{3,4}$/.test(room.trim())) errors.room = 'Enter a room number with 3 or 4 digits.';
  if (!amenity) errors.amenity = 'Choose an amenity.';
  if (!time) errors.time = 'Choose a preferred time.';
  if (notes.length > 300) errors.notes = 'Keep notes under 300 characters.';
  return errors;
}
