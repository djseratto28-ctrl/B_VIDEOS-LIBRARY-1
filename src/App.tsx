import React, { useState, useEffect, useMemo } from 'react';
import { BrowserRouter as Router, Routes, Route, Link, useLocation, useNavigate, useParams } from 'react-router-dom';
import { 
  Home, 
  TrendingUp, 
  Tv, 
  History, 
  LogIn, 
  Search, 
  Shuffle, 
  Laptop, 
  User,
  Plus,
  Play,
  Download,
  LogOut,
  ChevronLeft,
  ChevronRight,
  Filter,
  Flame,
  Clock,
  LayoutGrid,
  Settings,
  X,
  Share2,
  Bookmark,
  MessageSquare,
  MonitorPlay,
  CreditCard,
  CheckCircle,
  Zap,
  ShieldCheck,
  Crown,
  HandCoins,
  Gem
} from 'lucide-react';
import { INITIAL_MOVIES } from './data';
import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';
import { motion, AnimatePresence } from 'framer-motion';

function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

const STORAGE_KEY = 'b_videos_movies';
const SUB_KEY = 'b_videos_subscription';

function getLocalMovies(): Movie[] {
  const saved = localStorage.getItem(STORAGE_KEY);
  if (saved) return JSON.parse(saved);
  return INITIAL_MOVIES;
}

function saveLocalMovies(movies: Movie[]) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(movies));
}

// --- Types ---
interface Movie {
  id: string;
  title: string;
  description: string;
  category: string;
  videoUrl: string;
  thumbnailUrl: string;
  downloadUrl?: string;
  duration?: string;
  releaseYear?: number;
  rating?: string;
  vj?: string;
  quality?: string;
  views?: number;
  order: number;
}

interface Subscription {
  plan: 'Free' | 'Silver' | 'Gold' | 'Platinum';
  status: 'active' | 'none';
  expiryDate?: string;
}

// --- Components ---

const Footer = () => (
  <footer className="bg-[#050505] border-t border-white/5 py-12 px-6 mt-12 w-full">
    <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center gap-6">
      <div>
        <div className="text-xl font-bold tracking-tight text-white flex items-center gap-1">
          B-Videos<span className="text-[#f472b6] text-xs ml-2">Luganda Movies</span>
        </div>
        <p className="text-gray-500 text-sm mt-2">Watch Free Movies in Luganda.</p>
      </div>
      <div className="flex gap-6 text-sm text-gray-400">
        <Link to="/" className="hover:text-white transition-colors">Privacy Policy</Link>
        <Link to="/" className="hover:text-white transition-colors">Terms of Service</Link>
        <Link to="/" className="hover:text-white transition-colors">Contact Us</Link>
      </div>
    </div>
  </footer>
);

const Sidebar = ({ user, adminEmail }: { user: FirebaseUser | null, adminEmail: string | null }) => {
  const location = useLocation();
  const isAdmin = adminEmail === "djseratto28@gmail.com";

  const mainLinks = [
    { label: 'Home', path: '/', icon: Home },
    { label: 'Trending', path: '/trending', icon: Flame },
    { label: 'New Releases', path: '/recent', icon: Clock },
    { label: 'Live TV', path: '/live', icon: Tv },
    { label: 'Go Premium', path: '/pricing', icon: Crown, highlight: true },
  ];

  const categories = ['Documentary', 'Action', 'Adventure', 'Animation', 'Comedy', 'Drama', 'Fantasy', 'Horror', 'Sci-Fi'];

  return (
    <div className="hidden xl:flex flex-col w-64 h-[calc(100vh-80px)] sticky top-20 border-r border-white/5 py-8 gap-10 px-4 overflow-y-auto no-scrollbar">
      <div className="flex flex-col gap-2">
        <h4 className="text-[10px] font-bold text-gray-500 uppercase tracking-[2px] mb-2 px-4">Menu</h4>
        {mainLinks.map(link => (
          <Link 
            key={link.path} 
            to={link.path} 
            className={cn(
              "flex items-center gap-3 px-4 py-3 rounded-2xl transition-all font-medium text-sm group relative overflow-hidden",
              location.pathname === link.path 
                ? "bg-primary text-[#0a0a0a] shadow-lg shadow-primary/20" 
                : link.highlight 
                  ? "bg-primary/10 text-primary border border-primary/20 hover:bg-primary/20"
                  : "text-gray-400 hover:text-white hover:bg-white/5"
            )}
          >
            {link.highlight && (
              <motion.div 
                className="absolute inset-x-0 -bottom-1 h-1 bg-primary/40"
                animate={{ x: ['-100%', '100%'] }}
                transition={{ repeat: Infinity, duration: 3, ease: 'linear' }}
              />
            )}
            <link.icon size={18} className={cn(location.pathname === link.path ? "" : "group-hover:scale-110 transition-transform")} />
            {link.label}
          </Link>
        ))}
      </div>

      <div className="flex flex-col gap-2">
        <h4 className="text-[10px] font-bold text-gray-500 uppercase tracking-[2px] mb-2 px-4">Genres</h4>
        <div className="flex flex-wrap gap-2 px-2">
          {categories.map(cat => (
             <Link 
              key={cat}
              to={`/category/${cat}`}
              className="text-[11px] px-3 py-1.5 bg-white/5 hover:bg-white/10 rounded-lg text-gray-400 hover:text-white transition-all border border-white/5"
             >
               {cat}
             </Link>
          ))}
        </div>
      </div>

      {isAdmin && (
        <div className="flex flex-col gap-2 mt-auto">
          <h4 className="text-[10px] font-bold text-gray-500 uppercase tracking-[2px] mb-2 px-4">Admin</h4>
          <Link 
            to="/admin" 
            className={cn(
              "flex items-center gap-3 px-4 py-3 rounded-2xl transition-all font-bold text-sm",
              location.pathname === '/admin' ? "bg-white text-[#0a0a0a]" : "text-primary hover:bg-primary/10 border border-primary/20"
            )}
          >
            <Plus size={18} />
            Add Content
          </Link>
        </div>
      )}
    </div>
  );
};

