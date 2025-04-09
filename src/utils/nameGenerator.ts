// server/src/utils/nameGenerator.ts
const adjectives = [
  'Autumn', 'Hidden', 'Bitter', 'Misty', 'Silent', 'Empty', 'Dry', 'Dark',
  'Summer', 'Icy', 'Delicate', 'Quiet', 'White', 'Cool', 'Spring', 'Winter',
  'Patient', 'Twilight', 'Dawn', 'Crimson', 'Wispy', 'Weathered', 'Blue',
  'Billowing', 'Broken', 'Cold', 'Damp', 'Falling', 'Frosty', 'Green',
  'Long', 'Late', 'Lingering', 'Bold', 'Little', 'Morning', 'Muddy', 'Old',
  'Red', 'Rough', 'Still', 'Small', 'Sparkling', 'Throbbing', 'Shy',
  'Wandering', 'Withered', 'Wild', 'Black', 'Young', 'Holy', 'Solitary',
  'Fragrant', 'Aged', 'Snowy', 'Proud', 'Floral', 'Restless', 'Divine',
  'Polished', 'Ancient', 'Purple', 'Lively', 'Nameless'
];

const nouns = [
  'Waterfall', 'River', 'Breeze', 'Moon', 'Rain', 'Wind', 'Sea', 'Morning',
  'Snow', 'Lake', 'Sunset', 'Pine', 'Shadow', 'Leaf', 'Dawn', 'Glitter',
  'Forest', 'Hill', 'Cloud', 'Meadow', 'Sun', 'Glade', 'Bird', 'Brook',
  'Butterfly', 'Bush', 'Dew', 'Dust', 'Field', 'Fire', 'Flower', 'Firefly',
  'Feather', 'Grass', 'Haze', 'Mountain', 'Night', 'Pond', 'Darkness',
  'Snowflake', 'Silence', 'Sound', 'Sky', 'Shape', 'Surf', 'Thunder',
  'Violet', 'Water', 'Wildflower', 'Wave', 'Water', 'Resonance', 'Star',
  'Beam', 'Gleam', 'Crystal', 'Dream', 'Whisper', 'Shard', 'Luminance'
];

export function generateName(): string {
  const randomAdjective = adjectives[Math.floor(Math.random() * adjectives.length)];
  const randomNoun = nouns[Math.floor(Math.random() * nouns.length)];
  return `${randomAdjective}${randomNoun}`;
}