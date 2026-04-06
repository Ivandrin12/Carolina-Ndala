import { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { doc, getDoc, setDoc, updateDoc, collection, addDoc, serverTimestamp } from 'firebase/firestore';
import { db, auth } from '../../firebase';
import { Post, Category } from '../../types';
import { motion } from 'framer-motion';
import { Save, ArrowLeft, Image as ImageIcon, Eye, FileText, Layout, Check, AlertCircle, Settings as SettingsIcon } from 'lucide-react';
import ReactMarkdown from 'react-markdown';

export default function EditPost() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(id ? true : false);
  const [submitting, setSubmitting] = useState(false);
  const [preview, setPreview] = useState(false);
  const [error, setError] = useState('');

  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [excerpt, setExcerpt] = useState('');
  const [category, setCategory] = useState('Geral');
  const [image, setImage] = useState('');
  const [status, setStatus] = useState<'draft' | 'published'>('draft');

  useEffect(() => {
    if (id) {
      const fetchPost = async () => {
        try {
          const postDoc = await getDoc(doc(db, 'posts', id));
          if (postDoc.exists()) {
            const data = postDoc.data() as Post;
            setTitle(data.title);
            setContent(data.content);
            setExcerpt(data.excerpt);
            setCategory(data.category);
            setImage(data.image);
            setStatus(data.status);
          }
        } catch (error) {
          console.error("Error fetching post:", error);
        } finally {
          setLoading(false);
        }
      };
      fetchPost();
    }
  }, [id]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    setError('');

    const postData = {
      title,
      content,
      excerpt,
      category,
      image,
      status,
      updatedAt: serverTimestamp(),
      authorId: auth.currentUser?.uid,
    };

    try {
      if (id) {
        await updateDoc(doc(db, 'posts', id), postData);
      } else {
        await addDoc(collection(db, 'posts'), {
          ...postData,
          createdAt: serverTimestamp(),
        });
      }
      navigate('/admin');
    } catch (err: any) {
      setError('Erro ao guardar o artigo. Verifique os campos e tente novamente.');
      console.error(err);
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

  return (
    <div className="bg-nude/20 min-h-screen py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row justify-between items-center mb-12 gap-6">
          <div className="flex items-center space-x-4">
            <Link to="/admin" className="p-3 bg-white text-gray-400 hover:text-primary rounded-full shadow-sm transition-all">
              <ArrowLeft size={20} />
            </Link>
            <h1 className="text-3xl font-serif font-bold text-gray-900">
              {id ? 'Editar Artigo' : 'Novo Artigo'}
            </h1>
          </div>
          <div className="flex items-center space-x-4">
            <button
              onClick={() => setPreview(!preview)}
              className={`px-6 py-3 rounded-full font-bold transition-all flex items-center ${
                preview ? 'bg-primary text-white' : 'bg-white text-gray-600 hover:text-primary'
              }`}
            >
              {preview ? <Layout size={18} className="mr-2" /> : <Eye size={18} className="mr-2" />}
              {preview ? 'Editor' : 'Pré-visualizar'}
            </button>
            <button
              onClick={handleSubmit}
              disabled={submitting}
              className="px-8 py-3 bg-primary text-white font-bold rounded-full shadow-md hover:bg-opacity-90 transition-all flex items-center disabled:opacity-50"
            >
              {submitting ? 'Guardando...' : (
                <><Save size={18} className="mr-2" /> Guardar Artigo</>
              )}
            </button>
          </div>
        </div>

        {error && (
          <div className="mb-8 p-4 bg-red-50 border border-red-100 text-red-600 rounded-2xl text-sm flex items-center">
            <AlertCircle size={18} className="mr-2 flex-shrink-0" />
            {error}
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Editor */}
          <div className="lg:col-span-2 space-y-8">
            {preview ? (
              <div className="bg-white p-12 rounded-[3rem] shadow-sm border border-gray-100 min-h-[600px]">
                <h1 className="text-4xl font-serif font-bold text-gray-900 mb-8">{title || 'Título do Artigo'}</h1>
                <div className="prose prose-lg prose-primary max-w-none font-sans text-gray-700">
                  <ReactMarkdown>{content || 'O conteúdo aparecerá aqui...'}</ReactMarkdown>
                </div>
              </div>
            ) : (
              <div className="bg-white p-10 rounded-[3rem] shadow-sm border border-gray-100 space-y-6">
                <div className="space-y-2">
                  <label className="text-xs font-bold text-gray-400 uppercase tracking-widest ml-2">Título do Artigo</label>
                  <input
                    type="text"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    placeholder="Escreva um título cativante..."
                    className="w-full px-6 py-4 text-2xl font-serif font-bold rounded-2xl border border-gray-100 focus:outline-none focus:ring-2 focus:ring-primary/50 bg-nude/10"
                    required
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-xs font-bold text-gray-400 uppercase tracking-widest ml-2">Conteúdo (Markdown)</label>
                  <textarea
                    value={content}
                    onChange={(e) => setContent(e.target.value)}
                    rows={20}
                    placeholder="Era uma vez..."
                    className="w-full px-6 py-4 rounded-2xl border border-gray-100 focus:outline-none focus:ring-2 focus:ring-primary/50 bg-nude/10 font-mono text-sm resize-none"
                    required
                  ></textarea>
                </div>
              </div>
            )}
          </div>

          {/* Sidebar Settings */}
          <div className="space-y-8">
            <div className="bg-white p-8 rounded-[2.5rem] shadow-sm border border-gray-100 space-y-6">
              <h3 className="text-xl font-serif font-bold text-gray-900 mb-4 flex items-center">
                Definições <SettingsIcon size={20} className="ml-2 text-primary" />
              </h3>
              
              <div className="space-y-2">
                <label className="text-xs font-bold text-gray-400 uppercase tracking-widest ml-2">Status</label>
                <select
                  value={status}
                  onChange={(e) => setStatus(e.target.value as any)}
                  className="w-full px-6 py-3 rounded-xl border border-gray-100 focus:outline-none focus:ring-2 focus:ring-primary/50 bg-nude/10 font-bold text-gray-700"
                >
                  <option value="draft">Rascunho</option>
                  <option value="published">Publicado</option>
                </select>
              </div>

              <div className="space-y-2">
                <label className="text-xs font-bold text-gray-400 uppercase tracking-widest ml-2">Categoria</label>
                <input
                  type="text"
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
                  placeholder="Ex: Lifestyle, Reflexões..."
                  className="w-full px-6 py-3 rounded-xl border border-gray-100 focus:outline-none focus:ring-2 focus:ring-primary/50 bg-nude/10"
                />
              </div>

              <div className="space-y-2">
                <label className="text-xs font-bold text-gray-400 uppercase tracking-widest ml-2">Resumo (Excerpt)</label>
                <textarea
                  value={excerpt}
                  onChange={(e) => setExcerpt(e.target.value)}
                  rows={4}
                  placeholder="Uma breve descrição para a lista de posts..."
                  className="w-full px-6 py-3 rounded-xl border border-gray-100 focus:outline-none focus:ring-2 focus:ring-primary/50 bg-nude/10 text-sm resize-none"
                ></textarea>
              </div>

              <div className="space-y-2">
                <label className="text-xs font-bold text-gray-400 uppercase tracking-widest ml-2">Imagem de Capa (URL)</label>
                <div className="relative">
                  <ImageIcon className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                  <input
                    type="text"
                    value={image}
                    onChange={(e) => setImage(e.target.value)}
                    placeholder="https://exemplo.com/imagem.jpg"
                    className="w-full pl-12 pr-6 py-3 rounded-xl border border-gray-100 focus:outline-none focus:ring-2 focus:ring-primary/50 bg-nude/10 text-sm"
                  />
                </div>
                {image && (
                  <div className="mt-4 rounded-xl overflow-hidden h-32 border border-gray-100">
                    <img src={image} alt="Preview" className="w-full h-full object-cover" referrerPolicy="no-referrer" />
                  </div>
                )}
              </div>
            </div>

            <div className="bg-primary/10 p-8 rounded-[2.5rem] border border-primary/20">
              <h4 className="font-serif font-bold text-primary mb-2 flex items-center">
                Dica de Escrita <Check size={16} className="ml-2" />
              </h4>
              <p className="text-xs text-gray-600 leading-relaxed">
                Use imagens de alta qualidade e escreva títulos que despertem a curiosidade. 
                O resumo é o que convence o leitor a clicar no seu artigo!
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
