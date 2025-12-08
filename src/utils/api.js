const BASE_URL = 'https://reeze-portfolio-api.up.railway.app/api/v1'; 

export const api = async (endpoint) => {
  const res = await fetch(`${BASE_URL}${endpoint}`);
  
  if (!res.ok) {
    throw new Error(`API Error: ${res.statusText}`);
  }
  
  const json = await res.json();

  return json.data; 
};