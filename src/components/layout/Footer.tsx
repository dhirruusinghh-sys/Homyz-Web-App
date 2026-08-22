import { Home, Globe, Share2, Rss, ArrowRight, MapPin } from 'lucide-react'

const LINKS = {
  Product:   ['Features','Pricing','Changelog','Roadmap','Integrations'],
  Company:   ['About Us','Blog','Careers','Press Kit','Contact'],
  Resources: ['Documentation','API Reference','Community','Help Center','Status Page'],
}

const OFFICES = [
  'Jakarta Garden City Street, Cakung, DKI Jakarta',
  'Pahlawan Street XVII No 215, Depok, Jawa Barat',
  'Ruko Puri Indah Residence Blok A7, Serang, Banten',
]

export default function Footer() {
  return (
    <footer className="bg-dark text-white">
      {/* Top */}
      <div className="max-w-7xl mx-auto px-6 pt-20 pb-12">
        <div className="grid lg:grid-cols-5 gap-12">
          {/* Brand */}
          <div className="lg:col-span-2">
            <div className="flex items-center gap-2 mb-5">
              <div className="w-9 h-9 rounded-xl bg-primary flex items-center justify-center">
                <Home className="w-5 h-5 text-white" />
              </div>
              <span className="font-display text-xl font-bold">H<span className="text-primary">omyz</span></span>
            </div>
            <p className="text-white/50 text-sm leading-relaxed mb-6 max-w-xs">
              Your trusted partner in finding the perfect home. Premium properties, expert agents, seamless experience.
            </p>

            {/* Newsletter */}
            <p className="text-sm font-semibold mb-3">Stay Updated</p>
            <div className="flex gap-2">
              <input
                type="email" placeholder="Your email..."
                className="flex-1 bg-white/8 border border-white/10 rounded-xl px-4 py-3 text-sm text-white placeholder:text-white/30 focus:outline-none focus:border-primary/50 transition-colors"
              />
              <button className="w-11 h-11 rounded-xl bg-primary flex items-center justify-center hover:bg-primary-dark transition-colors flex-shrink-0">
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>

            {/* Socials */}
            <div className="flex gap-3 mt-6">
            {[Globe, Share2, Rss, Globe].map((Icon, i) => (
                <a key={i} href="#"
                  className="w-10 h-10 rounded-xl border border-white/10 flex items-center justify-center text-white/40 hover:border-primary hover:text-primary transition-all hover:-translate-y-1">
                  <Icon className="w-4 h-4" />
                </a>
              ))}
            </div>
          </div>

          {/* Links */}
          {Object.entries(LINKS).map(([section, links]) => (
            <div key={section}>
              <h4 className="font-display font-bold text-sm text-white/70 uppercase tracking-wider mb-5">{section}</h4>
              <ul className="space-y-3">
                {links.map(link => (
                  <li key={link}>
                    <a href="#"
                      className="text-white/40 text-sm hover:text-white transition-colors hover:translate-x-1 inline-block">
                      {link}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Office addresses */}
        <div className="mt-14 pt-10 border-t border-white/8">
          <p className="text-white/30 text-xs uppercase tracking-widest mb-5 font-semibold">Our Offices</p>
          <div className="grid md:grid-cols-3 gap-4">
            {OFFICES.map((addr, i) => (
              <div key={i} className="flex items-start gap-2.5">
                <MapPin className="w-4 h-4 text-accent mt-0.5 flex-shrink-0" />
                <p className="text-white/40 text-xs leading-relaxed">{addr}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Bottom bar */}
      <div className="border-t border-white/8">
        <div className="max-w-7xl mx-auto px-6 py-5 flex flex-col md:flex-row items-center justify-between gap-3">
          <p className="text-white/30 text-xs">© 2026 Homyz Real Estate. All rights reserved.</p>
          <div className="flex items-center gap-6">
            {['Privacy Policy','Terms of Service','Cookie Policy'].map(link => (
              <a key={link} href="#" className="text-white/30 text-xs hover:text-white/60 transition-colors">{link}</a>
            ))}
          </div>
        </div>
      </div>
    </footer>
  )
}