const Navbar = ({ user, adminEmail, onLogin, onLogout, onSearch, subscription }: { user: User | null, adminEmail: string | null, onLogin: () => void, onLogout: () => void, onSearch: (val: string) => void, subscription: Subscription }) => {
  const location = useLocation();
  
  return (
    <nav className="h-20 bg-[#0a0a0a]/90 backdrop-blur-md border-b border-white/5 flex items-center justify-between px-6 sticky top-0 z-50">
      <div className="flex items-center gap-8">
        <Link to="/" className="text-xl md:text-2xl font-black tracking-tighter text-white flex items-center gap-1">
          B<span className="text-primary italic">VIDEOS</span>
          <span className="hidden sm:inline-block w-1.5 h-1.5 bg-primary rounded-full ml-1"></span>
        </Link>
      </div>

      <div className="flex-1 max-w-xl mx-8 relative group hidden md:block">
        <div className="absolute inset-y-0 left-4 flex items-center pointer-events-none">
          <Search size={18} className="text-gray-500 group-focus-within:text-primary transition-colors" />
        </div>
        <input 
          type="text" 
          placeholder="Search by name, vj, or genre..."
          onChange={(e) => onSearch(e.target.value)}
          className="w-full bg-white/5 border border-white/10 rounded-2xl py-2.5 pl-12 pr-4 text-white placeholder:text-gray-500 focus:outline-none focus:ring-2 focus:ring-primary/40 focus:border-primary/40 transition-all text-sm"
        />
      </div>

      <div className="flex items-center gap-4">
        {user ? (
          <div className="flex items-center gap-4">
            <div className="hidden lg:flex flex-col items-end">
              <span className="text-xs font-bold text-white leading-none">{user.displayName}</span>
              <span className="text-[10px] text-primary leading-none mt-1 font-black uppercase tracking-widest">{subscription.plan} Member</span>
            </div>
            <div className="relative group">
              <img src={user.photoURL || ''} alt="" className="w-10 h-10 rounded-full border-2 border-primary/20 p-0.5 group-hover:border-primary transition-all cursor-pointer" />
              <div className="absolute top-12 right-0 bg-[#151515] border border-white/10 rounded-2xl p-2 w-48 shadow-2xl scale-0 group-hover:scale-100 origin-top-right transition-transform py-4">
                 <button onClick={onLogout} className="w-full flex items-center gap-3 px-4 py-2 hover:bg-white/5 text-red-400 text-sm font-medium rounded-xl transition-all">
                   <LogOut size={16} /> Logout
                 </button>
              </div>
            </div>
          </div>
        ) : (
          <button onClick={onLogin} className="flex items-center gap-2 px-6 py-2.5 text-[#0a0a0a] transition-all bg-primary hover:bg-primary/90 rounded-2xl text-sm font-bold shadow-lg shadow-primary/20 active:scale-95">
            <User size={16} fill="currentColor" /> <span>Login</span>
          </button>
        )}
      </div>
    </nav>
  );
};

const Categories = () => {
  const cats = ['Documentary', 'Action', 'Adventure', 'Animation', 'Comedy', 'Crime', 'Drama', 'Science Fiction', 'Family', 'Fantasy', 'History'];
  return (
    <div className="flex items-center gap-3 overflow-x-auto py-4 px-2 scrollbar-hide no-scrollbar">
       <button className="p-2 bg-white/5 hover:bg-white/10 rounded-full transition-colors border border-white/10">
        <ChevronLeft size={16} />
      </button>
      {cats.map((cat) => (
        <button 
          key={cat}
          className="px-5 py-1.5 bg-white/5 hover:bg-white/10 border border-white/10 rounded-lg text-sm font-medium text-gray-400 hover:text-white whitespace-nowrap transition-all"
        >
          {cat}
        </button>
      ))}
      <button className="p-2 bg-white/5 hover:bg-white/10 rounded-full transition-colors border border-white/10">
        <ChevronRight size={16} />
      </button>
    </div>
  );
};

