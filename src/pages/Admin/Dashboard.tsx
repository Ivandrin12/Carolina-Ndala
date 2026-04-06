import { useState, useEffect } from 'react';
import { collection, query, orderBy, getDocs, deleteDoc, doc, updateDoc, addDoc } from 'firebase/firestore';
import { db, auth } from '../../firebase';
import { Post, Comment, Category } from '../../types';
import { motion } from 'framer-motion';
import { Link, useNavigate } from 'react-router-dom';
import { Plus, Edit, Trash2, Eye, MessageSquare, Check, X, LogOut, Settings as SettingsIcon, FileText, Users } from 'lucide-react';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';

export default function Dashboard() {
  const [posts, setPosts] = useState<Post[]>([]);
  const [comments, setComments] = useState<Comment[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<'posts' | 'comments'>('posts');
  const navigate = useNavigate();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const postsSnapshot = await getDocs(query(collection(db, 'posts'), orderBy('createdAt', 'desc')));
        setPosts(postsSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Post)));

        const commentsSnapshot = await getDocs(query(collection(db, 'comments'), orderBy('createdAt', 'desc')));
        setComments(commentsSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Comment)));

        const categoriesSnapshot = await getDocs(collection(db, 'categories'));
        if (categoriesSnapshot.empty) {
          await addDoc(collection(db, 'categories'), { name: 'Geral', slug: 'geral' });
          await addDoc(collection(db, 'categories'), { name: 'Lifestyle', slug: 'lifestyle' });
          await addDoc(collection(db, 'categories'), { name: 'Reflexões', slug: 'reflexoes' });
        }
      } catch (error) {
        console.error("Error fetching dashboard data:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const handleDeletePost = async (id: string) => {
    if (window.confirm('Tem certeza que deseja apagar este post?')) {
      try {
        await deleteDoc(doc(db, 'posts', id));
        setPosts(posts.filter(p => p.id !== id));
      } catch (error) {
        console.error("Error deleting post:", error);
      }
    }
  };

  const handleApproveComment = async (id: string) => {
    try {
      await updateDoc(doc(db, 'comments', id), { status: 'approved' });
      setComments(comments.map(c => c.id === id ? { ...c, status: 'approved' } : c));
    } catch (error) {
      console.error("Error approving comment:", error);
    }
  };

  const handleDeleteComment = async (id: string) => {
    if (window.confirm('Tem certeza que deseja apagar este comentário?')) {
      try {
        await deleteDoc(doc(db, 'comments', id));
        setComments(comments.filter(c => c.id !== id));
      } catch (error) {
        console.error("Error deleting comment:", error);
      }
    }
  };

  return (
    <div className="bg-nude/20 min-h-screen py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row justify-between items-center mb-12 gap-6">
          <div>
            <h1 className="text-3xl md:text-4xl font-serif font-bold text-gray-900 mb-2">Painel de Controlo</h1>
            <p className="text-gray-500 font-sans">Bem-vinda, Carolina. O que vamos criar hoje?</p>
          </div>
          <div className="flex items-center space-x-4">
            <Link
              to="/admin/new"
              className="px-6 py-3 bg-primary text-white font-bold rounded-full shadow-md hover:bg-opacity-90 transition-all flex items-center"
            >
              <Plus size={18} className="mr-2" /> Novo Artigo
            </Link>
            <button
              onClick={() => auth.signOut()}
              className="p-3 bg-white text-gray-400 hover:text-red-500 rounded-full shadow-sm transition-all"
            >
              <LogOut size={20} />
            </button>
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
          <div className="bg-white p-8 rounded-3xl shadow-sm border border-gray-100 flex items-center space-x-6">
            <div className="p-4 bg-primary/10 text-primary rounded-2xl"><FileText size={28} /></div>
            <div>
              <p className="text-sm text-gray-400 font-bold uppercase tracking-widest">Artigos</p>
              <p className="text-3xl font-serif font-bold text-gray-900">{posts.length}</p>
            </div>
          </div>
          <div className="bg-white p-8 rounded-3xl shadow-sm border border-gray-100 flex items-center space-x-6">
            <div className="p-4 bg-accent/30 text-primary rounded-2xl"><MessageSquare size={28} /></div>
            <div>
              <p className="text-sm text-gray-400 font-bold uppercase tracking-widest">Comentários</p>
              <p className="text-3xl font-serif font-bold text-gray-900">{comments.length}</p>
            </div>
          </div>
          <div className="bg-white p-8 rounded-3xl shadow-sm border border-gray-100 flex items-center space-x-6">
            <div className="p-4 bg-lilac/30 text-primary rounded-2xl"><Users size={28} /></div>
            <div>
              <p className="text-sm text-gray-400 font-bold uppercase tracking-widest">Pendentes</p>
              <p className="text-3xl font-serif font-bold text-gray-900">{comments.filter(c => c.status === 'pending').length}</p>
            </div>
          </div>
        </div>

        {/* Tabs */}
        <div className="flex space-x-4 mb-8">
          <button
            onClick={() => setActiveTab('posts')}
            className={`px-8 py-3 rounded-full font-bold transition-all ${
              activeTab === 'posts' ? 'bg-primary text-white shadow-md' : 'bg-white text-gray-400 hover:text-primary'
            }`}
          >
            Artigos
          </button>
          <button
            onClick={() => setActiveTab('comments')}
            className={`px-8 py-3 rounded-full font-bold transition-all ${
              activeTab === 'comments' ? 'bg-primary text-white shadow-md' : 'bg-white text-gray-400 hover:text-primary'
            }`}
          >
            Comentários
          </button>
        </div>

        {/* Content */}
        {loading ? (
          <div className="bg-white rounded-3xl h-96 animate-pulse" />
        ) : activeTab === 'posts' ? (
          <div className="bg-white rounded-3xl shadow-sm border border-gray-100 overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-left">
                <thead className="bg-gray-50 border-b border-gray-100">
                  <tr>
                    <th className="px-8 py-4 text-xs font-bold text-gray-400 uppercase tracking-widest">Artigo</th>
                    <th className="px-8 py-4 text-xs font-bold text-gray-400 uppercase tracking-widest">Categoria</th>
                    <th className="px-8 py-4 text-xs font-bold text-gray-400 uppercase tracking-widest">Status</th>
                    <th className="px-8 py-4 text-xs font-bold text-gray-400 uppercase tracking-widest">Data</th>
                    <th className="px-8 py-4 text-xs font-bold text-gray-400 uppercase tracking-widest text-right">Ações</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-50">
                  {posts.map(post => (
                    <tr key={post.id} className="hover:bg-nude/10 transition-colors">
                      <td className="px-8 py-6">
                        <div className="flex items-center">
                          <img
                            src={post.image || `https://picsum.photos/seed/${post.id}/100/100`}
                            alt={post.title}
                            className="w-12 h-12 rounded-xl object-cover mr-4"
                            referrerPolicy="no-referrer"
                          />
                          <span className="font-bold text-gray-900 line-clamp-1">{post.title}</span>
                        </div>
                      </td>
                      <td className="px-8 py-6">
                        <span className="px-3 py-1 bg-accent/30 text-primary text-[10px] font-bold uppercase tracking-widest rounded-full">
                          {post.category}
                        </span>
                      </td>
                      <td className="px-8 py-6">
                        <span className={`text-xs font-bold uppercase tracking-widest ${
                          post.status === 'published' ? 'text-green-500' : 'text-gray-400'
                        }`}>
                          {post.status === 'published' ? 'Publicado' : 'Rascunho'}
                        </span>
                      </td>
                      <td className="px-8 py-6 text-sm text-gray-400">
                        {format(post.createdAt?.toDate() || new Date(), 'dd/MM/yyyy', { locale: ptBR })}
                      </td>
                      <td className="px-8 py-6 text-right">
                        <div className="flex justify-end space-x-2">
                          <Link to={`/blog/${post.id}`} className="p-2 text-gray-400 hover:text-primary transition-colors"><Eye size={18} /></Link>
                          <Link to={`/admin/edit/${post.id}`} className="p-2 text-gray-400 hover:text-primary transition-colors"><Edit size={18} /></Link>
                          <button onClick={() => handleDeletePost(post.id)} className="p-2 text-gray-400 hover:text-red-500 transition-colors"><Trash2 size={18} /></button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        ) : (
          <div className="bg-white rounded-3xl shadow-sm border border-gray-100 overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-left">
                <thead className="bg-gray-50 border-b border-gray-100">
                  <tr>
                    <th className="px-8 py-4 text-xs font-bold text-gray-400 uppercase tracking-widest">Autor</th>
                    <th className="px-8 py-4 text-xs font-bold text-gray-400 uppercase tracking-widest">Comentário</th>
                    <th className="px-8 py-4 text-xs font-bold text-gray-400 uppercase tracking-widest">Status</th>
                    <th className="px-8 py-4 text-xs font-bold text-gray-400 uppercase tracking-widest text-right">Ações</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-50">
                  {comments.map(comment => (
                    <tr key={comment.id} className="hover:bg-nude/10 transition-colors">
                      <td className="px-8 py-6">
                        <div className="font-bold text-gray-900">{comment.authorName}</div>
                        <div className="text-xs text-gray-400">{comment.authorEmail}</div>
                      </td>
                      <td className="px-8 py-6 max-w-md">
                        <p className="text-sm text-gray-600 line-clamp-2">{comment.content}</p>
                      </td>
                      <td className="px-8 py-6">
                        <span className={`text-xs font-bold uppercase tracking-widest ${
                          comment.status === 'approved' ? 'text-green-500' : 'text-orange-500'
                        }`}>
                          {comment.status === 'approved' ? 'Aprovado' : 'Pendente'}
                        </span>
                      </td>
                      <td className="px-8 py-6 text-right">
                        <div className="flex justify-end space-x-2">
                          {comment.status === 'pending' && (
                            <button onClick={() => handleApproveComment(comment.id)} className="p-2 text-green-500 hover:bg-green-50 rounded-full transition-all"><Check size={18} /></button>
                          )}
                          <button onClick={() => handleDeleteComment(comment.id)} className="p-2 text-red-500 hover:bg-red-50 rounded-full transition-all"><Trash2 size={18} /></button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
