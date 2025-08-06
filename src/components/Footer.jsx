import { Link } from "react-router-dom";
import FacebookIcon from "../icons/FaceebookIcon";
import XIcon from "../icons/XIcon";
import InstgramIcon from "../icons/InstgramIcon";
import MailIcon from "../icons/MailIcon";
import PhoneIcon from "../icons/PhoneIcon";
import WhatsAppIcon from "../icons/What'sAppIcon";

export default function Footer() {
  const navLinks = [
    { label: "من نحن", to: "/about" },
    { label: "الخدمات", to: "/services" },
    { label: "أعمالنا", to: "/portfolio" },
    { label: "تواصل معنا", to: "/contact" },
  ];

  const socialLinks = [
    { href: "https://facebook.com", icon: <FacebookIcon /> },
    { href: "https://twitter.com", icon: <XIcon /> },
    { href: "https://instagram.com", icon: <InstgramIcon /> },
  ];

  const contactInfo = [
    {
      label: "البريد",
      value: "support@example.com",
      icon: <MailIcon />,
      link: "mailto:support@example.com",
    },
    {
      label: "الهاتف",
      value: "+201234567890",
      icon: <PhoneIcon />,
      link: "tel:+201234567890",
    },
    {
      label: "واتساب",
      value: "+201234567890",
      icon: <WhatsAppIcon />,
      link: "https://wa.me/201234567890",
    },
  ];

  return (
    <footer className="bg-[var(--color-bg-base)] text-[var(--color-bg-text)] border-t border-[var(--color-bg-divider)] py-4 px-4">
      <div className="max-w-6xl mx-auto grid grid-cols-1 sm:grid-cols-3 lg:grid-cols-3 gap-8 justify-items-center items-center">
        {/* روابط التنقل */}
        <div>
          <h3 className="w-full flex items-center justify-center text-lg font-semibold mb-2">
            روابط
          </h3>
          <ul className="grid grid-cols-2 gap-x-8 gap-y-4 text-justify">
            {navLinks.map((link) => (
              <li key={link.to} className="text-right">
                <Link
                  to={link.to}
                  className="hover:text-[var(--color-primary-base)] transition">
                  {link.label}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        {/* روابط التواصل */}
        <div>
          <h3 className="w-full flex items-center justify-center text-lg font-semibold mb-2">
            تابعنا
          </h3>
          <div className="flex space-x-4">
            {socialLinks.map((link, index) => (
              <a
                key={index}
                href={link.href}
                target="_blank"
                rel="noreferrer"
                className="w-12 h-8 flex justify-center items-center bg-[var(--color-primary-base)] text-[var(--color-secondary-base)] hover:bg-[var(--color-secondary-base)] hover:text-[var(--color-bg-text)] rounded-xl hover:border border-[var(--color-bg-divider)]">
                {link.icon}
              </a>
            ))}
          </div>
        </div>

        {/* معلومات التواصل */}
        <div dir="rtl">
          <h3 className="w-full flex items-center justify-center text-lg font-semibold mb-2">
            تواصل معنا
          </h3>
          <div className="flex justify-center gap-4">
            {contactInfo.map((info) => (
              <a
                key={info.label}
                href={info.link}
                target="_blank"
                rel="noreferrer"
                className="w-12 h-8 flex justify-center items-center bg-[var(--color-primary-base)] text-[var(--color-secondary-base)] hover:bg-[var(--color-secondary-base)] hover:text-[var(--color-bg-text)] rounded-xl hover:border border-[var(--color-bg-divider)]">
                {info.icon}
              </a>
            ))}
          </div>
        </div>
      </div>

      {/* فقرة الحقوق مع الاتجاه الصحيح */}
      <div
        className="text-center text-sm mt-8 border-t border-[var(--color-bg-divider)] pt-4"
        dir="rtl">
        جميع الحقوق محفوظة © {new Date().getFullYear()}
      </div>
    </footer>
  );
}
