import { faker } from '@faker-js/faker';

// Predefined sets of data for camera attributes
const manufacturers = ['Nikon', 'Canon', 'Sony', 'Panasonic', 'Fujifilm'];
const models = ['D3500', 'EOS Rebel T7', 'A6100', 'Lumix GH5', 'X-T30'];
const qualities = ['1080p', '4K', '720p'];
const fpsOptions = [24, 30, 60];

// Function to generate a single camera's random data
const getRandomCameraData = () => ({
  manufacturer: faker.helpers.arrayElement(manufacturers), // Randomly selects a manufacturer
  name: faker.helpers.arrayElement(models), // Randomly selects a model name
  supportedQuality: faker.helpers.arrayElement(qualities), // Randomly selects a supported quality
  framesPerSecond: faker.helpers.arrayElement(fpsOptions), // Randomly selects an FPS value
});

// Generate data for 24 cameras
const cameras = [...Array(24)].map(() => getRandomCameraData());

// Export the cameras array
export { cameras };

// Print the generated camera data array in the console
