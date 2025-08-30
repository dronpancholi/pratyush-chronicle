import { Link } from 'react-router-dom';
import { FileText, Mail, MapPin, ExternalLink } from 'lucide-react';

const Footer = () => {
  return (
    <footer className="bg-secondary border-t border-border">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* Brand Section */}
          <div className="lg:col-span-2">
            <div className="flex items-center space-x-3 mb-4">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary text-primary-foreground">
                <FileText className="h-6 w-6" />
              </div>
              <div>
                <h3 className="text-lg font-bold text-foreground">Pratyush Newsletter</h3>
                <p className="text-sm text-muted-foreground">Government Polytechnic Ahmedabad</p>
              </div>
            </div>
            <p className="text-muted-foreground text-sm leading-relaxed max-w-md">
              The monthly newsletter platform for the Pratyush Club, featuring 
              department-wise content, achievements, and announcements from Government Polytechnic Ahmedabad.
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-sm font-semibold text-foreground mb-4">Quick Links</h4>
            <ul className="space-y-2">
              <li>
                <Link to="/current-issue" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
                  Current Issue
                </Link>
              </li>
              <li>
                <Link to="/departments" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
                  Departments
                </Link>
              </li>
              <li>
                <Link to="/archive" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
                  Archive
                </Link>
              </li>
              <li>
                <Link to="/about" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
                  About & Contact
                </Link>
              </li>
            </ul>
          </div>

          {/* Contact Info */}
          <div>
            <h4 className="text-sm font-semibold text-foreground mb-4">Contact</h4>
            <div className="space-y-2">
              <div className="flex items-start space-x-2">
                <MapPin className="h-4 w-4 text-muted-foreground mt-0.5 flex-shrink-0" />
                <p className="text-sm text-muted-foreground">
                  Government Polytechnic<br />
                  Ahmedabad, Gujarat
                </p>
              </div>
              <div className="flex items-center space-x-2">
                <Mail className="h-4 w-4 text-muted-foreground" />
                <a 
                  href="mailto:pratyushclub@gpa.ac.in" 
                  className="text-sm text-muted-foreground hover:text-foreground transition-colors"
                >
                  pratyushclub@gpa.ac.in
                </a>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Section */}
        <div className="mt-8 pt-8 border-t border-border">
          <div className="flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
            {/* Disclaimer */}
            <div className="text-center md:text-left">
              <p className="text-xs text-muted-foreground italic">
                This is not the official newsletter of Government Polytechnic Ahmedabad.
                <br />
                Created by students, for the students.
              </p>
              <p className="text-xs text-muted-foreground mt-2" style={{ letterSpacing: '0.1em' }}>
                Crafted with care • ∂ρ
              </p>
            </div>

            {/* Copyright */}
            <div className="text-center md:text-right">
              <p className="text-sm text-muted-foreground">
                © {new Date().getFullYear()} Pratyush Club, Government Polytechnic Ahmedabad
              </p>
              <p className="text-xs text-muted-foreground mt-1">
                All rights reserved.
              </p>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;