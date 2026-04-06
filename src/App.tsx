import { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Link, useLocation } from 'react-router-dom';
import { onAuthStateChanged, User } from 'firebase/auth';
import { auth, db } from './firebase';
import { doc, getDoc } from 'firebase/firestore';
import { AnimatePresence, motion } from 'framer-motion';
import { Menu, X, Instagram, Facebook, Twitter, Linkedin, LogIn, LogOut, User as UserIcon, Settings as SettingsIcon } from 'lucide-react';
import Home from './pages/Home';
import About from './pages/About';
import Blog from './pages/Blog';
import PostDetail from './pages/PostDetail';
import Contact from './pages/Contact';
import Login from './pages/Admin/Login';
import Dashboard from './pages/Admin/Dashboard';
import EditPost from './pages/Admin/EditPost';
import { SiteSettings } from './types';

// Navbar Component
const Navbar = ({ user, isAdmin }: { user: User | null, isAdmin: boolean }) => {
  const [isOpen, setIsOpen] = useState(false);
  const location = useLocation();

  const navLinks = [
    { name: 'Início', path: '/' },
    { name: 'Sobre Mim', path: '/sobre' },
    { name: 'Blog', path: '/blog' },
    { name: 'Contacto', path: '/contacto' },
  ];

  return (
    <nav className="fixed top-0 left-0 w-full z-50 glass shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-20 items-center">
          <Link to="/" className="flex items-center space-x-2">
            <span className="text-2xl font-serif font-bold text-primary tracking-widest">
              astresnomeublog
            </span>
          </Link>

          {/* Desktop Menu */}
          <div className="hidden md:flex items-center space-x-8">
            {navLinks.map((link) => (
              <Link
                key={link.path}
                to={link.path}
                className={`text-sm font-medium tracking-wide transition-colors hover:text-primary ${
                  location.pathname === link.path ? 'text-primary' : 'text-gray-600'
                }`}
              >
                {link.name}
              </Link>
            ))}
            {isAdmin && (
              <Link to="/admin" className="p-2 text-gray-600 hover:text-primary transition-colors">
                <SettingsIcon size={20} />
              </Link>
            )}
            {!user ? (
              <Link to="/login" className="p-2 text-gray-600 hover:text-primary transition-colors">
                <LogIn size={20} />
              </Link>
            ) : (
              <button onClick={() => auth.signOut()} className="p-2 text-gray-600 hover:text-primary transition-colors">
                <LogOut size={20} />
              </button>
            )}
          </div>

          {/* Mobile Menu Button */}
          <div className="md:hidden flex items-center">
            <button onClick={() => setIsOpen(!isOpen)} className="text-gray-600 focus:outline-none">
              {isOpen ? <X size={28} /> : <Menu size={28} />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="md:hidden glass border-t border-white/20 overflow-hidden"
          >
            <div className="px-4 pt-2 pb-6 space-y-2">
              {navLinks.map((link) => (
                <Link
                  key={link.path}
                  to={link.path}
                  onClick={() => setIsOpen(false)}
                  className="block px-3 py-2 text-base font-medium text-gray-600 hover:text-primary"
                >
                  {link.name}
                </Link>
              ))}
              {isAdmin && (
                <Link
                  to="/admin"
                  onClick={() => setIsOpen(false)}
                  className="block px-3 py-2 text-base font-medium text-gray-600 hover:text-primary"
                >
                  Admin Panel
                </Link>
              )}
              {!user ? (
                <Link
                  to="/login"
                  onClick={() => setIsOpen(false)}
                  className="block px-3 py-2 text-base font-medium text-gray-600 hover:text-primary"
                >
                  Entrar
                </Link>
              ) : (
                <button
                  onClick={() => { auth.signOut(); setIsOpen(false); }}
                  className="block w-full text-left px-3 py-2 text-base font-medium text-gray-600 hover:text-primary"
                >
                  Sair
                </button>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
};

// Footer Component
const Footer = () => {
  return (
    <footer className="bg-white py-12 border-t border-gray-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <h2 className="text-2xl font-serif font-bold text-primary mb-4">astresnomeublog</h2>
        <p className="text-gray-500 italic mb-6">“Um espaço onde palavras ganham alma.”</p>
        
        <div className="flex justify-center space-x-6 mb-8">
          <a href="#" className="text-gray-400 hover:text-primary transition-colors"><Instagram size={20} /></a>
          <a href="#" className="text-gray-400 hover:text-primary transition-colors"><Facebook size={20} /></a>
          <a href="#" className="text-gray-400 hover:text-primary transition-colors"><Twitter size={20} /></a>
          <a href="#" className="text-gray-400 hover:text-primary transition-colors"><Linkedin size={20} /></a>
        </div>

        <div className="text-sm text-gray-400 space-y-1">
          <p>Carolina Ndala &copy; {new Date().getFullYear()}</p>
          <p>carolinabraasndala@gmail.com</p>
        </div>
      </div>
    </footer>
  );
};

export default function App() {
  const [user, setUser] = useState<User | null>(null);
  const [isAdmin, setIsAdmin] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
      setIsAdmin(currentUser?.email === 'carolinabraasndala@gmail.com');
      setLoading(false);
    });
    return () => unsubscribe();
  }, []);

  if (loading) {
    return (
      <div className="h-screen w-full flex items-center justify-center bg-nude">
        <motion.div
          animate={{ scale: [1, 1.1, 1], opacity: [0.5, 1, 0.5] }}
          transition={{ duration: 2, repeat: Infinity }}
          className="text-3xl font-serif text-primary"
        >
          astresnomeublog
        </motion.div>
      </div>
    );
  }

  return (
    <Router>
      <div className="min-h-screen flex flex-col">
        <Navbar user={user} isAdmin={isAdmin} />
        <main className="flex-grow pt-20">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/sobre" element={<About />} />
            <Route path="/blog" element={<Blog />} />
            <Route path="/blog/:id" element={<PostDetail />} />
            <Route path="/contacto" element={<Contact />} />
            <Route path="/login" element={<Login />} />
            
            {/* Admin Routes */}
            {isAdmin && (
              <>
                <Route path="/admin" element={<Dashboard />} />
                <Route path="/admin/new" element={<EditPost />} />
                <Route path="/admin/edit/:id" element={<EditPost />} />
              </>
            )}
          </Routes>
        </main>
        <Footer />
      </div>
    </Router>
  );
}
