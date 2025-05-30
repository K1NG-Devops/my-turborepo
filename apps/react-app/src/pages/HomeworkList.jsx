import { useEffect, useState } from 'react';
import axios from 'axios';

const HomeworkList = () => {
  const [homeworks, setHomeworks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Replace with however you store parent ID
  const parentId = localStorage.getItem('parentId'); 

  useEffect(() => {
    const fetchHomeworks = async () => {
      try {
        const token = localStorage.getItem('token'); // Or use a context
        const response = await axios.get(
          `https://youngeagles-api-server.up.railway.app/api/homeworks/for-parent/${parentId}`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        setHomeworks(response.data.homeworks || []);
      } catch (err) {
        console.error('Error fetching homeworks:', err);
        setError('Could not load homework list');
      } finally {
        setLoading(false);
      }
    };

    fetchHomeworks();
  }, [parentId]);

  if (loading) return <p>Loading homeworks...</p>;
  if (error) return <p>{error}</p>;

  return (
    <div className="p-4">
      <h2 className="text-xl font-semibold mb-4">Homework List</h2>
      {homeworks.length === 0 ? (
        <p>No homework available for your child’s class.</p>
      ) : (
        <ul className="space-y-2">
          {homeworks.map(hw => (
            <li key={hw.id} className="p-3 border rounded shadow">
              <h3 className="text-lg font-medium">{hw.title}</h3>
              <p>Due: {new Date(hw.due_date).toLocaleDateString()}</p>
              <p>Class: {hw.class_name}</p>
              <a
                href={hw.file_url}
                target="_blank"
                rel="noopener noreferrer"
                className="text-blue-500 underline"
              >
                View Homework
              </a>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default HomeworkList;
