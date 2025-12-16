import { Client } from './client';
declare global {
    interface Window {
        orbsClient: Client;
    }
}