const Hero = ({ movie }: { movie: Movie | null }) => {
  if (!movie) return null;
  return (
    <div className="relative h-[500px] w-full rounded-3xl overflow-hidden mt-2 group">
      <img src={movie.thumbnailUrl} alt={movie.title} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105" />
      <div className="absolute inset-0 bg-gradient-to-t from-[#0a0a0a] via-[#0a0a0a]/40 to-transparent flex flex-col justify-end p-12 gap-6">
        <div className="flex items-center gap-3 mb-2">
          <span className="px-3 py-1 bg-green-500/20 text-green-400 text-xs font-bold rounded-lg border border-green-500/30 uppercase tracking-[2px]">{movie.releaseYear || '2025'}</span>
          <span className="text-gray-400 text-xs">•</span>
          <span className="text-gray-300 text-xs font-medium">Movie</span>
          <span className="text-gray-400 text-xs">•</span>
          <span className="text-[#f472b6] text-xs font-bold bg-[#f472b6]/10 px-2 py-0.5 rounded uppercase tracking-wider">vj emmy</span>
        </div>
        <h1 className="text-6xl font-bold text-white tracking-tight">{movie.title}</h1>
        <p className="text-gray-400 max-w-2xl text-lg line-clamp-3 leading-relaxed">
          {movie.description}
        </p>
        <div className="flex items-center gap-6 mt-4">
          <button className="flex items-center gap-3 px-8 py-4 bg-[#f472b6] hover:bg-[#ec4899] text-[#0a0a0a] rounded-2xl font-bold transition-all transform hover:scale-105 shadow-lg shadow-[#f472b6]/20">
            <Play fill="currentColor" size={20} />
            Watch Now
          </button>
          <div className="flex gap-4">
            <button className="p-4 bg-white/10 hover:bg-white/20 rounded-2xl transition-all border border-white/10 group/btn">
              <ChevronLeft size={24} className="group-hover/btn:-translate-x-0.5 transition-transform" />
            </button>
            <button className="p-4 bg-white/10 hover:bg-white/20 rounded-2xl transition-all border border-white/10 group/btn">
              <ChevronRight size={24} className="group-hover/btn:translate-x-0.5 transition-transform" />
            </button>
          </div>
        </div>
      </div>
      
      {/* Scroll Indicators as seen in screenshot */}
      <div className="absolute right-8 top-1/2 -translate-y-1/2 flex flex-col gap-3">
        {[1,2,3,4,5].map(i => (
          <div key={i} className={cn("w-1.5 rounded-full transition-all", i === 2 ? "h-12 bg-[#f472b6]" : "h-2 bg-white/20")} />
        ))}
      </div>
    </div>
  );
};

const MovieCard = ({ movie }: { movie: Movie }) => {
  return (
    <Link to={`/watch/${movie.id}`} className="group relative flex flex-col gap-3 bg-white/5 p-3 rounded-3xl border border-white/5 hover:border-primary/30 transition-all hover:-translate-y-2 hover:bg-white/[0.07]">
      <div className="relative aspect-[2/3] rounded-2xl overflow-hidden shadow-2xl">
        <img 
          src={movie.thumbnailUrl} 
          alt={movie.title} 
          loading="lazy"
          className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" 
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-black/20 opacity-0 group-hover:opacity-100 transition-opacity flex flex-col items-center justify-center p-4">
          <motion.div initial={{ scale: 0.5 }} whileHover={{ scale: 1.1 }} className="w-14 h-14 bg-primary rounded-full flex items-center justify-center text-[#0a0a0a] shadow-2xl backdrop-blur-sm">
            <Play fill="currentColor" size={28} className="ml-1" />
          </motion.div>
          <div className="absolute bottom-4 left-4 right-4 flex flex-col gap-1.5 translate-y-4 group-hover:translate-y-0 transition-transform">
             <div className="flex gap-2">
                <span className="px-2 py-0.5 bg-primary text-[#0a0a0a] text-[9px] font-black rounded uppercase">VJ {movie.vj || 'NONE'}</span>
                {movie.quality && <span className="px-2 py-0.5 bg-white/20 backdrop-blur-md text-white text-[9px] font-black rounded uppercase">{movie.quality}</span>}
             </div>
          </div>
        </div>
        <div className="absolute top-3 right-3 px-2 py-1 bg-black/60 backdrop-blur-md rounded-lg text-[10px] font-black text-white uppercase tracking-tighter border border-white/10">
          {movie.rating || 'HD'}
        </div>
      </div>
      <div className="px-1 py-1">
        <h3 className="text-white text-sm font-bold group-hover:text-primary transition-colors truncate leading-tight">{movie.title}</h3>
        <div className="flex items-center justify-between mt-1.5">
          <span className="px-2 py-0.5 bg-white/5 rounded-md text-gray-500 text-[9px] font-bold uppercase tracking-wider">{movie.category}</span>
          <span className="text-gray-500 text-[10px] font-medium">{movie.releaseYear}</span>
        </div>
      </div>
    </Link>
  );
};

