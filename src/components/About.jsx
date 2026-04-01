import React from 'react';

const About = () => {
  const scrollToAbout = () => {
    // Will be updated when About page is created
    window.location.href = '/about';
  };

  return (
    <section id="about" className="bg-ivory text-text-light">
      {/* Reduced padding: from py-20 to py-16 */}
      <div className="max-w-7xl mx-auto px-6 md:px-12 lg:px-24 py-16">
        <div className="text-center max-w-5xl mx-auto">
          {/* "I help modern brands..." - Fixed padding for letter "p" */}
          <h2 className="text-4xl md:text-5xl font-luxury mb-10 text-charcoal whitespace-nowrap overflow-visible">
            I help modern brands show up with intention.
          </h2>
          
          {/* 3 paragraphs in gold, centered - Reduced spacing */}
          <div className="space-y-6 text-lg text-center max-w-3xl mx-auto mb-10">
            <p className="text-gold leading-relaxed font-sans">
              As a social media strategist, I work with ambitious brands to create digital presence that
              feels aligned, elevated, and effective.
            </p>
            <p className="text-gold leading-relaxed font-sans">
              Every strategy is built with purpose, ensuring your brand is seen, remembered, and trusted.
            </p>
            <p className="text-gold leading-relaxed font-sans">
              Through tailored approaches and data-driven insights, I transform social media 
              from a marketing channel into a powerful brand asset.
            </p>
          </div>

          {/* Learn More Button */}
          <div className="text-center">
            <button 
              onClick={scrollToAbout}
              className="btn-primary"
            >
              LEARN MORE
            </button>
          </div>
        </div>
      </div>
    </section>
  );
};

export default About;