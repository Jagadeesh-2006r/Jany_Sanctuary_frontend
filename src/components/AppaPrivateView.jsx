import React from 'react';
import AppaPrivateDashboard from './AppaPrivateDashboard.jsx';

export const API_BASE = "https://jany-sanctuary-backend.onrender.com";

/**
 * Fetch confidential messages from backend
 */
export async function getMessages() {
  try {
    const response = await fetch(`${API_BASE}/api/messages`, {
      method: 'GET',
      headers: { 'Content-Type': 'application/json' },
    });
    const json = await response.json();
    console.log('Fetched messages data array from server:', json.data || json);
    return json;
  } catch (err) {
    console.error('Error fetching messages from Render backend:', err);
    throw err;
  }
}

export default AppaPrivateDashboard;
