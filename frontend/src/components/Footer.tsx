import React from "react";
import { Link } from "react-router-dom";
import { MapPin, Phone, Mail, Clock, Facebook, Instagram, Twitter } from "lucide-react";
import { useLanguage } from "@/contexts/LanguageContext";

const Footer = () => {
  const { t, isRTL } = useLanguage();

  return (
    <footer className="bg-foreground text-background">
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* Brand */}
          <div className="space-y-4">
            <h3 className="text-2xl font-bold text-primary">{t.restaurant.name}</h3>
            <p className="text-sm opacity-80">
              {t.footer.description}
            </p>
            <div className="flex gap-4">
              <a href="#" className="hover:text-primary transition-colors" aria-label="Facebook">
                <Facebook className="h-5 w-5" />
              </a>
              <a href="#" className="hover:text-primary transition-colors" aria-label="Instagram">
                <Instagram className="h-5 w-5" />
              </a>
              <a href="#" className="hover:text-primary transition-colors" aria-label="Twitter">
                <Twitter className="h-5 w-5" />
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div className="space-y-4">
            <h4 className="text-lg font-semibold">{t.footer.quickLinks}</h4>
            <ul className="space-y-2">
              <li>
                <Link to="/menu" className="text-sm opacity-80 hover:text-primary hover:opacity-100 transition-all">
                  {t.footer.ourMenu}
                </Link>
              </li>
              <li>
                <Link to="/about" className="text-sm opacity-80 hover:text-primary hover:opacity-100 transition-all">
                  {t.footer.aboutUs}
                </Link>
              </li>
              <li>
                <Link to="/contact" className="text-sm opacity-80 hover:text-primary hover:opacity-100 transition-all">
                  {t.footer.contactUs}
                </Link>
              </li>
              <li>
                <Link to="/loyalty" className="text-sm opacity-80 hover:text-primary hover:opacity-100 transition-all">
                  {t.footer.loyaltyProgram}
                </Link>
              </li>
            </ul>
          </div>

          {/* Contact Info */}
          <div className="space-y-4">
            <h4 className="text-lg font-semibold">{t.footer.contact}</h4>
            <ul className="space-y-3">
              <li className="flex items-start gap-3">
                <MapPin className="h-5 w-5 text-primary flex-shrink-0 mt-0.5" />
                <span className="text-sm opacity-80">
                  {isRTL ? t.restaurant.address : t.restaurant.address}
                </span>
              </li>
              <li className="flex items-center gap-3">
                <Phone className="h-5 w-5 text-primary flex-shrink-0" />
                <a href={`tel:${t.restaurant.phone}`} className="text-sm opacity-80 hover:text-primary hover:opacity-100 transition-all">
                  {t.restaurant.phone}
                </a>
              </li>
              <li className="flex items-center gap-3">
                <Mail className="h-5 w-5 text-primary flex-shrink-0" />
                <a href={`mailto:${t.restaurant.email}`} className="text-sm opacity-80 hover:text-primary hover:opacity-100 transition-all">
                  {t.restaurant.email}
                </a>
              </li>
            </ul>
          </div>

          {/* Hours */}
          <div className="space-y-4">
            <h4 className="text-lg font-semibold">{t.footer.hours}</h4>
            <div className="flex items-start gap-3">
              <Clock className="h-5 w-5 text-primary flex-shrink-0 mt-0.5" />
              <div className="text-sm opacity-80">
                <p>{t.restaurant.hoursWeekday}</p>
              </div>
            </div>
          </div>
        </div>

        <div className="border-t border-background/20 mt-8 pt-8">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4 text-center md:text-left">
            <p className="text-sm opacity-70">
              © {new Date().getFullYear()} {t.restaurant.name}. {t.footer.allRightsReserved}
            </p>
            <div className="flex gap-4 text-sm opacity-70">
              <a href="#" className="hover:opacity-100 hover:text-primary transition-all">
                {t.footer.privacyPolicy}
              </a>
              <a href="#" className="hover:opacity-100 hover:text-primary transition-all">
                {t.footer.termsOfService}
              </a>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
