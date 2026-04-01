import React from 'react';

const ServicesTitle = () => {
  const goToServices = () => {
    // Will be updated when Services page is created
    window.location.href = '/services';
  };

  return (
    <section className="bg-charcoal">
      <div className="max-w-7xl mx-auto px-6 md:px-12 lg:px-24 py-16">
        <div className="text-center">
          {/* Gold lines with Signature Services - Clickable */}
          <div 
            onClick={goToServices}
            className="flex items-center justify-center mb-8 cursor-pointer group"
          >
            <div className="h-px w-16 bg-gold mx-4 group-hover:w-20 transition-all duration-300"></div>
            <h2 className="text-4xl md:text-5xl font-luxury text-gold px-4 group-hover:text-gold-rich transition-colors duration-300">
              Signature Services
            </h2>
            <div className="h-px w-16 bg-gold mx-4 group-hover:w-20 transition-all duration-300"></div>
          </div>
          <p className="text-text-muted font-sans max-w-2xl mx-auto">
            Premium social media solutions for luxury brands seeking exceptional results
          </p>
        </div>
      </div>
    </section>
  );
};

export default ServicesTitle;