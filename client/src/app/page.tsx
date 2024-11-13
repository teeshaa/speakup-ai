'use client';

import React from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { LogIn, BookOpen, Sparkles, Globe, Brain, Award, Twitter, Linkedin, Mail } from 'lucide-react';

interface WaveCircleProps {
  children: React.ReactNode;
  gradientFrom: string;
  gradientTo: string;
}

const WaveCircle: React.FC<WaveCircleProps> = ({ children, gradientFrom, gradientTo }) => {
  return (
    <div className="relative">
      <div className={`absolute inset-0 rounded-full bg-gradient-to-r from-${gradientFrom} to-${gradientTo} opacity-25 animate-wave1`}></div>
      <div className={`absolute inset-0 rounded-full bg-gradient-to-r from-${gradientFrom} to-${gradientTo} opacity-25 animate-wave2`}></div>
      <div className={`w-10 h-10 bg-gradient-to-r from-${gradientFrom} to-${gradientTo} rounded-full flex items-center justify-center text-white shadow-lg relative z-10`}>
        {children}
      </div>
    </div>
  );
};

const LandingPage = () => {
  const router = useRouter();

  const features = [
    {
      icon: <Sparkles className="h-6 w-6 text-blue-600" />,
      title: "AI-Powered Feedback",
      description: "Get instant, detailed feedback on your speaking performance"
    },
    {
      icon: <Globe className="h-6 w-6 text-blue-600" />,
      title: "Real-world Scenarios",
      description: "Practice with authentic speaking topics for various exams"
    },
    {
      icon: <Brain className="h-6 w-6 text-blue-600" />,
      title: "Smart Learning",
      description: "Personalized learning path based on your progress"
    }
  ];

  const testimonials = [
    {
      name: "Isha Zadafiya",
      role: "Speaking Score: 8.5",
      
      feedback: "SpeakUp-AI transformed my speaking preparation. The instant feedback helped me identify and correct my speaking patterns. I achieved my target score in just 2 months!",
    },
    {
      name: "Janki Gabani",
      role: "Speaking Score: 8.0",
      feedback: "The real-time AI feedback is incredibly accurate. It's like having a personal tutor available 24/7. The structured approach to practice made all the difference.",
    },
    {
      name: "Teesha Ghevariya",
      role: "Speaking Score: 7.5",
      feedback: "What I love most is how the platform adapts to my learning pace. The practice scenarios are very relevant, and the feedback is always constructive and actionable.",
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-b from-white to-blue-50">
      {/* Navigation Bar */}
      <nav className="px-8 py-4 bg-white/80 backdrop-blur-md fixed w-full z-50 border-b border-gray-100">
        <div className="max-w-7xl mx-auto flex justify-between items-center">
          <div className="flex items-center space-x-2 hover:scale-105 transition-transform">
            <BookOpen className="h-6 w-6 text-blue-600" />
            <span className="text-xl font-bold bg-gradient-to-r from-blue-600 to-blue-800 bg-clip-text text-transparent">
              SpeakUp-AI
            </span>
          </div>
          <div className="flex items-center space-x-8">
            <a href="#features" className="text-gray-600 hover:text-blue-600 transition-colors">Features</a>
            <a href="#testimonials" className="text-gray-600 hover:text-blue-600 transition-colors">Testimonials</a>
            <button
              onClick={() => router.push('/login')}
              className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 flex items-center space-x-2 shadow-lg hover:shadow-xl transition-all"
            >
              <LogIn className="h-4 w-4" />
              <span>Login</span>
            </button>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <main className="pt-32 pb-24">
        <div className="max-w-7xl mx-auto px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div className="space-y-8">
              <div className="inline-flex items-center space-x-2 px-4 py-2 bg-blue-100 rounded-full">
                <Award className="h-4 w-4 text-blue-600" />
                <span className="text-blue-600 font-medium">Empowering students worldwide</span>
              </div>
              <h1 className="text-5xl lg:text-6xl font-bold leading-tight">
                <span className="bg-gradient-to-r from-blue-600 to-blue-800 bg-clip-text text-transparent">
                  Master Speaking Skills
                </span>
                <br />
                <span className="text-4xl lg:text-5xl text-gray-700 font-light">with AI Assistant</span>
              </h1>
              <p className="text-xl text-gray-600 leading-relaxed">
                Practice speaking naturally with our AI tutor. Get instant feedback, 
                improve pronunciation, and boost your confidence for international exams.
              </p>
              <div className="flex items-center space-x-4">
                <button
                  onClick={() => router.push('/dashboard')}
                  className="bg-blue-600 text-white px-8 py-4 rounded-lg text-lg font-semibold hover:bg-blue-700 transform hover:scale-105 transition-all shadow-lg hover:shadow-xl"
                >
                  Start Free Trial
                </button>
                <button
                  onClick={() => router.push('/demo')}
                  className="px-8 py-4 rounded-lg text-lg font-semibold text-blue-600 hover:bg-blue-50 transition-colors border-2 border-blue-600"
                >
                  Watch Demo
                </button>
              </div>
            </div>
            
            <div className="relative">
              <div className="absolute -inset-4 rounded-xl bg-gradient-to-r from-blue-100 to-blue-200 transform rotate-6 opacity-70 animate-pulse"></div>
              <div className="relative bg-white p-8 rounded-xl shadow-xl">
                <div className="space-y-6">
                  <div className="flex items-center space-x-3">
                    <WaveCircle gradientFrom="blue-600" gradientTo="blue-700">
                      AI
                    </WaveCircle>
                    <div className="bg-gray-100 rounded-lg p-4 flex-1 transform hover:scale-102 transition-transform">
                      <p className="text-gray-800">Let's practice Part 2 of the speaking test. Describe a place you visited that impressed you.</p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-3 justify-end">
                    <div className="bg-blue-50 rounded-lg p-4 flex-1 transform hover:scale-102 transition-transform">
                      <p className="text-gray-800">I'd like to talk about my visit to Kyoto, Japan...</p>
                    </div>
                    <WaveCircle gradientFrom="blue-600" gradientTo="blue-300">
                      You
                    </WaveCircle>
                  </div>
                  <div className="bg-green-50 rounded-lg p-4 border border-green-200">
                    <p className="text-green-800 text-sm">
                      💡 Feedback: Good start! Try adding more specific details about the architecture 
                      and cultural significance of Kyoto.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Features Section */}
        <div id="features" className="max-w-7xl mx-auto px-8 py-24">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold mb-4">Why Choose SpeakUp-AI?</h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              Our platform combines cutting-edge AI technology with proven preparation methods for various international speaking exams
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {features.map((feature, index) => (
              <div key={index} className="bg-white p-6 rounded-xl shadow-lg hover:shadow-xl transition-shadow">
                <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mb-4">
                  {feature.icon}
                </div>
                <h3 className="text-xl font-semibold mb-2">{feature.title}</h3>
                <p className="text-gray-600">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Testimonials Section */}
        <section id="testimonials" className="max-w-7xl mx-auto px-8 py-24">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold mb-4">Success Stories</h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              Join thousands of successful students who have improved their speaking scores
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {testimonials.map((testimonial, index) => (
              <div key={index} className="bg-white p-8 rounded-xl shadow-lg hover:shadow-xl transition-all">
                <div className="mb-6">
                  <div className="text-center">
                    <h3 className="text-lg font-semibold">{testimonial.name}</h3>
                    <p className="text-blue-600">{testimonial.role}</p>
                  </div>
                </div>
                <p className="text-gray-600 text-center">{testimonial.feedback}</p>
              </div>
            ))}
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="bg-white border-t border-gray-100">
        <div className="max-w-7xl mx-auto px-8 py-12">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div className="space-y-4">
              <div className="flex items-center space-x-2">
                <BookOpen className="h-6 w-6 text-blue-600" />
                <span className="text-xl font-bold bg-gradient-to-r from-blue-600 to-blue-800 bg-clip-text text-transparent">
                  SpeakUp-AI
                </span>
              </div>
              <p className="text-gray-600">
                Empowering students to achieve their speaking goals through AI-powered practice.
              </p>
            </div>
            
            <div>
              <h4 className="font-semibold mb-4">Product</h4>
              <ul className="space-y-2">
                <li><a href="#features" className="text-gray-600 hover:text-blue-600">Features</a></li>
                <li><a href="#testimonials" className="text-gray-600 hover:text-blue-600">Testimonials</a></li>
                <li><Link href="/practice-questions" className="text-gray-600 hover:text-blue-600">Practice Test</Link></li>
                <li><Link href="/speaking-test" className="text-gray-600 hover:text-blue-600">Speaking Test</Link></li>
              </ul>
            </div>
            
            <div>
              <h4 className="font-semibold mb-4">Company</h4>
              <ul className="space-y-2">
                <li><Link href="/about" className="text-gray-600 hover:text-blue-600">About Us</Link></li>
                <li><a href="/blog" className="text-gray-600 hover:text-blue-600">Blog</a></li>
                <li><a href="/contact" className="text-gray-600 hover:text-blue-600">Contact</a></li>
              </ul>
            </div>
            
            <div>
              <h4 className="font-semibold mb-4">Connect</h4>
              <div className="flex space-x-4">
                <a href="#" className="text-gray-600 hover:text-blue-600">
                  <Twitter className="h-6 w-6" />
                </a>
                <a href="#" className="text-gray-600 hover:text-blue-600">
                  <Linkedin className="h-6 w-6" />
                </a>
                <a href="#" className="text-gray-600 hover:text-blue-600">
                  <Mail className="h-6 w-6" />
                </a>
              </div>
            </div>
          </div>
          
          <div className="border-t border-gray-100 mt-12 pt-8 flex flex-col md:flex-row justify-between items-center">
            <p className="text-gray-600 text-sm">
              © 2024 SpeakUp-AI. All rights reserved.
            </p>
            <div className="flex space-x-6 mt-4 md:mt-0">
              <a href="/privacy" className="text-gray-600 hover:text-blue-600 text-sm">Privacy Policy</a>
              <a href="/terms" className="text-gray-600 hover:text-blue-600 text-sm">Terms of Service</a>
            </div>
          </div>
        </div>
      </footer>

      <style jsx global>{`
        @keyframes wave1 {
          0% {
            transform: scale(1);
            opacity: 0.25;
          }
          100% {
            transform: scale(1.5);
            opacity: 0;
          }
        }

        @keyframes wave2 {
          0% {
            transform: scale(1);
            opacity: 0.25;
          }
          100% {
            transform: scale(2);
            opacity: 0;
          }
        }

        .animate-wave1 {
          animation: wave1 2s infinite;
        }

        .animate-wave2 {
          animation: wave2 2s infinite;
          animation-delay: 1s;
        }

        :root {
          scroll-behavior: smooth;
        }

        /* Add smooth hover transitions */
        a, button {
          transition: all 0.3s ease;
        }

        /* Ensure images don't overflow */
        img {
          max-width: 100%;
          height: auto;
        }

        /* Add responsive padding adjustments */
        @media (max-width: 768px) {
          .px-8 {
            padding-left: 1rem;
            padding-right: 1rem;
          }

          .py-24 {
            padding-top: 4rem;
            padding-bottom: 4rem;
          }
        }
      `}</style>
    </div>
  );
};

export default LandingPage;