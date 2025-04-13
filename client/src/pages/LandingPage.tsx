// import React from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { ArrowRight, CheckCircle, FileText, Zap, BookOpen, MessageSquare, Chrome } from "lucide-react";
import Hero from "@/assets/hero.svg";

// Custom CSS for the app
const styles = {
  container: "min-h-screen bg-[#F0EDCF]",
  header: "sticky top-0 z-40 w-full bg-white/80 backdrop-blur-md border-b border-[#0B60B0]/10",
  navContainer: "container px-20 h-16 flex items-center justify-between",
  logo: "text-2xl font-bold text-[#0B60B0] flex items-center",
  navLinks: "hidden md:flex space-x-8",
  navLink: "text-[#000000] hover:text-[#0B60B0] transition-colors font-medium",
  heroSection: "container p-20 md:py-32 flex flex-col md:flex-row items-center gap-20",
  heroContent: "md:w-1/2 space-y-6 text-center md:text-left",
  heroTitle: "text-4xl md:text-6xl font-bold text-[#000000]",
  heroHighlight: "text-[#0B60B0]",
  heroDescription: "text-xl text-[#000000]/80 mt-4",
  heroButtons: "flex flex-col sm:flex-row gap-4 mt-8 justify-center md:justify-start",
  heroImage: "md:w-1/2 mt-12 md:mt-0 flex justify-center",
  featuresSection: "p-20 bg-white",
  featureCard: "h-full bg-white border border-[#0B60B0]/10 hover:border-[#0B60B0]/30 hover:shadow-lg transition-all",
  featureIcon: "bg-[#40A2D8]/10 p-3 rounded-lg w-12 h-12 flex items-center justify-center text-[#0B60B0]",
  sections: "p-16 container",
  sectionTitle: "text-3xl font-bold text-center mb-12 text-[#000000]",
  highlight: "text-[#0B60B0]",
  ctaSection: "bg-[#0B60B0] text-white py-20",
  ctaContainer: "container text-center space-y-8",
  ctaTitle: "text-3xl md:text-4xl font-bold",
  ctaDescription: "text-xl max-w-2xl mx-auto",
  footer: "bg-[#000000] text-white py-12",
  footerContainer: "container px-20",
  footerLogo: "text-2xl font-bold text-white mb-8",
  footerLinks: "grid grid-cols-2 md:grid-cols-4 gap-8",
  footerLinkTitle: "font-bold text-[#40A2D8] mb-4",
  footerLink: "text-white/80 hover:text-white block mb-2"
};

