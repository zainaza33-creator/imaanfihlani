import React from 'react';
import Marquee from 'react-fast-marquee';

const Portfolio = () => {
  const clients = [
    { name: 'LIGER PROPERTIES', font: 'font-vogue' },
    { name: 'QARUNO', font: 'font-instyle' },
    { name: 'MALL FOR WOMAN', font: 'font-cosmo' },
    { name: 'BIG 202', font: 'font-elle' },
    { name: 'LEGENDS', font: 'font-vogue' },
    { name: 'CLOUDSKUNK', font: 'font-instyle' },
    { name: 'NDZUMO CONSULTING', font: 'font-cosmo' },
    { name: 'DECORTEC', font: 'font-elle' },
  ];

  return (
    <section id="portfolio" className="bg-charcoal py-20 overflow-hidden">
      <div className="max-w-7xl mx-auto px-6">
        <div className="text-center mb-12">
          <h3 className="text-text-muted text-sm tracking-widest uppercase mb-4 font-sans">
            Featured In
          </h3>
        </div>
        
        {/* Marquee Container */}
        <div className="relative">
          <Marquee 
            speed={40}
            gradient={false}
            pauseOnHover={true}
            className="py-8"
          >
            {clients.map((client, index) => (
              <div 
                key={index} 
                className="mx-12 text-center"
              >
                <div className={`text-4xl md:text-6xl ${client.font} text-gold opacity-90 hover:opacity-100 transition-opacity duration-300`}>
                  {client.name}
                </div>
                <div className="h-px w-24 mx-auto bg-bronze/30 mt-4"></div>
              </div>
            ))}
          </Marquee>
        </div>
      </div>
    </section>
  );
};

export default Portfolio;