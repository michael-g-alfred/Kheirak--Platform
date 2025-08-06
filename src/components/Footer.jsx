import React from "react";
import { Link } from "react-router-dom";

export default function Footer() {
  return (
    <footer>
      <div>
        {/* روابط التنقل */}
        <div>
          <h3>روابط</h3>
          <ul>
            <li>
              <Link to="/about">عن الموقع</Link>
            </li>
            <li>
              <Link to="/privacy">الخصوصية</Link>
            </li>
            <li>
              <Link to="/support">الدعم</Link>
            </li>
          </ul>
        </div>

        {/* روابط التواصل */}
        <div>
          <h3>تابعنا</h3>
          <ul>
            <li>
              <a href="https://facebook.com" target="_blank" rel="noreferrer">فيسبوك</a>
            </li>
            <li>
              <a href="https://twitter.com" target="_blank" rel="noreferrer">تويتر</a>
            </li>
            <li>
              <a href="https://instagram.com" target="_blank" rel="noreferrer">انستجرام</a>
            </li>
          </ul>
        </div>

        {/* معلومات التواصل */}
        <div>
          <h3>تواصل معنا</h3>
          <p>البريد: support@example.com</p>
          <p>الهاتف: +201234567890</p>
        </div>
      </div>

      <div>
        © {new Date().getFullYear()} جميع الحقوق محفوظة.
      </div>
    </footer>
  );
}
