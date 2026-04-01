import { Scale } from 'lucide-react';
import { Link } from 'react-router-dom';
import { SITE_CONFIG } from '@/config/site';
import { categories } from '@/lib/categories';
import { guides } from '@/lib/guides';

const Footer = () => (
  <footer className="bg-foreground text-white/70 py-16">
    <div className="max-w-5xl mx-auto px-4">
      <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-10 mb-12">
        {/* Brand */}
        <div>
          <Link to="/" className="flex items-center gap-2 mb-3">
            <Scale className="w-5 h-5 text-white" />
            <span className="font-bold text-white text-lg">{SITE_CONFIG.name}</span>
          </Link>
          <p className="text-sm leading-relaxed">
            {SITE_CONFIG.description}
          </p>
        </div>

        {/* Categories */}
        <div>
          <h4 className="font-bold text-white mb-3 text-sm uppercase tracking-wider">Ärenden</h4>
          <ul className="space-y-2 text-sm">
            {categories.map(cat => (
              <li key={cat.slug}>
                <Link to={`/${cat.slug}`} className="hover:text-white transition-colors">
                  {cat.emoji} {cat.title}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        {/* Guides */}
        <div>
          <h4 className="font-bold text-white mb-3 text-sm uppercase tracking-wider">Guider</h4>
          <ul className="space-y-2 text-sm">
            {guides.map(guide => (
              <li key={guide.slug}>
                <Link to={`/guide/${guide.slug}`} className="hover:text-white transition-colors">
                  {guide.title}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        {/* Resources */}
        <div>
          <h4 className="font-bold text-white mb-3 text-sm uppercase tracking-wider">Resurser</h4>
          <ul className="space-y-2 text-sm">
            <li><Link to="/guider" className="hover:text-white transition-colors">Alla guider</Link></li>
            <li><Link to="/faq" className="hover:text-white transition-colors">Vanliga frågor</Link></li>
            <li><Link to="/om-oss" className="hover:text-white transition-colors">Om oss</Link></li>
            <li><a href="https://www.konsumentverket.se" target="_blank" rel="noopener noreferrer" className="hover:text-white transition-colors">Konsumentverket</a></li>
            <li><a href="https://www.arn.se" target="_blank" rel="noopener noreferrer" className="hover:text-white transition-colors">ARN</a></li>
            <li><a href="https://www.hyresnamnden.se" target="_blank" rel="noopener noreferrer" className="hover:text-white transition-colors">Hyresnämnden</a></li>
            <li><a href="https://www.kronofogden.se" target="_blank" rel="noopener noreferrer" className="hover:text-white transition-colors">Kronofogden</a></li>
          </ul>
        </div>
      </div>

      {/* Disclaimer */}
      <div className="border-t border-white/10 pt-8">
        <p className="text-xs leading-relaxed text-white/50 mb-4">
          {SITE_CONFIG.disclaimer}
        </p>
        <p className="text-xs text-white/40">
          © {new Date().getFullYear()} {SITE_CONFIG.name} — {SITE_CONFIG.tagline}
        </p>
      </div>
    </div>
  </footer>
);

export default Footer;
