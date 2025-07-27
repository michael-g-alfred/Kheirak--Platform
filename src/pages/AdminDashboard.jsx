import React from 'react';
import Stats from '../components/Admin/Stats';
import PostReview from '../components/Admin/PostReview';
import CouponReview from '../components/Admin/CouponReview';

export default function AdminDashboard() {
  return (
    <div>
      <h1>لوحة تحكم الأدمن</h1>
      <Stats />
      <hr />
      <h2>مراجعة البوستات</h2>
      <PostReview />
      <hr />
      <h2>مراجعة الكوبونات</h2>
      <CouponReview />
    </div>
  );
}