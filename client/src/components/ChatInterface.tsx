"use client";

import React from 'react';

const ChatInterface = () => {
  return (
    <div className="relative mt-6">
      <div className="absolute -inset-4 rounded-xl bg-blue-100 transform rotate-6"></div>
      <div className="relative bg-white p-6 rounded-xl shadow-lg">
        <div className="space-y-4">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-blue-600 rounded-full flex items-center justify-center text-white">
              AI
            </div>
            <div className="bg-blue-50 rounded-lg p-3 flex-1">
              <p>Hello! Ready to practice your English speaking skills?</p>
            </div>
          </div>
          <div className="flex items-center space-x-3 justify-end">
            <div className="bg-blue-50 rounded-lg p-3 flex-1">
              <p>Yes, I'd love to improve my speaking!</p>
            </div>
            <div className="w-10 h-10 bg-gray-600 rounded-full flex items-center justify-center text-white">
              You
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ChatInterface;