const UplyLanding = () => {
  return (
    <div className={styles.container}>
      {/* Header/Navbar */}
      <header className={styles.header}>
        <div className={styles.navContainer}>
          <div className={styles.logo}>
            <Zap className="mr-2" />
            uply
          </div>
          <nav className={styles.navLinks}>
            <a href="#features" className={styles.navLink}>Features</a>
            <a href="#how-it-works" className={styles.navLink}>How It Works</a>
            <a href="#pricing" className={styles.navLink}>Pricing</a>
            <a href="#faq" className={styles.navLink}>FAQ</a>
          </nav>
          <div className="flex items-center gap-4">
            <Button variant="outline" className="hidden md:flex border-[#0B60B0] text-[#0B60B0] hover:bg-[#0B60B0] hover:text-white">
              Log In
            </Button>
            <Button className="bg-[#0B60B0] hover:bg-[#0B60B0]/90">
              Sign Up Free
            </Button>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className={styles.heroSection}>
        <div className={styles.heroContent}>
          <h1 className={styles.heroTitle}>
            AI-Powered <span className={styles.heroHighlight}>Career Assistant</span> Platform
          </h1>
          <p className={styles.heroDescription}>
            Streamline your entire job application process with Agentic AI. Personalized, not randomly generated—making job prep faster, smarter, and truly tailored.
          </p>
          <div className={styles.heroButtons}>
            <Button className="bg-[#0B60B0] hover:bg-[#0B60B0]/90 px-8 py-6 text-lg">
              Get Started Free
            </Button>
            <Button variant="outline" className="border-[#0B60B0] text-[#0B60B0] hover:bg-[#0B60B0] hover:text-white px-8 py-6 text-lg">
              See Demo <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          </div>
        </div>
        <div className={styles.heroImage}>
          <img 
            src={Hero} 
            alt="Uply platform demonstration" 
            className="rounded-lg"
          />
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className={styles.featuresSection}>
        <div className="container">
          <h2 className={styles.sectionTitle}>
            Powerful <span className={styles.highlight}>Features</span> To Boost Your Career
          </h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 mt-12">
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
              <Card key={index} className={styles.featureCard}>
                <CardHeader>
                  <div className={styles.featureIcon}>
                    {feature.icon}
                  </div>
                  <CardTitle className="mt-4">{feature.title}</CardTitle>
                </CardHeader>
                <CardContent>
                  <CardDescription className="text-base">{feature.description}</CardDescription>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section id="how-it-works" className={styles.sections}>
        <div className="container">
          <h2 className={styles.sectionTitle}>
            How <span className={styles.highlight}>Uply</span> Works
          </h2>
          <div className="grid md:grid-cols-3 gap-12 mt-12">
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
              <div key={index} className="text-center space-y-4">
                <div className="text-6xl font-bold text-[#40A2D8]/20">{step.step}</div>
                <h3 className="text-2xl font-bold text-[#0B60B0]">{step.title}</h3>
                <p className="text-[#000000]/70">{step.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="bg-white py-16 px-20">
        <div className="container">
          <h2 className={styles.sectionTitle}>
            What <span className={styles.highlight}>Users</span> Say
          </h2>
          <div className="grid md:grid-cols-3 gap-8 mt-12">
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
              <Card key={index} className="bg-[#F0EDCF]/50">
                <CardContent className="pt-8">
                  <p className="text-lg italic">"{testimonial.quote}"</p>
                  <div className="mt-6">
                    <p className="font-bold">{testimonial.author}</p>
                    <p className="text-sm text-[#000000]/70">{testimonial.role}</p>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Pricing Section */}
      <section id="pricing" className={styles.sections}>
        <div className="container">
          <h2 className={styles.sectionTitle}>
            Simple <span className={styles.highlight}>Pricing</span> Plans
          </h2>
          <div className="flex flex-col md:flex-row justify-center gap-8 mt-12">
            {[
              {
                name: "Free",
                price: "$0",
                period: "forever",
                description: "Basic tools to get started",
                features: [
                  "Basic Resume Builder",
                  "5 AI Cover Letters per month",
                  "Limited Mock Interviews",
                  "Basic Chrome Extension"
                ],
                buttonText: "Get Started",
                popular: false
              },
              {
                name: "Pro",
                price: "$19",
                period: "per month",
                description: "Everything you need for job hunting",
                features: [
                  "Advanced Resume Builder",
                  "Unlimited Cover Letters",
                  "Unlimited Mock Interviews with Feedback",
                  "Company-specific Leetcode Questions",
                  "Advanced Chrome Extension",
                  "Priority Support"
                ],
                buttonText: "Go Pro",
                popular: true
              },
              {
                name: "Team",
                price: "$99",
                period: "per month",
                description: "For teams and organizations",
                features: [
                  "All Pro Features",
                  "Up to 10 Team Members",
                  "Team Analytics Dashboard",
                  "Customized Training Materials",
                  "Dedicated Account Manager"
                ],
                buttonText: "Contact Sales",
                popular: false
              }
            ].map((plan, index) => (
              <Card key={index} className={`w-full md:w-80 ${plan.popular ? 'border-[#0B60B0] shadow-lg scale-105' : 'border-[#0B60B0]/20'}`}>
                {plan.popular && (
                  <div className="bg-[#0B60B0] text-white text-center py-1 text-sm font-medium">
                    MOST POPULAR
                  </div>
                )}
                <CardHeader>
                  <CardTitle className="text-2xl">{plan.name}</CardTitle>
                  <div className="mt-4 flex items-baseline">
                    <span className="text-4xl font-bold">{plan.price}</span>
                    <span className="ml-2 text-[#000000]/70">/{plan.period}</span>
                  </div>
                  <CardDescription className="mt-4">{plan.description}</CardDescription>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-3">
                    {plan.features.map((feature, i) => (
                      <li key={i} className="flex items-center">
                        <CheckCircle className="h-5 w-5 text-[#0B60B0] mr-2" />
                        <span>{feature}</span>
                      </li>
                    ))}
                  </ul>
                </CardContent>
                <CardFooter>
                  <Button className={`w-full ${plan.popular ? 'bg-[#0B60B0]' : 'bg-[#40A2D8]'} hover:bg-opacity-90`}>
                    {plan.buttonText}
                  </Button>
                </CardFooter>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section id="faq" className="bg-white py-16">
        <div className="container">
          <h2 className={styles.sectionTitle}>
            Frequently Asked <span className={styles.highlight}>Questions</span>
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
      <section className={styles.ctaSection}>
        <div className={styles.ctaContainer}>
          <h2 className={styles.ctaTitle}>Ready to Supercharge Your Job Search?</h2>
          <p className={styles.ctaDescription}>
            Join thousands of professionals who have transformed their career with Uply.
          </p>
          <Button className="bg-white text-[#0B60B0] hover:bg-white/90 px-8 py-6 text-lg">
            Get Started Free
          </Button>
        </div>
      </section>

      {/* Footer */}
      <footer className={styles.footer}>
        <div className={styles.footerContainer}>
          <div className={styles.footerLogo}>
            <Zap className="inline-block mr-2" />
            uply
          </div>
          <div className={styles.footerLinks}>
            <div>
              <h3 className={styles.footerLinkTitle}>Product</h3>
              <a href="#" className={styles.footerLink}>Features</a>
              <a href="#" className={styles.footerLink}>Pricing</a>
              <a href="#" className={styles.footerLink}>Chrome Extension</a>
              <a href="#" className={styles.footerLink}>Integrations</a>
            </div>
            <div>
              <h3 className={styles.footerLinkTitle}>Resources</h3>
              <a href="#" className={styles.footerLink}>Blog</a>
              <a href="#" className={styles.footerLink}>Career Tips</a>
              <a href="#" className={styles.footerLink}>Interview Guides</a>
              <a href="#" className={styles.footerLink}>Leetcode Solutions</a>
            </div>
            <div>
              <h3 className={styles.footerLinkTitle}>Company</h3>
              <a href="#" className={styles.footerLink}>About Us</a>
              <a href="#" className={styles.footerLink}>Careers</a>
              <a href="#" className={styles.footerLink}>Contact</a>
              <a href="#" className={styles.footerLink}>Partners</a>
            </div>
            <div>
              <h3 className={styles.footerLinkTitle}>Legal</h3>
              <a href="#" className={styles.footerLink}>Privacy Policy</a>
              <a href="#" className={styles.footerLink}>Terms of Service</a>
              <a href="#" className={styles.footerLink}>Cookie Policy</a>
              <a href="#" className={styles.footerLink}>GDPR</a>
            </div>
          </div>
          <div className="mt-12 pt-8 border-t border-white/20 text-center text-white/60">
            © {new Date().getFullYear()} Uply. All rights reserved.
          </div>
        </div>
      </footer>
    </div>
  );
};

export default UplyLanding;