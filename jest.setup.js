// jest.setup.js
import '@testing-library/jest-dom';

const { TextEncoder, TextDecoder } = require('util');

global.TextEncoder = TextEncoder;
global.TextDecoder = TextDecoder;

// --- CRITICAL GLOBAL MOCK FOR window.location (based on jsdom/jsdom#3739) ---
// This is the most robust way to make window.location and its methods mockable
// in Jest's JSDOM environment, by completely redefining the 'window' object's
// properties to be configurable. This code must run very early in the Jest setup process.

// Save reference to the original window for potential restoration (though not strictly needed in tests).
const originalWindow = global.window;

// Step 1: Get all property descriptors from the original window object
const propertyDescriptors = Object.getOwnPropertyDescriptors(originalWindow);

// Step 2: Make all properties configurable
for (const key in propertyDescriptors) {
  // Ensure the property exists and is not inherited from prototype chain
  if (Object.prototype.hasOwnProperty.call(propertyDescriptors, key)) {
    propertyDescriptors[key].configurable = true;
  }
}

// Step 3: Create a new window object with all properties redefined as configurable
const clonedWindow = Object.defineProperties({}, propertyDescriptors);

// Step 4: Ensure essential global constructors/objects are available on the cloned window
// Add any other globals your tests rely on directly from `window` if they are missing
clonedWindow.Event = originalWindow.Event;
clonedWindow.URL = originalWindow.URL;
clonedWindow.Node = originalWindow.Node;
clonedWindow.HTMLElement = originalWindow.HTMLElement;
clonedWindow.HTMLInputElement = originalWindow.HTMLInputElement;
clonedWindow.HTMLTextAreaElement = originalWindow.HTMLTextAreaElement;
clonedWindow.HTMLSelectElement = originalWindow.HTMLSelectElement;
// Add more if your code requires them (e.g., XMLHttpRequest, WebSocket, localStorage, etc.)

// Step 5: Define the 'location' property on the cloned window to be fully mockable.
// This sets up window.location to return a mock object that can be spied on.
let mockLocationObject = {
  // Common properties of window.location
  href: 'http://localhost/',
  origin: 'http://localhost',
  protocol: 'http:',
  host: 'localhost',
  hostname: 'localhost',
  port: '',
  pathname: '/',
  search: '',
  hash: '',

  // Mock methods as Jest functions directly
  assign: jest.fn(),
  reload: jest.fn(), // This is the key: reload is now a Jest mock function
  replace: jest.fn(),
};

Object.defineProperty(clonedWindow, 'location', {
  configurable: true,
  enumerable: true,
  get: () => mockLocationObject, // Always return our mock object
  set: (value) => {
    // If something tries to assign to window.location directly, update our mock.
    // This allows `window.location = 'newurl'` syntax to work.
    if (typeof value === 'string') {
      const url = new URL(value, mockLocationObject.href);
      mockLocationObject.href = url.href;
      mockLocationObject.origin = url.origin;
      mockLocationObject.protocol = url.protocol;
      mockLocationObject.host = url.host;
      mockLocationObject.hostname = url.hostname;
      mockLocationObject.port = url.port;
      mockLocationObject.pathname = url.pathname;
      mockLocationObject.search = url.search;
      mockLocationObject.hash = url.hash;
    } else {
      console.warn('Attempted to set window.location to a non-string value:', value);
    }
  },
});

// Step 6: Replace the global window object with our cloned, mockable one.
global.window = clonedWindow;
global.document = clonedWindow.document; // Ensure document is also from the cloned window
global.navigator = clonedWindow.navigator; // Ensure navigator is also from the cloned window

// Note: jest.clearAllMocks() in beforeEach will clear the call history of mockLocationObject's methods.
// --- END CRITICAL GLOBAL MOCK ---
