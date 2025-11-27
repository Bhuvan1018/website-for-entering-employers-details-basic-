import React, { useEffect, useState } from 'react';

const Clock: React.FC = () => {
  const [now, setNow] = useState<Date>(new Date());

  useEffect(() => {
    const id = setInterval(() => setNow(new Date()), 1000);
    return () => clearInterval(id);
  }, []);

  const dateStr = now.toLocaleDateString(undefined, { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' });
  const timeStr = now.toLocaleTimeString();

  return (
    <div className="flex items-baseline justify-between mb-6">
      <div className="text-sm text-gray-600">{dateStr}</div>
      <div className="text-sm font-semibold text-blue-900">{timeStr}</div>
    </div>
  );
};

export default Clock;


