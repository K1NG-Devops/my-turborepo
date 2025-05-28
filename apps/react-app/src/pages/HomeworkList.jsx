import React, { useEffect, useState } from 'react';
import HomeworkTile from '../components/Parents/HomeworkTile';
// import DashboardNav from '../components/Parents/DashboardNav';

const HomeworkList = () => {
  const [homeworks, setHomeworks] = useState([]);
  const [loading, setLoading] = useState(true);

  const className = 'Panda'; // Temporary hardcoded (to be replaced by dynamic session later)
  const grade = 'Grade RR & R';

  useEffect(() => {
    if (!className || !grade) return;
    
    const fetchHomeworks = async () => {
      try {
        const response = await fetch(
          `https://youngeagles-api-server.up.railway.app/api/homeworks/list?className=${className}&grade=${grade}`
        );
        const data = await response.json();
        setHomeworks(data);
      } catch (err) {
        console.error('Error fetching homework:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchHomeworks();
  }, []);

  if (loading) return <p>Loading...</p>;
  if (homeworks.length === 0) return <p>No homework found for {className} / {grade}.</p>;

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
