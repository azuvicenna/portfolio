const BASE_URL = import.meta.env.VITE_API_URL;

export const api = async (endpoint) => {
  const res = await fetch(`${BASE_URL}${endpoint}`);

  if (!res.ok) {
    throw new Error(`API Error: ${res.statusText}`);
  }

  const json = await res.json();

  return json.data;
};

export const apiWithMeta = async (endpoint) => {
  const res = await fetch(`${BASE_URL}${endpoint}`);

  if (!res.ok) {
    throw new Error(`API Error: ${res.statusText}`);
  }

  const json = await res.json();
  return json; 
};
