import { Client } from './client';

declare global {
  interface Window {
    orbsClient: Client;
  }
}

// Note: User needs to call init() and provide seedIP
// This is a placeholder - user should initialize with: window.orbsClient = new Client(seedIP);
window.orbsClient = new Client('');
