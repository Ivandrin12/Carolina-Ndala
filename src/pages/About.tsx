import { motion } from 'framer-motion';
import { Instagram, Facebook, Twitter, Linkedin, Heart, Star, Sparkles, Coffee } from 'lucide-react';

export default function About() {
  return (
    <div className="bg-white min-h-screen">
      {/* Hero Section */}
      <section className="relative py-24 bg-nude/50 overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            <motion.div
              initial={{ opacity: 0, x: -50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8 }}
              className="relative"
            >
              <div className="relative z-10 rounded-[3rem] overflow-hidden shadow-2xl border-8 border-white">
                <img
                  src="https://picsum.photos/seed/carolina/800/1000"
                  alt="Carolina Ndala"
                  className="w-full h-full object-cover"
                  referrerPolicy="no-referrer"
                />
              </div>
              {/* Decorative elements */}
              <motion.div
                animate={{ rotate: 360 }}
                transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
                className="absolute -top-10 -right-10 w-40 h-40 bg-accent/30 rounded-full blur-2xl"
              />
              <motion.div
                animate={{ y: [0, -20, 0] }}
                transition={{ duration: 5, repeat: Infinity }}
                className="absolute -bottom-10 -left-10 w-32 h-32 bg-lilac/30 rounded-full blur-2xl"
              />
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
            >
              <h1 className="text-4xl md:text-6xl font-serif font-bold text-gray-900 mb-6">
                Olá, eu sou a <span className="text-primary italic">Carolina Ndala</span>
              </h1>
              <p className="text-lg text-gray-600 font-sans font-light mb-8 leading-relaxed">
                Angolana, apaixonada por palavras, histórias e pela beleza que reside nos detalhes do quotidiano. 
                Criei este espaço para partilhar a minha visão do mundo, os meus sonhos e o meu propósito.
              </p>
              <div className="space-y-6">
                <div className="flex items-start space-x-4">
                  <div className="p-3 bg-accent rounded-2xl text-primary">
                    <Heart size={24} />
                  </div>
                  <div>
                    <h3 className="text-xl font-serif font-bold text-gray-900 mb-1">Minha Paixão</h3>
                    <p className="text-gray-500 text-sm">Escrever é a minha forma de respirar e de dar voz aos pensamentos mais profundos.</p>
                  </div>
                </div>
                <div className="flex items-start space-x-4">
                  <div className="p-3 bg-lilac rounded-2xl text-primary">
                    <Star size={24} />
                  </div>
                  <div>
                    <h3 className="text-xl font-serif font-bold text-gray-900 mb-1">Meu Propósito</h3>
                    <p className="text-gray-500 text-sm">Inspirar outras mulheres a encontrarem a sua própria voz e a brilharem com autenticidade.</p>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Story Section */}
      <section className="py-24 bg-white">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
          >
            <h2 className="text-3xl md:text-5xl font-serif font-bold text-gray-900 mb-12">A Minha História</h2>
            <div className="space-y-8 text-lg text-gray-600 font-sans font-light leading-relaxed text-justify">
              <p>
                Desde muito cedo que as palavras foram as minhas melhores companheiras. Em cada caderno que preenchia, 
                descobria um novo pedaço de mim. O blog **astresnomeublog** nasceu de uma vontade genuína de criar 
                uma comunidade onde a vulnerabilidade é vista como força e a criatividade como um caminho para a cura.
              </p>
              <p>
                Aqui, não encontrará apenas textos; encontrará pedaços da minha alma, reflexões sobre a vida em Angola, 
                dicas de lifestyle e histórias que espero que ressoem no seu coração. Acredito que todos temos uma 
                estrela interior que merece brilhar, e este blog é o meu convite para que brilhemos juntas.
              </p>
              <p>
                Seja bem-vinda a este refúgio digital. Espero que se sinta acolhida, inspirada e, acima de tudo, 
                em casa.
              </p>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Values Section */}
      <section className="py-24 bg-nude/20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
            {[
              { icon: <Sparkles size={32} />, title: "Criatividade", text: "Explorar novas formas de expressão e de ver o mundo." },
              { icon: <Coffee size={32} />, title: "Autenticidade", text: "Ser verdadeira comigo mesma e com quem me lê." },
              { icon: <Heart size={32} />, title: "Empatia", text: "Criar conexões reais e profundas através das palavras." }
            ].map((item, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                viewport={{ once: true }}
                className="bg-white p-10 rounded-[2rem] shadow-sm text-center border border-gray-100"
              >
                <div className="inline-flex p-4 bg-accent/30 text-primary rounded-full mb-6">
                  {item.icon}
                </div>
                <h3 className="text-2xl font-serif font-bold text-gray-900 mb-4">{item.title}</h3>
                <p className="text-gray-500 text-sm leading-relaxed">{item.text}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
