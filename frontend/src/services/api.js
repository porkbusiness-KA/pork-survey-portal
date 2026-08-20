const API_BASE_URL = '/api';

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
  const response = await fetch(`${API_BASE_URL}/stats`);
  if (!response.ok) {
    throw new Error('Failed to fetch stats');
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
  const response = await fetch(`${API_BASE_URL}/surveys/${id}`, {
    method: 'DELETE'
  });
  if (!response.ok) {
    throw new Error('Failed to delete survey');
  }
  return response.json();
}

export function getExportCSVUrl() {
  return `${API_BASE_URL}/export`;
}
