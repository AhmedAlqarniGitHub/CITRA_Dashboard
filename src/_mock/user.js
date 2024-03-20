import { sample } from 'lodash';
import { faker } from '@faker-js/faker';

// ----------------------------------------------------------------------

const predefinedNames = ['Ahmed Alqarni', 'Bander Alghamdi', 'Waleed Alfaifi', 'Turki ', 'Sara', 'Fiona', 'George', 'Hannah', 'Ian', 'Julia'];
const predefinedEvents = ['Tech Summit', 'Annual Conference', 'Innovation Expo', 'KFUPM Expo', 'Networking Meetup'];

export const users = [...Array(24)].map((_, index) => ({
  id: faker.string.uuid(), // Generates a unique identifier
  avatarUrl: `/assets/images/avatars/avatar_${index + 1}.jpg`,
  name: predefinedNames[index % predefinedNames.length], // Cycles through the predefined names
  eventName: predefinedEvents[index % predefinedEvents.length], // Cycles through the predefined events
  isVerified: faker.datatype.boolean(), // Randomly assigns a boolean value for verification status
  status: ['active', 'inactive'][faker.datatype.number({ min: 0, max: 1 })], // Randomly sets the status to either 'active' or 'inactive'
  role: ['CITRA Admin', 'Event Organizer'][faker.datatype.number({ min: 0, max: 1 })], // Randomly assigns one of the three roles
}));


