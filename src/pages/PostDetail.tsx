import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { doc, getDoc, collection, query, where, orderBy, getDocs, addDoc, serverTimestamp } from 'firebase/firestore';
import { db, auth } from '../firebase';
import { Post, Comment } from '../types';
import { motion } from 'framer-motion';
import { Calendar, User as UserIcon, ArrowLeft, MessageSquare, Send, Share2, Tag } from 'lucide-react';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import ReactMarkdown from 'react-markdown';

export default function PostDetail() {
  const { id } = useParams<{ id: string }>();
  const [post, setPost] = useState<Post | null>(null);
  const [comments, setComments] = useState<Comment[]>([]);
  const [loading, setLoading] = useState(true);
  const [commentName, setCommentName] = useState('');
  const [commentEmail, setCommentEmail] = useState('');
  const [commentText, setCommentText] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);

  useEffect(() => {
    const fetchPost = async () => {
      if (!id) return;
      try {
        const postDoc = await getDoc(doc(db, 'posts', id));
        if (postDoc.exists()) {
          setPost({ id: postDoc.id, ...postDoc.data() } as Post);
        }

        const commentsQuery = query(
          collection(db, 'comments'),
          where('postId', '==', id),
          where('status', '==', 'approved'),
          orderBy('createdAt', 'desc')
        );
        const commentsSnapshot = await getDocs(commentsQuery);
        setComments(commentsSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Comment)));
      } catch (error) {
        console.error("Error fetching post details:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchPost();
  }, [id]);

  const handleCommentSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!id || !commentName || !commentText) return;
    setSubmitting(true);
    try {
      await addDoc(collection(db, 'comments'), {
        postId: id,
        authorName: commentName,
        authorEmail: commentEmail,
        content: commentText,
        createdAt: serverTimestamp(),
        status: 'pending' // Comments need approval
      });
      setSuccess(true);
      setCommentName('');
      setCommentEmail('');
      setCommentText('');
      setTimeout(() => setSuccess(false), 5000);
    } catch (error) {
      console.error("Error submitting comment:", error);
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="h-screen w-full flex items-center justify-center bg-nude">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (!post) {
    return (
      <div className="h-screen w-full flex flex-col items-center justify-center bg-nude">
        <h2 className="text-2xl font-serif font-bold text-gray-900 mb-4">Artigo não encontrado</h2>
        <Link to="/blog" className="text-primary font-bold hover:underline">Voltar ao Blog</Link>
      </div>
    );
  }

  return (
    <div className="bg-white min-h-screen">
      {/* Hero Header */}
      <section className="relative h-[60vh] overflow-hidden">
        <img
          src={post.image || `https://picsum.photos/seed/${post.id}/1920/1080`}
          alt={post.title}
          className="w-full h-full object-cover"
          referrerPolicy="no-referrer"
        />
        <div className="absolute inset-0 bg-black/40 flex items-center justify-center text-center px-4">
          <div className="max-w-4xl">
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              className="mb-4"
            >
              <span className="px-4 py-1 bg-primary text-white text-xs font-bold uppercase tracking-widest rounded-full">
                {post.category}
              </span>
            </motion.div>
            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-3xl md:text-6xl font-serif font-bold text-white mb-6 leading-tight"
            >
              {post.title}
            </motion.h1>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="flex items-center justify-center text-white/80 text-sm space-x-6"
            >
              <span className="flex items-center"><Calendar size={16} className="mr-2" /> {format(post.createdAt?.toDate() || new Date(), 'dd MMM, yyyy', { locale: ptBR })}</span>
              <span className="flex items-center"><UserIcon size={16} className="mr-2" /> Carolina Ndala</span>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Content Section */}
      <section className="py-20 bg-white">
        <div className="max-w-3xl mx-auto px-4">
          <Link to="/blog" className="inline-flex items-center text-gray-400 hover:text-primary transition-colors mb-12 group">
            <ArrowLeft size={18} className="mr-2 transition-transform group-hover:-translate-x-1" /> Voltar ao Blog
          </Link>

          <div className="prose prose-lg prose-primary max-w-none font-sans text-gray-700 leading-relaxed">
            <ReactMarkdown>{post.content}</ReactMarkdown>
          </div>

          <div className="mt-16 pt-8 border-t border-gray-100 flex flex-col sm:flex-row justify-between items-center gap-6">
            <div className="flex items-center space-x-4">
              <span className="text-sm font-bold text-gray-400 uppercase tracking-widest">Partilhar:</span>
              <button className="p-2 text-gray-400 hover:text-primary transition-colors"><Share2 size={20} /></button>
            </div>
            <div className="flex items-center space-x-2">
              <Tag size={16} className="text-primary" />
              <span className="text-sm text-gray-500 font-medium">{post.category}</span>
            </div>
          </div>
        </div>
      </section>

      {/* Comments Section */}
      <section className="py-20 bg-nude/20">
        <div className="max-w-3xl mx-auto px-4">
          <h2 className="text-3xl font-serif font-bold text-gray-900 mb-12 flex items-center">
            <MessageSquare size={28} className="mr-4 text-primary" /> Comentários ({comments.length})
          </h2>

          {/* Comment Form */}
          <div className="bg-white p-8 rounded-3xl shadow-sm border border-gray-100 mb-16">
            <h3 className="text-xl font-serif font-bold text-gray-900 mb-6">Deixe o seu comentário</h3>
            <form onSubmit={handleCommentSubmit} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <input
                  type="text"
                  placeholder="Seu nome"
                  value={commentName}
                  onChange={(e) => setCommentName(e.target.value)}
                  className="w-full px-6 py-3 rounded-2xl border border-gray-100 focus:outline-none focus:ring-2 focus:ring-primary/50 bg-nude/30"
                  required
                />
                <input
                  type="email"
                  placeholder="Seu e-mail (opcional)"
                  value={commentEmail}
                  onChange={(e) => setCommentEmail(e.target.value)}
                  className="w-full px-6 py-3 rounded-2xl border border-gray-100 focus:outline-none focus:ring-2 focus:ring-primary/50 bg-nude/30"
                />
              </div>
              <textarea
                placeholder="Escreva aqui o seu pensamento..."
                value={commentText}
                onChange={(e) => setCommentText(e.target.value)}
                rows={4}
                className="w-full px-6 py-4 rounded-2xl border border-gray-100 focus:outline-none focus:ring-2 focus:ring-primary/50 bg-nude/30 resize-none"
                required
              ></textarea>
              <button
                type="submit"
                disabled={submitting}
                className="w-full sm:w-auto px-10 py-4 bg-primary text-white font-bold rounded-full shadow-md hover:bg-opacity-90 transition-all flex items-center justify-center disabled:opacity-50"
              >
                {submitting ? 'Enviando...' : (
                  <>Enviar Comentário <Send size={18} className="ml-2" /></>
                )}
              </button>
              {success && (
                <motion.p
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="text-green-600 text-sm font-medium mt-2"
                >
                  Obrigada! O seu comentário foi enviado e aguarda aprovação.
                </motion.p>
              )}
            </form>
          </div>

          {/* Comments List */}
          <div className="space-y-8">
            {comments.length > 0 ? (
              comments.map((comment) => (
                <div key={comment.id} className="bg-white p-8 rounded-3xl shadow-sm border border-gray-100">
                  <div className="flex justify-between items-start mb-4">
                    <div className="flex items-center">
                      <div className="w-10 h-10 bg-accent rounded-full flex items-center justify-center text-primary font-bold mr-4">
                        {comment.authorName.charAt(0).toUpperCase()}
                      </div>
                      <div>
                        <h4 className="font-bold text-gray-900">{comment.authorName}</h4>
                        <span className="text-xs text-gray-400">{format(comment.createdAt?.toDate() || new Date(), 'dd MMM, yyyy', { locale: ptBR })}</span>
                      </div>
                    </div>
                  </div>
                  <p className="text-gray-600 font-sans leading-relaxed">
                    {comment.content}
                  </p>
                </div>
              ))
            ) : (
              <div className="text-center py-12 bg-white/50 rounded-3xl border border-dashed border-gray-200">
                <p className="text-gray-400 italic">Seja a primeira a comentar este artigo!</p>
              </div>
            )}
          </div>
        </div>
      </section>
    </div>
  );
}
