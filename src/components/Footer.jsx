import { Link } from "react-router-dom";
import FacebookIcon from "../icons/FacebookIcon";
import XIcon from "../icons/XIcon";
import InstagramIcon from "../icons/InstagramIcon";
import MailIcon from "../icons/MailIcon";
import PhoneIcon from "../icons/PhoneIcon";
import WhatsAppIcon from "../icons/WhatsAppIcon";

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
    { href: "https://instagram.com", icon: <InstagramIcon /> },
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
    <footer className="bg-[var(--color-bg-base)] text-[var(--color-primary-base)] border-t border-[var(--color-bg-divider)] py-4 px-4 shadow-xs">
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
                  className="hover:text-[var(--color-primary-hover)] transition-transform duration-200 hover:scale-110">
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
                className="w-12 h-8 flex justify-center items-center bg-[var(--color-primary-base)] text-[var(--color-bg-text)] hover:bg-[var(--color-primary-hover)] rounded-xl transition-transform duration-200 hover:scale-110">
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
                className="w-12 h-8 flex justify-center items-center bg-[var(--color-primary-base)] text-[var(--color-bg-text)] hover:bg-[var(--color-primary-hover)] rounded-xl transition-transform duration-200 hover:scale-110">
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
