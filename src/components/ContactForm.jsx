import React, { useState, useEffect } from 'react';

const ContactForm = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    company: '',
    budget: '',
    currency: 'USD',
    customBudget: '',
    message: ''
  });
  
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [budgetOptions, setBudgetOptions] = useState([]);

  // Budget ranges based on currency
  const budgetConfig = {
    USD: [
      { value: '', label: 'Select budget range' },
      { value: '500-1k', label: '$500 - $1,000' },
      { value: '1k-3k', label: '$1,000 - $3,000' },
      { value: '3k-5k', label: '$3,000 - $5,000' },
      { value: '5k-10k', label: '$5,000 - $10,000' },
      { value: '10k+', label: '$10,000+' },
      { value: 'custom', label: 'Custom Amount' }
    ],
    ZAR: [
      { value: '', label: 'Select budget range' },
      { value: '7.5k-15k', label: 'R7,500 - R15,000' },
      { value: '15k-45k', label: 'R15,000 - R45,000' },
      { value: '45k-75k', label: 'R45,000 - R75,000' },
      { value: '75k-150k', label: 'R75,000 - R150,000' },
      { value: '150k+', label: 'R150,000+' },
      { value: 'custom', label: 'Custom Amount' }
    ],
    GBP: [
      { value: '', label: 'Select budget range' },
      { value: '400-800', label: '£400 - £800' },
      { value: '800-2.4k', label: '£800 - £2,400' },
      { value: '2.4k-4k', label: '£2,400 - £4,000' },
      { value: '4k-8k', label: '£4,000 - £8,000' },
      { value: '8k+', label: '£8,000+' },
      { value: 'custom', label: 'Custom Amount' }
    ],
    EUR: [
      { value: '', label: 'Select budget range' },
      { value: '450-900', label: '€450 - €900' },
      { value: '900-2.7k', label: '€900 - €2,700' },
      { value: '2.7k-4.5k', label: '€2,700 - €4,500' },
      { value: '4.5k-9k', label: '€4,500 - €9,000' },
      { value: '9k+', label: '€9,000+' },
      { value: 'custom', label: 'Custom Amount' }
    ]
  };

  // Get currency symbol
  const getCurrencySymbol = (currency) => {
    const symbols = {
      USD: '$',
      ZAR: 'R',
      GBP: '£',
      EUR: '€'
    };
    return symbols[currency] || '$';
  };

  // Update budget options when currency changes
  useEffect(() => {
    setBudgetOptions(budgetConfig[formData.currency] || budgetConfig.USD);
  }, [formData.currency]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    // Simulate form submission
    setTimeout(() => {
      setIsSubmitted(true);
      setIsSubmitting(false);
    }, 1500);
  };

  return (
    <section id="contact" className="bg-charcoal section-padding">
      <div className="max-w-3xl mx-auto">
        <div className="text-center mb-12">
          <h2 className="text-4xl md:text-5xl font-luxury mb-6 text-gold">
            Let’s shape a presence worthy of your brand.
          </h2>
          <p className="text-text-muted font-sans">
            Complete the form below and I'll be in touch within 24 hours
          </p>
        </div>
        
        {isSubmitted ? (
          <div className="text-center py-12 border border-gold/20 bg-charcoal-alt/50">
            <div className="text-gold text-5xl mb-4">✓</div>
            <h3 className="text-2xl font-luxury mb-4 text-text-dark">
              Thank you for your application!
            </h3>
            <p className="text-text-muted font-sans">
              I'll review your information and get back to you within 48 hours.
            </p>
            <button 
              onClick={() => setIsSubmitted(false)}
              className="btn-secondary mt-8"
            >
              Send Another Message
            </button>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Name & Email */}
            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <input
                  type="text"
                  name="name"
                  placeholder="Full Name *"
                  value={formData.name}
                  onChange={handleChange}
                  required
                  className="w-full bg-transparent border-b border-text-muted/30 text-text-dark 
                           placeholder:text-text-muted/50 py-3 px-2 focus:outline-none 
                           focus:border-gold transition-colors duration-300 font-sans"
                />
              </div>
              
              <div>
                <input
                  type="email"
                  name="email"
                  placeholder="Email Address *"
                  value={formData.email}
                  onChange={handleChange}
                  required
                  className="w-full bg-transparent border-b border-text-muted/30 text-text-dark 
                           placeholder:text-text-muted/50 py-3 px-2 focus:outline-none 
                           focus:border-gold transition-colors duration-300 font-sans"
                />
              </div>
            </div>
            
            {/* Phone & Company */}
            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <input
                  type="tel"
                  name="phone"
                  placeholder="Contact Number *"
                  value={formData.phone}
                  onChange={handleChange}
                  required
                  className="w-full bg-transparent border-b border-text-muted/30 text-text-dark 
                           placeholder:text-text-muted/50 py-3 px-2 focus:outline-none 
                           focus:border-gold transition-colors duration-300 font-sans"
                />
              </div>
              
              <div>
                <input
                  type="text"
                  name="company"
                  placeholder="Company Name"
                  value={formData.company}
                  onChange={handleChange}
                  className="w-full bg-transparent border-b border-text-muted/30 text-text-dark 
                           placeholder:text-text-muted/50 py-3 px-2 focus:outline-none 
                           focus:border-gold transition-colors duration-300 font-sans"
                />
              </div>
            </div>
            
            {/* Budget Section */}
            <div className="space-y-4">
              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <select
                    name="budget"
                    value={formData.budget}
                    onChange={handleChange}
                    className="w-full bg-transparent border-b border-text-muted/30 text-text-dark 
                             py-3 px-2 focus:outline-none focus:border-gold 
                             transition-colors duration-300 font-sans appearance-none"
                  >
                    {budgetOptions.map(option => (
                      <option key={option.value} value={option.value} className="bg-charcoal">
                        {option.label}
                      </option>
                    ))}
                  </select>
                </div>
                
                <div className="flex items-center space-x-4">
                  <select
                    name="currency"
                    value={formData.currency}
                    onChange={handleChange}
                    className="bg-transparent border-b border-text-muted/30 text-text-dark 
                             py-3 px-2 focus:outline-none focus:border-gold 
                             transition-colors duration-300 font-sans"
                  >
                    <option value="USD" className="bg-charcoal">USD $</option>
                    <option value="ZAR" className="bg-charcoal">ZAR R</option>
                    <option value="GBP" className="bg-charcoal">GBP £</option>
                    <option value="EUR" className="bg-charcoal">EUR €</option>
                  </select>
                  
                  {formData.budget === 'custom' && (
                    <div className="flex-1 flex items-center">
                      <span className="text-text-dark mr-2">{getCurrencySymbol(formData.currency)}</span>
                      <input
                        type="text"
                        name="customBudget"
                        placeholder="Enter amount"
                        value={formData.customBudget}
                        onChange={handleChange}
                        className="w-full bg-transparent border-b border-text-muted/30 text-text-dark 
                                 placeholder:text-text-muted/50 py-3 px-2 focus:outline-none 
                                 focus:border-gold transition-colors duration-300 font-sans"
                      />
                    </div>
                  )}
                </div>
              </div>
            </div>
            
            {/* Message */}
            <div>
              <textarea
                name="message"
                placeholder="Tell us about your project, goals, and timeline... *"
                value={formData.message}
                onChange={handleChange}
                required
                rows="6"
                className="w-full bg-transparent border border-text-muted/30 text-text-dark 
                         placeholder:text-text-muted/50 py-4 px-4 focus:outline-none 
                         focus:border-gold transition-colors duration-300 resize-none font-sans"
              />
            </div>
            
            {/* Submit Button */}
            <div className="text-center pt-4">
              <button 
                type="submit" 
                disabled={isSubmitting}
                className="btn-primary disabled:opacity-50 disabled:cursor-not-allowed min-w-[250px]"
              >
                {isSubmitting ? 'SUBMITTING...' : 'APPLY TO WORK WITH ME'}
              </button>
            </div>
          </form>
        )}
      </div>
    </section>
  );
};

export default ContactForm;