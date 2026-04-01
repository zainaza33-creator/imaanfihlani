import React from 'react';
import brandStrategyImg from '../assets/brand strategy.png';
import contentCreationImg from '../assets/content creation.png';
import socialMediaMgmtImg from '../assets/social media management.png';

const Services = () => {
  const services = [
    {
      id: 1,
      title: "Brand Strategy",
      description: "Clear direction, positioning, and content planning tailored to your brand.",
      image: brandStrategyImg,
      link: "#contact"
    },
    {
      id: 2,
      title: "Content Strategy & Direction",
      description: "What to post, when to post it, and how it aligns with your goals.",
      image: contentCreationImg,
      link: "#contact"
    },
    {
      id: 3,
      title: "Social Media Management",
      description: "Consistent, curated, and conversion-focused execution.",
      image: socialMediaMgmtImg,
      link: "#contact"
    }
  ];

  return (
    <section id="services" className="bg-charcoal">
      <div className="max-w-7xl mx-auto px-6 md:px-12 lg:px-24 -mt-8">
        <div className="grid md:grid-cols-3 gap-8">
          {services.map((service) => (
            <div 
              key={service.id} 
              className="group bg-charcoal-alt border border-bronze/20 rounded-lg overflow-hidden hover:border-gold transition-all duration-300"
            >
              {/* Image */}
              <div className="h-64 overflow-hidden">
                <img 
                  src={service.image} 
                  alt={service.title}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />
              </div>
              
              {/* Content - All Dark */}
              <div className="p-8">
                <h3 className="text-xl font-luxury mb-4 text-gold group-hover:text-gold-rich transition-colors duration-300">
                  {service.title}
                </h3>
                <p className="text-text-muted mb-6 leading-relaxed font-sans">
                  {service.description}
                </p>
                <a 
                  href={service.link} 
                  className="text-gold hover:text-gold-rich uppercase text-sm tracking-wider inline-flex items-center gap-2 transition-colors duration-300 font-sans"
                >
                  LEARN MORE
                  <span className="group-hover:translate-x-1 transition-transform duration-300">→</span>
                </a>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Services;