const WatchView = ({ user, subscription }: { user: User | null, subscription: Subscription }) => {
  const { id } = useParams();
  const [movies, setMovies] = useState<Movie[]>(getLocalMovies());
  const movie = movies.find(m => m.id === id);
  const loading = false;
  const related = movies.filter(m => m.id !== id && m.category === movie?.category).slice(0, 4);

  useEffect(() => {
    if (movie) {
      const updated = movies.map(m => m.id === id ? { ...m, views: (m.views || 0) + 1 } : m);
      setMovies(updated);
      saveLocalMovies(updated);
    }
  }, [id]);

  if (loading) return <div className="p-20 text-center animate-pulse text-primary font-bold">LOADING CINEMA...</div>;
  if (!movie) return <div className="p-20 text-center text-gray-500">Movie not found</div>;

  const isRestricted = (movie.quality?.includes('4K') || movie.quality?.includes('ULTRA')) && subscription.plan === 'Free';

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="flex flex-col lg:flex-row gap-8 py-4"
    >
      <div className="flex-1 flex flex-col gap-6">
        <div className="aspect-video w-full rounded-3xl overflow-hidden bg-black border border-white/5 shadow-2xl relative group">
          {isRestricted ? (
            <div className="absolute inset-0 flex flex-col items-center justify-center bg-black/80 z-20 backdrop-blur-xl p-8 text-center">
              <div className="w-20 h-20 bg-primary/20 rounded-full flex items-center justify-center text-primary mb-6 animate-bounce">
                <Crown size={40} />
              </div>
              <h2 className="text-3xl font-black text-white mb-2 uppercase tracking-tighter">Premium content restricted</h2>
              <p className="text-gray-400 max-w-sm mb-8">4K Ultra HD content is reserved for our Premium members. Upgrade now to unlock instant playback.</p>
              <Link to="/pricing" className="px-10 py-4 bg-primary text-black font-black rounded-2xl shadow-xl shadow-primary/20 hover:scale-105 transition-transform uppercase tracking-widest text-sm">
                Unlock 4K Now
              </Link>
            </div>
          ) : (
            <>
              {movie.videoUrl.includes('youtube.com') || movie.videoUrl.includes('youtu.be') ? (
                 <iframe 
                  src={`https://www.youtube.com/embed/${movie.videoUrl.split('v=')[1] || movie.videoUrl.split('/').pop()}`}
                  className="w-full h-full"
                  allowFullScreen
                 />
              ) : (
                <video 
                  src={movie.videoUrl} 
                  controls 
                  className="w-full h-full"
                  poster={movie.thumbnailUrl}
                />
              )}
            </>
          )}
        </div>

        <div className="bg-white/5 p-8 rounded-[40px] border border-white/5">
          <div className="flex flex-wrap items-center justify-between gap-6 mb-6">
            <div className="flex flex-col gap-2">
              <div className="flex items-center gap-3">
                <span className="px-3 py-1 bg-primary/20 text-primary text-[10px] font-black rounded-lg uppercase tracking-widest">{movie.category}</span>
                <span className="text-gray-500 text-xs">•</span>
                <span className="text-gray-400 text-xs font-bold uppercase tracking-widest">VJ {movie.vj || 'Labafilm'}</span>
                <span className="text-gray-500 text-xs">•</span>
                <span className="text-gray-400 text-xs">{movie.releaseYear}</span>
              </div>
              <h1 className="text-4xl font-extrabold text-white tracking-tight">{movie.title}</h1>
            </div>
            
            <div className="flex items-center gap-3">
              <button className="p-4 bg-white/5 hover:bg-white/10 rounded-2xl transition-all border border-white/10 text-gray-400 hover:text-white">
                <Bookmark size={20} />
              </button>
              <button className="p-4 bg-white/5 hover:bg-white/10 rounded-2xl transition-all border border-white/10 text-gray-400 hover:text-white">
                <Share2 size={20} />
              </button>
              {movie.downloadUrl && (
                <a href={movie.downloadUrl} className="flex items-center gap-2 px-8 py-4 bg-white/10 hover:bg-white/20 text-white font-bold rounded-2xl transition-all border border-white/10">
                  <Download size={20} /> Download
                </a>
              )}
            </div>
          </div>

          <p className="text-gray-400 leading-relaxed text-lg mb-8 max-w-4xl">
            {movie.description}
          </p>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-6 pt-8 border-t border-white/5">
            <div className="flex flex-col gap-1">
               <span className="text-[10px] text-gray-500 font-bold uppercase tracking-widest">Quality</span>
               <span className="text-white font-bold">{movie.quality || 'FULL HD'}</span>
            </div>
            <div className="flex flex-col gap-1">
               <span className="text-[10px] text-gray-500 font-bold uppercase tracking-widest">Views</span>
               <span className="text-white font-bold">{movie.views?.toLocaleString() || 0}</span>
            </div>
            <div className="flex flex-col gap-1">
               <span className="text-[10px] text-gray-500 font-bold uppercase tracking-widest">Translator</span>
               <span className="text-white font-bold">VJ {movie.vj || 'Emmy'}</span>
            </div>
            <div className="flex flex-col gap-1">
               <span className="text-[10px] text-gray-500 font-bold uppercase tracking-widest">Language</span>
               <span className="text-white font-bold">Luganda</span>
            </div>
          </div>
        </div>
      </div>

      <div className="lg:w-80 flex flex-col gap-6">
        <h3 className="text-xl font-bold flex items-center gap-2">
          <LayoutGrid size={20} className="text-primary" />
          More Like This
        </h3>
        <div className="flex flex-col gap-4">
           {related.map(m => (
             <Link key={m.id} to={`/watch/${m.id}`} className="flex gap-4 p-3 bg-white/5 hover:bg-white/10 rounded-2xl border border-white/5 transition-all group">
               <div className="w-24 aspect-[2/3] rounded-xl overflow-hidden shadow-lg border border-white/10">
                 <img src={m.thumbnailUrl} alt="" className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" />
               </div>
               <div className="flex-1 flex flex-col justify-center gap-1">
                  <h4 className="text-sm font-bold text-white group-hover:text-primary transition-colors line-clamp-1">{m.title}</h4>
                  <span className="text-[10px] text-gray-500 font-bold uppercase tracking-wider">{m.category}</span>
                  <div className="flex items-center gap-1 mt-1">
                    <span className="text-[9px] px-1.5 py-0.5 bg-primary/20 text-primary font-black rounded uppercase">VJ {m.vj || 'EMMY'}</span>
                  </div>
               </div>
             </Link>
           ))}
        </div>
        
        <div className="mt-6 p-6 bg-primary/5 border border-primary/10 rounded-3xl flex flex-col gap-3">
           <h4 className="text-sm font-black text-primary uppercase tracking-widest">Weekly Deal</h4>
           <p className="text-xs text-gray-400 leading-tight">Join our VIP telegram for early releases and requested movies.</p>
           <button className="w-full py-2 bg-primary text-[#0a0a0a] text-[10px] font-black uppercase rounded-lg shadow-lg shadow-primary/10">Join Now</button>
        </div>
      </div>
    </motion.div>
  );
};

