import { useLocation } from 'react-router-dom';
import React, { useEffect, useState } from 'react';
import HomeworkTile from '../components/Parents/HomeworkTile';

const HomeworkList = () => {
  const [homeworks, setHomeworks] = useState([]);
  const [loading, setLoading] = useState(true);

  const location = useLocation();
  const params = new URLSearchParams(location.search);
  const className = params.get('className');
  const grade = params.get('grade');

  useEffect(() => {
    if (!className || !grade) return;

    const fetchHomeworks = async () => {
      try {
        const response = await fetch(
          `https://youngeagles-api-server.up.railway.app/api/homeworks/list?className=${className}&grade=${grade}`
        );
        const data = await response.json();

        if (Array.isArray(data)) {
          setHomeworks(data);
        } else {
          console.error('Expected array, got:', data);
          setHomeworks([]);
        }
      } catch (err) {
        console.error('Error fetching homework:', err);
        setHomeworks([]);
      } finally {
        setLoading(false);
      }
    };

    fetchHomeworks();
  }, [className, grade]);

  if (loading) return <p>Loading...</p>;
  if (homeworks.length === 0)
    return <p>No homework found for {className} / {grade}.</p>;

  return (
    <div className="max-w-3xl mx-auto mt-10">
      <h1 className="text-2xl font-bold mb-6">📚 Homework List</h1>
      {homeworks.map(hw => (
        <HomeworkTile key={hw.id} {...hw} />
      ))}
    </div>
  );
};

export default HomeworkList;
