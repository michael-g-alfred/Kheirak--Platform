import React, { useEffect, useState } from 'react';

export default function Stats() {
  const [stats, setStats] = useState({
    users: 0,
    offers: 0,
  });

  useEffect(() => {
//البيانات من firebase
    setStats({
      users: 124,//بيانات وهمية 
      offers: 38,
    });
  }, []);

  return (
    <div>
      <p>عدد المحتاجين: {stats.users}</p>
      <p>عدد العروض النشطة: {stats.offers}</p>
    </div>
  );
}
