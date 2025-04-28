// import React from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { ArrowRight, CheckCircle, FileText, Zap, BookOpen, MessageSquare, Chrome, Menu, X } from "lucide-react";
import Hero from "@/assets/hero.svg";
import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { LOADIPHLPAPI } from "dns";

const UplyLanding = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  // Handle scroll effect for navbar
  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 20) {
        setScrolled(true);
      } else {
        setScrolled(false);
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  // Close mobile menu when clicking on a link
  const handleNavLinkClick = () => {
    setIsMenuOpen(false);
  };

  return (
    <div className="min-h-screen bg-[#F0EDCF] overflow-x-hidden">
      {/* Mobile Menu Overlay */}
      {isMenuOpen && (
        <div className="fixed inset-0 bg-black/50 z-50 md:hidden" onClick={() => setIsMenuOpen(false)}>
          <div className="bg-white h-screen w-4/5 max-w-sm p-6 pt-20" onClick={(e) => e.stopPropagation()}>
            <button
              className="absolute top-6 right-6 text-[#0B60B0]"
              onClick={() => setIsMenuOpen(false)}
            >
              <X size={24} />
            </button>
            <div className="text-2xl font-bold text-[#0B60B0] flex items-center mb-10">
              <Zap className="mr-2" />
              uply
            </div>
            <nav className="flex flex-col space-y-6">
              <a
                href="#features"
                className="text-[#000000] hover:text-[#0B60B0] transition-colors font-medium text-lg"
                onClick={handleNavLinkClick}
              >
                Features
              </a>
              <a
                href="#how-it-works"
                className="text-[#000000] hover:text-[#0B60B0] transition-colors font-medium text-lg"
                onClick={handleNavLinkClick}
              >
                How It Works
              </a>
              <a
                href="#pricing"
                className="text-[#000000] hover:text-[#0B60B0] transition-colors font-medium text-lg"
                onClick={handleNavLinkClick}
              >
                Pricing
              </a>
              <a
                href="#faq"
                className="text-[#000000] hover:text-[#0B60B0] transition-colors font-medium text-lg"
                onClick={handleNavLinkClick}
              >
                FAQ
              </a>
            </nav>
            <div className="mt-10 flex flex-col space-y-4">
              <Button variant="outline" className="w-full border-[#0B60B0] text-[#0B60B0] hover:bg-[#0B60B0] hover:text-white">
                Log In
              </Button>
              <Button className="w-full bg-[#0B60B0] hover:bg-[#0B60B0]/90">
                Sign Up Free
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* Header/Navbar */}
      <header className={`sticky top-0 z-40 w-full bg-white/80 backdrop-blur-md border-b transition-shadow duration-300 ${scrolled ? 'shadow-md border-[#0B60B0]/5' : 'border-[#0B60B0]/10'}`}>
        <div className="container px-4 sm:px-6 lg:px-8 xl:px-20 mx-auto h-16 flex items-center justify-between">
          <div className="text-xl sm:text-2xl font-bold text-[#0B60B0] flex items-center">
            <Zap className="mr-2" />
            uply
          </div>

          {/* Mobile menu button */}
          <button
            className="md:hidden text-[#0B60B0]"
            onClick={() => setIsMenuOpen(true)}
          >
            <Menu size={24} />
          </button>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex space-x-4 lg:space-x-8">
            <a href="#features" className="text-[#000000] hover:text-[#0B60B0] transition-colors font-medium">Features</a>
            <a href="#how-it-works" className="text-[#000000] hover:text-[#0B60B0] transition-colors font-medium">How It Works</a>
            <a href="#faq" className="text-[#000000] hover:text-[#0B60B0] transition-colors font-medium">FAQ</a>
          </nav>

          {/* Desktop buttons */}
          <div className="hidden md:flex items-center gap-4">
            <Button variant="outline" className="bg-white border-[#0B60B0] text-[#0B60B0] hover:bg-[#0B60B0] hover:text-white">
              <Link to="/auth">Log In</Link>
            </Button>
            <Button className="bg-[#0B60B0] hover:bg-[#0B60B0]/90">
              <Link to="/auth">Sign Up Free</Link>
            </Button>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="container px-4 sm:px-6 lg:px-8 xl:px-20 py-10 sm:py-16 md:py-24 lg:py-32 mx-auto flex flex-col md:flex-row items-center gap-8 md:gap-12 lg:gap-20">
        <div className="md:w-1/2 space-y-4 sm:space-y-6 text-center md:text-left ">
          <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold text-[#000000] leading-tight">
            AI-Powered <span className="text-[#0B60B0]">Career Assistant</span> Platform
          </h1>
          <p className="text-base sm:text-lg lg:text-xl text-[#000000]/80 mt-2 sm:mt-4">
            Streamline your entire job application process with Agentic AI. Personalized, not randomly generated—making job prep faster, smarter, and truly tailored.
          </p>
          <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 mt-6 sm:mt-8 justify-center md:justify-start">
            <Button className="bg-[#0B60B0] hover:bg-[#0B60B0]/90 px-4 sm:px-6 lg:px-8 py-3 sm:py-4 lg:py-6 text-base sm:text-lg w-full sm:w-auto">
              <Link to="/auth">Get Started Free</Link>
            </Button>
            <Button variant="outline" className="border-[#0B60B0] text-[#0B60B0] hover:bg-[#0B60B0] hover:text-white px-4 sm:px-6 lg:px-8 py-3 sm:py-4 lg:py-6 text-base sm:text-lg w-full sm:w-auto">
              See Demo <ArrowRight className="ml-1 sm:ml-2 h-4 w-4" />
            </Button>
          </div>
        </div>
        <div className="md:w-1/2 mt-8 sm:mt-10 md:mt-0 flex justify-center">
          <img
            src={Hero}
            alt="Uply platform demonstration"
            className="rounded-lg w-full max-w-md md:max-w-full object-cover"
          />
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-10 sm:py-16 md:py-20 px-4 sm:px-6 lg:px-8 bg-white">
        <div className="container mx-auto">
          <h2 className="text-2xl sm:text-3xl font-bold text-center mb-8 sm:mb-12 text-[#000000]">
            Powerful <span className="text-[#0B60B0]">Features</span> To Boost Your Career
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8 mt-8 sm:mt-12">
            {[
              {
                icon: <FileText />,
                title: "AI Resume & Cover Letter Builder",
                description: "Chat-driven, profile-based documents tailored for each application to maximize your chances."
              },
              {
                icon: <BookOpen />,
                title: "JD-based Prep Material Generator",
                description: "Custom prep materials based on job descriptions, including DSA and CS fundamentals."
              },
              {
                icon: <MessageSquare />,
                title: "AI Mock Interviews",
                description: "Practice with realistic AI interviews and receive detailed feedback to improve."
              },
              {
                icon: <Zap />,
                title: "Company-wise Leetcode Questions",
                description: "Focus your practice on the exact questions companies are known to ask."
              },
              {
                icon: <Chrome />,
                title: "Chrome Extension",
                description: "Automatically fill job applications across platforms using your Uply profile."
              },
              {
                icon: <CheckCircle />,
                title: "Personalization Engine",
                description: "Everything is tailored to your experience, skills, and target roles, not randomly generated."
              }
            ].map((feature, index) => (
              <Card key={index} className="h-full bg-white border border-[#0B60B0]/10 hover:border-[#0B60B0]/30 hover:shadow-lg transition-all">
                <CardHeader className="pb-2">
                  <div className="bg-[#40A2D8]/10 p-2 sm:p-3 rounded-lg w-10 h-10 sm:w-12 sm:h-12 flex items-center justify-center text-[#0B60B0]">
                    {feature.icon}
                  </div>
                  <CardTitle className="mt-3 sm:mt-4 text-lg sm:text-xl">{feature.title}</CardTitle>
                </CardHeader>
                <CardContent>
                  <CardDescription className="text-sm sm:text-base">{feature.description}</CardDescription>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section id="how-it-works" className="py-10 sm:py-16 md:py-20 px-4 sm:px-6 lg:px-8">
        <div className="container mx-auto">
          <h2 className="text-2xl sm:text-3xl font-bold text-center mb-8 sm:mb-12 text-[#000000]">
            How <span className="text-[#0B60B0]">Uply</span> Works
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-8 sm:gap-10 md:gap-12 mt-8 sm:mt-12">
            {[
              {
                step: "01",
                title: "Create Your Profile",
                description: "Build your comprehensive profile with your education, experience, skills, and career goals."
              },
              {
                step: "02",
                title: "Generate Personalized Content",
                description: "Let AI create tailored resumes, cover letters, and prep materials for specific job listings."
              },
              {
                step: "03",
                title: "Apply & Practice With Confidence",
                description: "Use our tools to submit applications, prepare for interviews, and land your dream job."
              }
            ].map((step, index) => (
              <div key={index} className="text-center space-y-3 sm:space-y-4 p-4 sm:p-6 bg-white/50 rounded-lg border border-[#0B60B0]/5 hover:shadow-md transition-all">
                <div className="text-4xl sm:text-5xl md:text-6xl font-bold text-[#40A2D8]/20">{step.step}</div>
                <h3 className="text-xl sm:text-2xl font-bold text-[#0B60B0]">{step.title}</h3>
                <p className="text-sm sm:text-base text-[#000000]/70">{step.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="bg-white py-10 sm:py-16 px-4 sm:px-6 lg:px-12 xl:px-20">
        <div className="container mx-auto">
          <h2 className="text-2xl sm:text-3xl font-bold text-center mb-8 sm:mb-12 text-[#000000]">
            What <span className="text-[#0B60B0]">Users</span> Say
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8 mt-8 sm:mt-12">
            {[
              {
                quote: "Uply helped me land interviews at 3 FAANG companies by tailoring my resume perfectly for each role.",
                author: "Alex K.",
                role: "Software Engineer"
              },
              {
                quote: "The mock interviews were incredibly realistic. The feedback I received helped me identify and improve my weak points.",
                author: "Sarah M.",
                role: "Product Manager"
              },
              {
                quote: "The Chrome extension saved me countless hours filling out applications. I could apply to 10x more positions in the same time.",
                author: "Michael L.",
                role: "Data Scientist"
              }
            ].map((testimonial, index) => (
              <Card key={index} className="bg-[#F0EDCF]/50 h-full">
                <CardContent className="pt-6 sm:pt-8">
                  <p className="text-base sm:text-lg italic">"{testimonial.quote}"</p>
                  <div className="mt-4 sm:mt-6">
                    <p className="font-bold">{testimonial.author}</p>
                    <p className="text-sm text-[#000000]/70">{testimonial.role}</p>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section id="faq" className="bg-white py-16">
        <div className="container mx-auto ">
          <h2 className="text-3xl font-bold text-center mb-12 text-[#000000]">
            Frequently Asked <span className="text-[#0B60B0]">Questions</span>
          </h2>
          <div className="mt-12 max-w-3xl mx-auto space-y-6">
            {[
              {
                question: "How does Uply personalize content for me?",
                answer: "Uply uses your profile information, including your education, work experience, skills, and career goals to generate highly personalized content. Our AI understands the context of each job description to tailor materials specifically for that opportunity."
              },
              {
                question: "Is my data secure with Uply?",
                answer: "Absolutely. We take data security seriously. Your information is encrypted and never shared with third parties without your explicit consent. We comply with all relevant data protection regulations."
              },
              {
                question: "Can I cancel my subscription anytime?",
                answer: "Yes, you can cancel your Pro subscription at any time. You'll continue to have access until the end of your billing period, after which you'll be downgraded to the Free plan."
              },
              {
                question: "How realistic are the AI mock interviews?",
                answer: "Our AI mock interviews are designed to mimic real interview experiences closely. They adapt to your responses and provide relevant follow-up questions based on your answers, just like a real interviewer would."
              },
              {
                question: "Does the Chrome extension work on all job sites?",
                answer: "Our Chrome extension supports most major job boards and company career pages, including LinkedIn, Indeed, Glassdoor, and many others. We continually add support for more platforms based on user feedback."
              }
            ].map((faq, index) => (
              <Card key={index} className="border border-[#0B60B0]/10">
                <CardHeader>
                  <CardTitle className="text-xl">{faq.question}</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-[#000000]/80">{faq.answer}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="bg-[#0B60B0] text-white py-20">
        <div className="container text-center space-y-8 mx-auto">
          <h2 className="text-3xl md:text-4xl font-bold">Ready to Supercharge Your Job Search?</h2>
          <p className="text-xl max-w-2xl mx-auto">
            Join thousands of professionals who have transformed their career with Uply.
          </p>
          <Button className="bg-white text-[#0B60B0] hover:bg-white/90 px-8 py-6 text-lg">
            Get Started Free
          </Button>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-[#000000] text-white py-8 sm:py-12">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 xl:px-20">
          <div className="text-xl sm:text-2xl font-bold text-white mb-6 sm:mb-8">
            <Zap className="inline-block mr-2" />
            uply
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 md:gap-8">
            <div>
              <h3 className="font-bold text-[#40A2D8] mb-3 sm:mb-4 text-sm sm:text-base">Product</h3>
              <a href="#" className="text-white/80 hover:text-white block mb-2 text-sm sm:text-base">Features</a>
              <a href="#" className="text-white/80 hover:text-white block mb-2 text-sm sm:text-base">Pricing</a>
              <a href="#" className="text-white/80 hover:text-white block mb-2 text-sm sm:text-base">Chrome Extension</a>
              <a href="#" className="text-white/80 hover:text-white block mb-2 text-sm sm:text-base">Integrations</a>
            </div>
            <div>
              <h3 className="font-bold text-[#40A2D8] mb-3 sm:mb-4 text-sm sm:text-base">Resources</h3>
              <a href="#" className="text-white/80 hover:text-white block mb-2 text-sm sm:text-base">Blog</a>
              <a href="#" className="text-white/80 hover:text-white block mb-2 text-sm sm:text-base">Career Tips</a>
              <a href="#" className="text-white/80 hover:text-white block mb-2 text-sm sm:text-base">Interview Guides</a>
              <a href="#" className="text-white/80 hover:text-white block mb-2 text-sm sm:text-base">Leetcode Solutions</a>
            </div>
            <div>
              <h3 className="font-bold text-[#40A2D8] mb-3 sm:mb-4 text-sm sm:text-base">Company</h3>
              <a href="#" className="text-white/80 hover:text-white block mb-2 text-sm sm:text-base">About Us</a>
              <a href="#" className="text-white/80 hover:text-white block mb-2 text-sm sm:text-base">Careers</a>
              <a href="#" className="text-white/80 hover:text-white block mb-2 text-sm sm:text-base">Contact</a>
              <a href="#" className="text-white/80 hover:text-white block mb-2 text-sm sm:text-base">Partners</a>
            </div>
            <div>
              <h3 className="font-bold text-[#40A2D8] mb-3 sm:mb-4 text-sm sm:text-base">Legal</h3>
              <a href="#" className="text-white/80 hover:text-white block mb-2 text-sm sm:text-base">Privacy Policy</a>
              <a href="#" className="text-white/80 hover:text-white block mb-2 text-sm sm:text-base">Terms of Service</a>
              <a href="#" className="text-white/80 hover:text-white block mb-2 text-sm sm:text-base">Cookie Policy</a>
              <a href="#" className="text-white/80 hover:text-white block mb-2 text-sm sm:text-base">GDPR</a>
            </div>
          </div>
          <div className="mt-8 sm:mt-12 pt-6 sm:pt-8 border-t border-white/20 text-center text-white/60 text-sm">
            © {new Date().getFullYear()} Uply. All rights reserved.
          </div>
        </div>
      </footer>
    </div>
  );
};

export default UplyLanding;