const PricingView = ({ onSubscribe }: { onSubscribe: (plan: Subscription['plan']) => void }) => {
  const plans = [
    {
      id: 'Silver',
      name: 'Silver',
      price: '5,000 UGX',
      duration: '/ month',
      description: 'Perfect for starters who want high quality.',
      features: ['HD Streaming', 'No Ads', 'Weekly Releases', '2 Devices'],
      icon: HandCoins,
      color: 'bg-gray-400'
    },
    {
      id: 'Gold',
      name: 'Gold',
      price: '15,000 UGX',
      duration: '/ 3 months',
      description: 'Our most popular plan for movie lovers.',
      features: ['4K Ultra HD', 'Priority Releases', 'Download Offline', '5 Devices', 'VJ Requests'],
      icon: Zap,
      color: 'bg-primary',
      popular: true
    },
    {
      id: 'Platinum',
      name: 'Platinum',
      price: '50,000 UGX',
      duration: '/ year',
      description: 'The ultimate cinematic experience.',
      features: ['Everything in Gold', 'VIP Telegram Access', 'Exclusive Premieres', 'Unlimited Devices', 'Early Access'],
      icon: Gem,
      color: 'bg-blue-500'
    }
  ] as const;

  return (
    <motion.div 
      initial={{ opacity: 0 }} 
      animate={{ opacity: 1 }} 
      className="py-12 px-4 max-w-7xl mx-auto"
    >
      <div className="text-center flex flex-col items-center gap-4 mb-16">
        <span className="text-[10px] font-black text-primary uppercase tracking-[8px]">Choose Your Power</span>
        <h1 className="text-5xl md:text-7xl font-black text-white tracking-tighter">B-VIDEOS PREMIUM</h1>
        <p className="text-gray-500 text-lg max-w-xl">Support the translators and watch the latest Luganda movies in 4K without interruptions.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {plans.map((plan) => (
          <motion.div 
            key={plan.id}
            whileHover={{ y: -10 }}
            className={cn(
              "relative flex flex-col p-8 rounded-[48px] border border-white/5 bg-white/5 transition-all",
              plan.popular ? "border-primary/30 bg-primary/[0.03]" : ""
            )}
          >
            {plan.popular && (
              <div className="absolute -top-4 left-1/2 -translate-x-1/2 px-4 py-1.5 bg-primary text-black text-[10px] font-black rounded-full uppercase tracking-widest shadow-xl shadow-primary/20">
                Most Popular
              </div>
            )}
            
            <div className="flex items-center justify-between mb-8">
               <div className={cn("w-14 h-14 rounded-2xl flex items-center justify-center text-white", plan.color)}>
                  <plan.icon size={28} />
               </div>
               <div className="text-right">
                  <div className="text-3xl font-black text-white">{plan.price}</div>
                  <div className="text-xs text-gray-500 font-bold uppercase tracking-widest">{plan.duration}</div>
               </div>
            </div>

            <div className="flex flex-col gap-2 mb-8">
               <h3 className="text-2xl font-black text-white">{plan.name}</h3>
               <p className="text-sm text-gray-500 leading-relaxed">{plan.description}</p>
            </div>

            <div className="flex flex-col gap-4 mb-10 flex-1">
               {plan.features.map(feat => (
                 <div key={feat} className="flex items-center gap-3">
                    <CheckCircle size={16} className="text-primary shrink-0" />
                    <span className="text-sm text-gray-300 font-medium">{feat}</span>
                 </div>
               ))}
            </div>

            <button 
              onClick={() => onSubscribe(plan.id as Subscription['plan'])}
              className={cn(
                "w-full py-4 rounded-2xl font-black uppercase tracking-widest transition-all",
                plan.popular 
                  ? "bg-primary text-black shadow-xl shadow-primary/20 hover:scale-[1.02]" 
                  : "bg-white/10 text-white hover:bg-white/20"
              )}
            >
              Get Started
            </button>
          </motion.div>
        ))}
      </div>

      <div className="mt-20 p-12 bg-white/5 rounded-[48px] border border-white/5 flex flex-col md:flex-row items-center justify-between gap-8">
         <div className="flex items-center gap-6">
            <div className="w-16 h-16 bg-white/5 rounded-2xl flex items-center justify-center text-primary">
               <ShieldCheck size={32} />
            </div>
            <div className="flex flex-col gap-1">
               <h4 className="text-xl font-black text-white">Safe & Secure Payment</h4>
               <p className="text-gray-500 text-sm">We use Airtel & MTN Mobile Money for instant activation.</p>
            </div>
         </div>
         <div className="flex items-center gap-4">
            <div className="text-right hidden sm:block">
               <p className="text-xs text-gray-500 font-bold uppercase tracking-widest">Questions?</p>
               <p className="text-sm text-white font-bold">Contact Support</p>
            </div>
            <button className="px-8 py-4 bg-white/5 hover:bg-white/10 border border-white/10 rounded-2xl text-white font-black uppercase text-xs tracking-widest transition-all">
               Live Chat
            </button>
         </div>
      </div>
    </motion.div>
  );
};

