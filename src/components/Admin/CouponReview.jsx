import React, { useEffect, useState } from 'react';

export default function CouponReview() {
  const [coupons, setCoupons] = useState([]);

  useEffect(() => {
  //من firebase
    setCoupons([
      { id: 1, title: 'كوبون طعام - 50 جنيه', quantity: 20 },
      { id: 2, title: 'كوبون خبز - 30 جنيه', quantity: 10 },
    ]);
  }, []);

  return (
    <div>
      {coupons.map((coupon) => (
        <div key={coupon.id}>
          <p>{coupon.title}</p>
          <p>الكمية: {coupon.quantity}</p>
        </div>
      ))}
    </div>
  );
}
