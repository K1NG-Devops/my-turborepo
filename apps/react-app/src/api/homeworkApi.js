const API_BASE = 'https://youngeagles-api-server.up.railway.app/api/homeworks';

export const fetchHomeworks = async (className, grade) => {
  try {
    const res = await fetch(`${API_BASE}/list?className=${className}&grade=${grade}`);
    if (!res.ok) throw new Error('Failed to fetch homeworks');
    return await res.json();
  } catch (err) {
    console.error(err);
    return [];
  }
};