// --- Pages ---

const HomeView = ({ searchTerm }: { searchTerm: string }) => {
  const { category: categoryParam } = useParams();
  const [movies, setMovies] = useState<Movie[]>(getLocalMovies());
  const loading = false;

  const filteredMovies = useMemo(() => {
    return movies.filter(movie => {
      const matchesSearch = movie.title.toLowerCase().includes(searchTerm.toLowerCase()) || 
                           movie.vj?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           movie.category.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesCategory = !categoryParam || movie.category === categoryParam;
      return matchesSearch && matchesCategory;
    });
  }, [movies, searchTerm, categoryParam]);

  const featuredMovie = filteredMovies.length > 0 ? filteredMovies[0] : (movies.length > 0 ? movies[0] : null);

  return (
    <div className="flex flex-col pb-12">
      {!searchTerm && !categoryParam && featuredMovie && (
        <Hero movie={featuredMovie} />
      )}
      
      <div className="mt-12">
        <div className="flex items-center justify-between mb-8 px-2">
          <div className="flex items-center gap-4">
            <h2 className="text-2xl font-extrabold text-white tracking-tight">
              {searchTerm ? `Results for "${searchTerm}"` : categoryParam || 'Popular Movies'}
            </h2>
            <div className="h-1.5 w-12 bg-primary rounded-full" />
          </div>
          <div className="flex items-center gap-2">
             <button className="p-2.5 bg-white/5 hover:bg-white/10 rounded-xl transition-all border border-white/5">
                <Filter size={18} className="text-gray-400" />
             </button>
          </div>
        </div>
        
        <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 2xl:grid-cols-6 gap-6 px-2">
          <AnimatePresence mode="popLayout">
            {filteredMovies.map((movie) => (
              <motion.div
                key={movie.id}
                layout
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
                transition={{ duration: 0.3 }}
              >
                <MovieCard movie={movie} />
              </motion.div>
            ))}
          </AnimatePresence>
          
          {filteredMovies.length === 0 && !loading && (
            <div className="col-span-full py-32 text-center flex flex-col items-center gap-4 bg-white/5 rounded-[40px] border-2 border-dashed border-white/5">
              <Search size={48} className="text-gray-700" />
              <div className="flex flex-col gap-1">
                <p className="text-xl font-bold text-gray-400">No movies found</p>
                <p className="text-sm text-gray-600">Try adjusting your search or filters</p>
              </div>
              <button 
                onClick={() => window.location.href = '/'}
                className="mt-4 px-8 py-3 bg-white/5 hover:bg-white/10 rounded-2xl text-white font-bold transition-all"
              >
                Clear All Filters
              </button>
            </div>
          )}
        </div>
      </div>
      
      {/* Premium Ad Variant */}
      <div className="mt-20 mx-2 p-12 bg-gradient-to-br from-primary/10 via-white/5 to-transparent border border-white/10 rounded-[48px] overflow-hidden relative group">
         <div className="absolute right-0 top-0 w-64 h-64 bg-primary/20 blur-[100px] rounded-full -mr-32 -mt-32 group-hover:bg-primary/30 transition-all" />
         <div className="relative z-10 flex flex-col md:flex-row items-center justify-between gap-8">
            <div className="flex flex-col gap-2 text-center md:text-left">
               <span className="text-[10px] font-black text-primary uppercase tracking-[4px]">Verified Partner</span>
               <h3 className="text-3xl font-black text-white">Unlock Premium Speed</h3>
               <p className="text-gray-400 max-w-md">Get instant access to HDR movies and unlimited downloads with B-Videos Premium.</p>
            </div>
            <button className="px-10 py-5 bg-white text-black font-black rounded-3xl hover:scale-105 transition-transform shadow-2xl">
               Go Premium
            </button>
         </div>
      </div>
    </div>
  );
};

