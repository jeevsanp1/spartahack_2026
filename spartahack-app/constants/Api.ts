/**
 * API Configuration
 * 
 * Replace 'localhost' with your machine's IP address if testing on a physical device.
 * Android Emulator uses '10.0.2.2' to access host localhost.
 * iOS Simulator can use 'localhost'.
 */
import { Platform } from 'react-native';

// Use your machine's LAN IP for physical device testing
// Run `ifconfig` or `ipconfig` to find it.
const HOSTED_IP = "165.232.133.82";

export const API_BASE_URL = `http://${HOSTED_IP}:3000`;
