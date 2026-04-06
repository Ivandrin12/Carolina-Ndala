import { useState, useEffect } from 'react';
import { collection, query, where, orderBy, limit, getDocs } from 'firebase/firestore';
import { db } from '../firebase';
import { Post } from '../types';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { ArrowRight, Calendar, User as UserIcon } from 'lucide-react';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';

const Hero = () => {
  return (
    <section className="relative h-[80vh] flex items-center justify-center overflow-hidden bg-nude">
      {/* Animated Background Elements */}
      <motion.div
        animate={{ scale: [1, 1.2, 1], opacity: [0.3, 0.5, 0.3] }}
        transition={{ duration: 10, repeat: Infinity }}
        className="absolute top-10 left-10 w-64 h-64 bg-accent rounded-full blur-3xl"
      />
      <motion.div
        animate={{ scale: [1, 1.3, 1], opacity: [0.2, 0.4, 0.2] }}
        transition={{ duration: 15, repeat: Infinity, delay: 2 }}
        className="absolute bottom-10 right-10 w-96 h-96 bg-lilac rounded-full blur-3xl"
      />

      <div className="relative z-10 text-center px-4 max-w-4xl">
        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="text-5xl md:text-7xl font-serif font-bold text-gray-900 mb-6 tracking-tight"
        >
          Bem-vinda ao <span className="text-primary italic">astresnomeublog</span>
        </motion.h1>
        
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="text-lg md:text-xl text-gray-600 font-sans font-light mb-10 leading-relaxed"
        >
          Explorando pensamentos, histórias e reflexões com elegância e alma. 
          Um espaço dedicado à beleza da vida e à força feminina.
        </motion.p>

        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5, delay: 0.4 }}
          className="flex flex-col sm:flex-row justify-center items-center space-y-4 sm:space-y-0 sm:space-x-6"
        >
          <Link
            to="/blog"
            className="px-8 py-4 bg-primary text-white font-medium rounded-full shadow-lg hover:shadow-xl hover:bg-opacity-90 transition-all flex items-center"
          >
            Ler o Blog <ArrowRight size={18} className="ml-2" />
          </Link>
          <Link
            to="/sobre"
            className="px-8 py-4 glass text-gray-800 font-medium rounded-full shadow-sm hover:shadow-md transition-all"
          >
            Sobre Mim
          </Link>
        </motion.div>
      </div>
    </section>
  );
};

const PostCard = ({ post }: { post: Post }) => {
  return (
    <motion.div
      whileHover={{ y: -10 }}
      className="bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-xl transition-all border border-gray-100"
    >
      <div className="relative h-64 overflow-hidden">
        <img
          src={post.image || `https://picsum.photos/seed/${post.id}/800/600`}
          alt={post.title}
          className="w-full h-full object-cover transition-transform duration-700 hover:scale-110"
          referrerPolicy="no-referrer"
        />
        <div className="absolute top-4 left-4">
          <span className="px-3 py-1 bg-white/90 backdrop-blur-sm text-xs font-bold text-primary uppercase tracking-widest rounded-full">
            {post.category}
          </span>
        </div>
      </div>
      <div className="p-6">
        <div className="flex items-center text-xs text-gray-400 mb-3 space-x-4">
          <span className="flex items-center"><Calendar size={14} className="mr-1" /> {format(post.createdAt?.toDate() || new Date(), 'dd MMM, yyyy', { locale: ptBR })}</span>
        </div>
        <h3 className="text-xl font-serif font-bold text-gray-900 mb-3 line-clamp-2 hover:text-primary transition-colors">
          <Link to={`/blog/${post.id}`}>{post.title}</Link>
        </h3>
        <p className="text-gray-500 text-sm mb-6 line-clamp-3 font-sans leading-relaxed">
          {post.excerpt}
        </p>
        <Link
          to={`/blog/${post.id}`}
          className="text-sm font-bold text-primary hover:text-accent transition-colors flex items-center group"
        >
          Ler Mais <ArrowRight size={16} className="ml-1 transition-transform group-hover:translate-x-1" />
        </Link>
      </div>
    </motion.div>
  );
};

export default function Home() {
  const [latestPosts, setLatestPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        const q = query(
          collection(db, 'posts'),
          where('status', '==', 'published'),
          orderBy('createdAt', 'desc'),
          limit(3)
        );
        const querySnapshot = await getDocs(q);
        const postsData = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Post));
        setLatestPosts(postsData);
      } catch (error) {
        console.error("Error fetching posts:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchPosts();
  }, []);

  return (
    <div className="bg-white">
      <Hero />

      {/* Latest Posts Section */}
      <section className="py-24 bg-nude/30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row justify-between items-end mb-12">
            <div className="max-w-2xl">
              <h2 className="text-3xl md:text-4xl font-serif font-bold text-gray-900 mb-4">Últimas Publicações</h2>
              <p className="text-gray-500 font-sans">
                Fique por dentro das novidades, reflexões e dicas que partilho aqui no blog.
              </p>
            </div>
            <Link
              to="/blog"
              className="mt-6 md:mt-0 px-6 py-2 border-b-2 border-primary text-primary font-bold hover:text-accent hover:border-accent transition-all"
            >
              Ver Tudo
            </Link>
          </div>

          {loading ? (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {[1, 2, 3].map(i => (
                <div key={i} className="animate-pulse bg-gray-100 h-96 rounded-2xl" />
              ))}
            </div>
          ) : latestPosts.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {latestPosts.map((post, index) => (
                <motion.div
                  key={post.id}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                  viewport={{ once: true }}
                >
                  <PostCard post={post} />
                </motion.div>
              ))}
            </div>
          ) : (
            <div className="text-center py-20 bg-white rounded-3xl border border-dashed border-gray-200">
              <p className="text-gray-400 italic">Ainda não há publicações. Fique atenta!</p>
            </div>
          )}
        </div>
      </section>

      {/* Newsletter Section */}
      <section className="py-24 bg-white">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <div className="bg-accent/20 p-12 rounded-[3rem] border border-accent/30">
            <h2 className="text-3xl font-serif font-bold text-gray-900 mb-4">Mantenha-se Conectada</h2>
            <p className="text-gray-600 mb-8 max-w-lg mx-auto">
              Subscreva a nossa newsletter para receber as últimas histórias e reflexões diretamente no seu e-mail.
            </p>
            <form className="flex flex-col sm:flex-row gap-4 max-w-md mx-auto">
              <input
                type="email"
                placeholder="Seu melhor e-mail"
                className="flex-grow px-6 py-4 rounded-full border border-gray-200 focus:outline-none focus:ring-2 focus:ring-primary/50 bg-white"
                required
              />
              <button
                type="submit"
                className="px-8 py-4 bg-primary text-white font-bold rounded-full shadow-md hover:bg-opacity-90 transition-all"
              >
                Subscrever
              </button>
            </form>
          </div>
        </div>
      </section>
    </div>
  );
}