const AdminView = ({ user }: { user: any | null }) => {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [category, setCategory] = useState('Action');
  const [videoUrl, setVideoUrl] = useState('');
  const [thumbnailUrl, setThumbnailUrl] = useState('');
  const [downloadUrl, setDownloadUrl] = useState('');
  const [vj, setVj] = useState('VJ Emmy');
  const [quality, setQuality] = useState('HD');
  const [order, setOrder] = useState('1');
  const [releaseYear, setReleaseYear] = useState('2025');
  const [loading, setLoading] = useState(false);
  
  // Bulk Import
  const [tab, setTab] = useState<'single' | 'bulk'>('single');
  const [bulkData, setBulkData] = useState('');

  const isAdmin = true; // For demo purposes

  const handleUpload = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    const movies = getLocalMovies();
    const newMovie: Movie = {
      id: Date.now().toString(),
      title,
      description,
      category,
      videoUrl,
      thumbnailUrl,
      downloadUrl,
      vj,
      quality,
      order: parseInt(order),
      releaseYear: parseInt(releaseYear),
      views: 0
    };
    const updated = [...movies, newMovie];
    saveLocalMovies(updated);
    
    setTitle('');
    setDescription('');
    setVideoUrl('');
    setThumbnailUrl('');
    setDownloadUrl('');
    setLoading(false);
    alert('Movie uploaded successfully!');
  };

  const handleBulkUpload = async () => {
    setLoading(true);
    try {
      const parsed = JSON.parse(bulkData);
      const moviesToAdd = (Array.isArray(parsed) ? parsed : [parsed]).map((m: any) => ({
        ...m,
        id: m.id || Math.random().toString(36).substr(2, 9),
        views: m.views || 0
      }));
      
      const current = getLocalMovies();
      const updated = [...current, ...moviesToAdd];
      saveLocalMovies(updated);
      
      setBulkData('');
      alert(`Bulk upload complete! Added ${moviesToAdd.length} movies.`);
    } catch (err) {
      console.error(err);
      alert('Error parsing JSON. Ensure it\'s a valid array of movie objects.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-8 mb-20 max-w-5xl mx-auto w-full">
      <div className="flex flex-col md:flex-row items-center justify-between gap-6 mb-12">
        <div className="flex flex-col gap-1">
          <h1 className="text-5xl font-black text-white tracking-tighter">Content Studio</h1>
          <p className="text-gray-500 font-medium">Manage your cinematic library</p>
        </div>
        <div className="flex bg-white/5 p-1.5 rounded-2xl border border-white/5">
           <button onClick={() => setTab('single')} className={cn("px-6 py-2.5 rounded-xl text-xs font-black uppercase tracking-widest transition-all", tab === 'single' ? "bg-primary text-black" : "text-gray-500 hover:text-white")}>Single Upload</button>
           <button onClick={() => setTab('bulk')} className={cn("px-6 py-2.5 rounded-xl text-xs font-black uppercase tracking-widest transition-all", tab === 'bulk' ? "bg-primary text-black" : "text-gray-500 hover:text-white")}>Bulk Import</button>
        </div>
      </div>

      {tab === 'single' ? (
        <form onSubmit={handleUpload} className="space-y-8 bg-white/5 p-12 rounded-[48px] border border-white/5 shadow-[0_0_100px_rgba(0,0,0,0.5)]">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="space-y-2">
              <label className="text-[10px] font-black text-gray-500 uppercase tracking-widest pl-1">Movie Title</label>
              <input required type="text" value={title} onChange={e => setTitle(e.target.value)} className="w-full bg-[#0a0a0a] border border-white/10 rounded-2xl px-5 py-4 text-white focus:border-primary focus:ring-1 focus:ring-primary outline-none transition-all placeholder:text-gray-700" placeholder="e.g. Inception Luganda" />
            </div>
            <div className="space-y-2">
              <label className="text-[10px] font-black text-gray-500 uppercase tracking-widest pl-1">Category</label>
              <select value={category} onChange={e => setCategory(e.target.value)} className="w-full bg-[#0a0a0a] border border-white/10 rounded-2xl px-5 py-4 text-white focus:border-primary outline-none transition-all">
                {['Action', 'Adventure', 'Animation', 'Comedy', 'Drama', 'Fantasy', 'Horror', 'Sci-Fi', 'Thriller', 'Documentary'].map(c => (
                  <option key={c} value={c}>{c}</option>
                ))}
              </select>
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-[10px] font-black text-gray-500 uppercase tracking-widest pl-1">Synopsis</label>
            <textarea required value={description} onChange={e => setDescription(e.target.value)} rows={4} className="w-full bg-[#0a0a0a] border border-white/10 rounded-2xl px-5 py-4 text-white focus:border-primary outline-none transition-all resize-none placeholder:text-gray-700" placeholder="Describe the movie plot..." />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
             <div className="space-y-2">
              <label className="text-[10px] font-black text-gray-500 uppercase tracking-widest pl-1">Video Stream URL</label>
              <input required type="text" value={videoUrl} onChange={e => setVideoUrl(e.target.value)} className="w-full bg-[#0a0a0a] border border-white/10 rounded-2xl px-5 py-4 text-white focus:border-primary outline-none" placeholder="Direct link or YouTube" />
            </div>
            <div className="space-y-2">
              <label className="text-[10px] font-black text-gray-500 uppercase tracking-widest pl-1">Cover Image URL</label>
              <input required type="text" value={thumbnailUrl} onChange={e => setThumbnailUrl(e.target.value)} className="w-full bg-[#0a0a0a] border border-white/10 rounded-2xl px-5 py-4 text-white focus:border-primary outline-none" placeholder="High res poster" />
            </div>
            <div className="space-y-2">
              <label className="text-[10px] font-black text-gray-500 uppercase tracking-widest pl-1">Download Link</label>
              <input type="text" value={downloadUrl} onChange={e => setDownloadUrl(e.target.value)} className="w-full bg-[#0a0a0a] border border-white/10 rounded-2xl px-5 py-4 text-white focus:border-primary outline-none" placeholder="Optional DL link" />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
             <div className="space-y-2">
              <label className="text-[10px] font-black text-gray-500 uppercase tracking-widest pl-1">VJ / Translator</label>
              <input required type="text" value={vj} onChange={e => setVj(e.target.value)} className="w-full bg-[#0a0a0a] border border-white/10 rounded-2xl px-5 py-4 text-white focus:border-primary outline-none" />
            </div>
            <div className="space-y-2">
              <label className="text-[10px] font-black text-gray-500 uppercase tracking-widest pl-1">Quality</label>
              <input required type="text" value={quality} onChange={e => setQuality(e.target.value)} className="w-full bg-[#0a0a0a] border border-white/10 rounded-2xl px-5 py-4 text-white focus:border-primary outline-none" />
            </div>
             <div className="space-y-2">
              <label className="text-[10px] font-black text-gray-500 uppercase tracking-widest pl-1">Sort Key</label>
              <input required type="number" value={order} onChange={e => setOrder(e.target.value)} className="w-full bg-[#0a0a0a] border border-white/10 rounded-2xl px-5 py-4 text-white focus:border-primary outline-none" />
            </div>
            <div className="space-y-2">
              <label className="text-[10px] font-black text-gray-500 uppercase tracking-widest pl-1">Year</label>
              <input required type="number" value={releaseYear} onChange={e => setReleaseYear(e.target.value)} className="w-full bg-[#0a0a0a] border border-white/10 rounded-2xl px-5 py-4 text-white focus:border-primary outline-none" />
            </div>
          </div>

          <button 
            disabled={loading}
            className="w-full py-5 bg-primary hover:bg-primary/90 text-[#0a0a0a] font-black uppercase tracking-widest rounded-2xl transition-all shadow-2xl shadow-primary/20 disabled:opacity-50 disabled:cursor-not-allowed transform active:scale-95 flex items-center justify-center gap-3"
          >
            {loading ? 'Processing...' : (
              <><Plus size={24} /> Publish to Library</>
            )}
          </button>
        </form>
      ) : (
        <div className="bg-white/5 p-12 rounded-[48px] border border-white/5 flex flex-col gap-6">
           <div className="flex flex-col gap-1">
              <h2 className="text-2xl font-black text-white">Bulk JSON Import</h2>
              <p className="text-gray-500 text-sm">Paste a JSON array of movie objects directly from your scraper.</p>
           </div>
           <textarea 
            value={bulkData}
            onChange={(e) => setBulkData(e.target.value)}
            placeholder='[ { "title": "...", "videoUrl": "...", "thumbnailUrl": "...", "category": "...", "order": 1, "vj": "VJ Emmy", "quality": "HD" } ]'
            className="w-full h-80 bg-[#0a0a0a] border border-white/10 rounded-3xl p-6 text-primary font-mono text-xs focus:border-primary outline-none transition-all"
           />
           <button 
            disabled={loading || !bulkData}
            onClick={handleBulkUpload}
            className="w-full py-5 bg-primary text-black font-black uppercase tracking-widest rounded-2xl hover:bg-primary/90 transition-all font-black flex items-center justify-center gap-3"
           >
             {loading ? 'Adding Movies...' : <><MonitorPlay size={24} /> Start Bulk Import</>}
           </button>
        </div>
      )}
    </div>
  );
};

// --- Main App ---

export default function App() {
  const [user, setUser] = useState<{ displayName: string, email: string, photoURL: string } | null>(null);
  const [authReady, setAuthReady] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');

  const handleLogin = () => {
    setUser({
      displayName: 'Demo User',
      email: 'demo@example.com',
      photoURL: 'https://picsum.photos/seed/user/128/128'
    });
  };

  const handleLogout = () => {
    setUser(null);
  };

  if (!authReady) return (
    <div className="h-screen bg-[#0a0a0a] flex flex-col items-center justify-center gap-6">
      <div className="flex flex-col items-center gap-2">
        <div className="text-primary font-black text-6xl tracking-tighter animate-pulse">B-VIDEOS</div>
        <div className="text-gray-700 text-[10px] font-black uppercase tracking-[10px] ml-2">Luganda Movies</div>
      </div>
      <div className="w-48 h-1 bg-white/5 rounded-full overflow-hidden relative">
         <motion.div 
          className="absolute inset-0 bg-primary"
          initial={{ x: '-100%' }}
          animate={{ x: '100%' }}
          transition={{ repeat: Infinity, duration: 1.5, ease: "easeInOut" }}
         />
      </div>
    </div>
  );

  return (
    <Router>
      <div className="min-h-screen bg-[#0a0a0a] text-white flex flex-col font-sans selection:bg-primary selection:text-black">
        <Navbar user={user} adminEmail={user?.email || null} onLogin={handleLogin} onLogout={handleLogout} onSearch={setSearchTerm} />
        
        <div className="flex-1 w-full max-w-[1600px] mx-auto flex">
          <Sidebar user={user} adminEmail={user?.email || null} />
          
          <main className="flex-1 flex flex-col py-8 px-4 sm:px-8 overflow-x-hidden">
            <Routes>
              <Route path="/" element={<HomeView searchTerm={searchTerm} />} />
              <Route path="/category/:category" element={<HomeView searchTerm={searchTerm} />} />
              <Route path="/watch/:id" element={<WatchView user={user} />} />
              <Route path="/admin" element={<AdminView user={user} />} />
              <Route path="*" element={<div className="flex-1 flex items-center justify-center py-32 text-gray-700 font-bold uppercase tracking-[10px] text-2xl">COMING SOON</div>} />
            </Routes>
          </main>
        </div>
        
        <Footer />
      </div>
    </Router>
  );
}
