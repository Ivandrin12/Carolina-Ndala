import { useState } from 'react';
import { motion } from 'framer-motion';
import { Mail, Phone, MapPin, Instagram, Facebook, Twitter, Linkedin, Send, Sparkles } from 'lucide-react';

export default function Contact() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [subject, setSubject] = useState('');
  const [message, setMessage] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    // Simulate form submission
    await new Promise(resolve => setTimeout(resolve, 1500));
    setSuccess(true);
    setName('');
    setEmail('');
    setSubject('');
    setMessage('');
    setSubmitting(false);
    setTimeout(() => setSuccess(false), 5000);
  };

  return (
    <div className="bg-white min-h-screen py-24">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-4xl md:text-6xl font-serif font-bold text-gray-900 mb-6"
          >
            Vamos <span className="text-primary italic">Conversar</span>?
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-lg text-gray-600 font-sans font-light max-w-2xl mx-auto"
          >
            Adoraria ouvir os seus pensamentos, sugestões ou propostas de colaboração. 
            Sinta-se à vontade para entrar em contacto.
          </motion.p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-start">
          {/* Contact Info */}
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
            className="bg-nude/30 p-12 rounded-[3rem] border border-accent/20"
          >
            <h2 className="text-3xl font-serif font-bold text-gray-900 mb-8 flex items-center">
              Informações de Contacto <Sparkles size={24} className="ml-4 text-primary" />
            </h2>
            
            <div className="space-y-8 mb-12">
              <div className="flex items-start space-x-6">
                <div className="p-4 bg-white rounded-2xl text-primary shadow-sm">
                  <Mail size={24} />
                </div>
                <div>
                  <h4 className="font-bold text-gray-900 mb-1">E-mail</h4>
                  <p className="text-gray-500">carolinabraasndala@gmail.com</p>
                </div>
              </div>
              <div className="flex items-start space-x-6">
                <div className="p-4 bg-white rounded-2xl text-primary shadow-sm">
                  <Phone size={24} />
                </div>
                <div>
                  <h4 className="font-bold text-gray-900 mb-1">Telefone</h4>
                  <p className="text-gray-500">922 707 541</p>
                </div>
              </div>
              <div className="flex items-start space-x-6">
                <div className="p-4 bg-white rounded-2xl text-primary shadow-sm">
                  <MapPin size={24} />
                </div>
                <div>
                  <h4 className="font-bold text-gray-900 mb-1">Localização</h4>
                  <p className="text-gray-500">Luanda, Angola</p>
                </div>
              </div>
            </div>

            <h3 className="text-xl font-serif font-bold text-gray-900 mb-6">Siga-me nas Redes Sociais</h3>
            <div className="flex space-x-4">
              {[Instagram, Facebook, Twitter, Linkedin].map((Icon, i) => (
                <a
                  key={i}
                  href="#"
                  className="p-4 bg-white rounded-2xl text-gray-400 hover:text-primary hover:shadow-md transition-all"
                >
                  <Icon size={24} />
                </a>
              ))}
            </div>
          </motion.div>

          {/* Contact Form */}
          <motion.div
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
          >
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="text-sm font-bold text-gray-400 uppercase tracking-widest ml-2">Nome</label>
                  <input
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="w-full px-6 py-4 rounded-2xl border border-gray-100 focus:outline-none focus:ring-2 focus:ring-primary/50 bg-white shadow-sm"
                    required
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-bold text-gray-400 uppercase tracking-widest ml-2">E-mail</label>
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full px-6 py-4 rounded-2xl border border-gray-100 focus:outline-none focus:ring-2 focus:ring-primary/50 bg-white shadow-sm"
                    required
                  />
                </div>
              </div>
              <div className="space-y-2">
                <label className="text-sm font-bold text-gray-400 uppercase tracking-widest ml-2">Assunto</label>
                <input
                  type="text"
                  value={subject}
                  onChange={(e) => setSubject(e.target.value)}
                  className="w-full px-6 py-4 rounded-2xl border border-gray-100 focus:outline-none focus:ring-2 focus:ring-primary/50 bg-white shadow-sm"
                  required
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-bold text-gray-400 uppercase tracking-widest ml-2">Mensagem</label>
                <textarea
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  rows={6}
                  className="w-full px-6 py-4 rounded-2xl border border-gray-100 focus:outline-none focus:ring-2 focus:ring-primary/50 bg-white shadow-sm resize-none"
                  required
                ></textarea>
              </div>
              <button
                type="submit"
                disabled={submitting}
                className="w-full px-10 py-5 bg-primary text-white font-bold rounded-full shadow-lg hover:bg-opacity-90 transition-all flex items-center justify-center disabled:opacity-50"
              >
                {submitting ? 'Enviando...' : (
                  <>Enviar Mensagem <Send size={20} className="ml-3" /></>
                )}
              </button>
              {success && (
                <motion.p
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="text-green-600 text-center font-medium mt-4"
                >
                  Mensagem enviada com sucesso! Responderei em breve.
                </motion.p>
              )}
            </form>
          </motion.div>
        </div>
      </div>
    </div>
  );
}
