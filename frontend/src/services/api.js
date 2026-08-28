const API_BASE_URL = '/api';

// Admin Token Helpers (persisted in sessionStorage)
export function getAdminToken() {
  try {
    return sessionStorage.getItem('pork_admin_token') || '';
  } catch (e) {
    return '';
  }
}

export function setAdminToken(token) {
  try {
    if (token) {
      sessionStorage.setItem('pork_admin_token', token);
    } else {
      sessionStorage.removeItem('pork_admin_token');
    }
  } catch (e) {}
}

export function clearAdminToken() {
  try {
    sessionStorage.removeItem('pork_admin_token');
  } catch (e) {}
}

export function isAdminLoggedIn() {
  return Boolean(getAdminToken());
}

export async function verifyAdminPin(pin) {
  const response = await fetch(`${API_BASE_URL}/auth/verify`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ pin })
  });

  const data = await response.json();
  if (!response.ok || !data.success) {
    throw new Error(data.message || 'Authentication failed');
  }

  setAdminToken(data.token || pin);
  return data;
}

export async function submitSurvey(formData) {
  const isMultipart = formData instanceof FormData;
  
  const response = await fetch(`${API_BASE_URL}/surveys`, {
    method: 'POST',
    body: formData,
    headers: isMultipart ? {} : { 'Content-Type': 'application/json' }
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(errorData.message || 'Failed to submit survey');
  }

  return response.json();
}

export async function updateSurvey(id, formData) {
  const isMultipart = formData instanceof FormData;
  const token = getAdminToken();
  const headers = isMultipart ? {} : { 'Content-Type': 'application/json' };
  if (token) {
    headers['x-admin-pin'] = token;
  }
  
  const response = await fetch(`${API_BASE_URL}/surveys/${id}`, {
    method: 'PUT',
    body: formData,
    headers
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(errorData.message || 'Failed to update survey');
  }

  return response.json();
}

export async function fetchSurveys(params = {}) {
  const query = new URLSearchParams();
  if (params.district && params.district !== 'All') query.append('district', params.district);
  if (params.license && params.license !== 'All') query.append('license', params.license);
  if (params.search) query.append('search', params.search);
  if (params.minRating) query.append('minRating', params.minRating);

  const url = `${API_BASE_URL}/surveys${query.toString() ? `?${query.toString()}` : ''}`;
  const response = await fetch(url);
  
  if (!response.ok) {
    throw new Error('Failed to fetch surveys');
  }

  return response.json();
}

export async function fetchSurveyStats() {
  const token = getAdminToken();
  const headers = {};
  if (token) {
    headers['x-admin-pin'] = token;
  }

  const response = await fetch(`${API_BASE_URL}/stats`, { headers });
  if (!response.ok) {
    throw new Error('Failed to fetch stats (Admin access required)');
  }
  return response.json();
}

export async function fetchSurveyById(id) {
  const response = await fetch(`${API_BASE_URL}/surveys/${id}`);
  if (!response.ok) {
    throw new Error('Failed to fetch survey details');
  }
  return response.json();
}

export async function deleteSurvey(id) {
  const token = getAdminToken();
  const headers = {};
  if (token) {
    headers['x-admin-pin'] = token;
  }

  const response = await fetch(`${API_BASE_URL}/surveys/${id}`, {
    method: 'DELETE',
    headers
  });
  if (!response.ok) {
    const err = await response.json().catch(() => ({}));
    throw new Error(err.message || 'Failed to delete survey (Admin access required)');
  }
  return response.json();
}

export function getExportCSVUrl() {
  const token = getAdminToken();
  return `${API_BASE_URL}/export${token ? `?pin=${encodeURIComponent(token)}` : ''}`;
}
