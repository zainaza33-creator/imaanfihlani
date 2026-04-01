import Navbar from './components/Navbar';
import Hero from './components/Hero';
import About from './components/About';
import ServicesTitle from './components/ServicesTitle';
import Services from './components/Services';
import Portfolio from './components/Portfolio';
import ContactForm from './components/ContactForm';
import Footer from './components/Footer';

function App() {
  return (
    <div className="min-h-screen bg-charcoal">
      <Navbar />
      <main className="pt-[60px]"> {/* Add padding for fixed navbar */}
        <Hero />
        <About />
        <ServicesTitle />
        <Services />
        <Portfolio />
        <ContactForm />
      </main>
      <Footer />
    </div>
  );
}

export default App;