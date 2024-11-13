'use client'

import React, { useState, useEffect } from 'react'
import { usePathname } from 'next/navigation'
import { BookOpen, MessageSquare, Home, Settings } from 'lucide-react'
import Link from 'next/link'
import Image from 'next/image'

export default function Dashboard({ children }: { children: React.ReactNode }) {
  const pathname = usePathname()
  const isHomePage = pathname === '/' || pathname === '/dashboard'
  const [text, setText] = useState('')
  const fullText = "Welcome to SpeakUp-AI! I'm here to help you improve your speaking skills. Click on 'Practice Questions' to start your learning journey!"
  
  useEffect(() => {
    if (isHomePage) {
      setText('');
      let index = 0;
      const timer = setInterval(() => {
        setText(fullText.slice(0, index));
        index++;
        if (index > fullText.length) {
          clearInterval(timer);
        }
      }, 50);

      return () => clearInterval(timer);
    }
  }, [isHomePage]);

  return (
    <div className="min-h-screen bg-gray-50 flex">
      {/* Sticky Sidebar */}
      <div className="w-64 bg-white shadow-lg h-screen fixed left-0 top-0 overflow-y-auto">
        <div className="p-6">
          <div className="flex items-center space-x-2 mb-8">
            <BookOpen className="h-6 w-6 text-blue-600" />
            <span className="text-xl font-bold text-blue-600">SpeakUp-AI</span>
          </div>
          <nav className="space-y-4">
            <Link href="/practice-questions" className="flex items-center space-x-3 px-4 py-3 text-gray-600 hover:bg-gray-50 rounded-lg">
              <BookOpen className="h-5 w-5" />
              <span className="font-medium">Practice Questions</span>
            </Link>
            <Link href="/speaking-test" className="flex items-center space-x-3 px-4 py-3 text-gray-600 hover:bg-gray-50 rounded-lg">
              <MessageSquare className="h-5 w-5" />
              <span className="font-medium">Speaking Test</span>
            </Link>
            <Link href="/" className="flex items-center space-x-3 px-4 py-3 text-gray-600 hover:bg-gray-50 rounded-lg">
              <Home className="h-5 w-5" />
              <span className="font-medium">Home</span>
            </Link>
            <Link href="/settings" className="flex items-center space-x-3 px-4 py-3 text-gray-600 hover:bg-gray-50 rounded-lg">
              <Settings className="h-5 w-5" />
              <span className="font-medium">Settings</span>
            </Link>
          </nav>
        </div>
      </div>

      {/* Main Content */}
      <div className="ml-64 flex-1 relative min-h-screen">
        {children}
        
        {/* Speech Bubble and Character - Only shown on homepage */}
        {isHomePage && (
          <>
            {/* Speech Bubble */}
            <div className="absolute bottom-96 right-32 z-5 max-w-md transform -translate-y-20">
              <div className="bg-white p-6 rounded-xl shadow-lg relative">
                <div className="text-gray-800 font-medium text-lg">
                  {text}
                  <span className="animate-pulse">|</span>
                </div>
                {/* Speech bubble triangle */}
                <div className="absolute -bottom-2 right-20 w-8 h-8 bg-white transform rotate-45"></div>
              </div>
            </div>
            
            {/* Character Image */}
            <div className="absolute bottom-4 right-4 z-20">
              <Image 
                src="/char.png"
                alt="Character"
                width={500}
                height={500}
                className="object-contain"
                priority
              />
            </div>
          </>
        )}
      </div>
    </div>
  )
}