import React from 'react';
import heroImage from '../assets/imaan fihlani.jpg';

const Hero = () => {
  return (
    <section className="min-h-screen relative overflow-hidden">
      {/* Background Image - Covering entire hero */}
      <div className="absolute inset-0">
        <img 
          src={heroImage}
          alt="Imaan Fihlani - Social Media Strategist"
          className="w-full h-50 object-cover"
        />
        {/* Dark overlay for text readability */}
        <div className="absolute inset-0 bg-black/40"></div>
      </div>
      
      {/* Text Content - Overlay on image */}
      <div className="relative z-10 min-h-screen flex items-center section-padding">
        <div className="max-w-7xl mx-auto w-full">
          <div className="max-w-2xl">
            <h1 className="text-5xl md:text-7xl lg:text-8xl font-luxury leading-tight mb-8 text-gold">
              Refined Social<br />
              Strategy For Brands<br />
              That Lead
            </h1>  
            
            <p className="text-text-dark/90 text-lg md:text-xl mb-12 max-w-xl leading-relaxed font-sans">
              Luxury-led social media strategy for brands that want 
              clarity, consistency, & results.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4">
              <button className="btn-primary">
                WORK WITH ME
              </button>
              <button className="btn-secondary">
                VIEW SERVICES
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;