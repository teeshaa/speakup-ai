'use client'

import React from 'react';
import Image from 'next/image';
import { Twitter, Linkedin, BookOpen, ArrowLeft } from 'lucide-react';
import Link from 'next/link';
import { motion } from 'framer-motion';

const developers = [
    {
        name: "Janki Gabani",
        image: "/about-janki.jpg",
        linkedin: "https://www.linkedin.com/in/janki-gabani/",
        twitter: "https://x.com/jankigabani_",
        hashnode: "https://jankigabani.co/",
    },
    {
        name: "Teesha Ghevariya",
        image: "/about-teesha.jpg",
        linkedin: "https://www.linkedin.com/in/teesha-ghevariya/",
        twitter: "https://x.com/iamteeshaa",
        hashnode: "https://shecode.hashnode.dev/",
    },

];

export default function AboutPage() {
    return (
        <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white">
            <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5 }}
                    className="text-center"
                >
                    <h1 className="text-4xl font-bold text-blue-600 sm:text-5xl md:text-6xl">
                        About SpeakUp-AI
                    </h1>
                    <p className="mt-3 max-w-md mx-auto text-xl text-gray-600 sm:text-2xl md:mt-5 md:max-w-3xl">
                        Empowering students to master speaking skills through AI-powered practice
                    </p>
                </motion.div>

                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: 0.2 }}
                    className="mt-16 bg-white shadow-xl rounded-lg p-8"
                >
                    <h2 className="text-3xl font-bold text-blue-600">Our Story</h2>
                    <p className="mt-4 text-lg text-gray-600">
                        SpeakUp-AI was born out of a passion for education and technology. We created this project as part of the virtual hackathon Hack This Fall 2024, with the goal of revolutionizing how students prepare for international speaking exams.
                    </p>
                    <p className="mt-4 text-lg text-gray-600">
                        Our AI-powered platform provides personalized feedback and real-time practice opportunities, helping students build confidence and improve their speaking skills efficiently.
                    </p>
                </motion.div>

                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: 0.4 }}
                    className="mt-16"
                >
                    <h2 className="text-3xl font-bold text-blue-600 text-center mb-8">Meet the Team</h2>
                    <div className="grid grid-cols-1 gap-8 sm:grid-cols-2">
                        {developers.map((dev, index) => (
                            <motion.div
                                key={dev.name}
                                className="bg-white overflow-hidden shadow-lg rounded-lg hover:shadow-xl transition-shadow duration-300"
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ duration: 0.5, delay: 0.6 + index * 0.2 }}
                            >
                                <div className="px-4 py-5 sm:p-6">
                                    <div className="relative w-48 h-48 mx-auto rounded-full overflow-hidden">
                                        <Image
                                            src={dev.image}
                                            alt={dev.name}
                                            width={192}
                                            height={192}
                                            className="rounded-full object-cover"
                                        />
                                    </div>
                                    <h3 className="mt-4 text-xl font-semibold text-blue-600 text-center">{dev.name}</h3>
                                    <div className="mt-4 flex justify-center space-x-4">
                                        <a href={dev.linkedin} target="_blank" rel="noopener noreferrer" className="text-gray-400 hover:text-blue-600 transition-colors duration-300">
                                            <span className="sr-only">LinkedIn</span>
                                            <Linkedin className="h-6 w-6" />
                                        </a>
                                        <a href={dev.twitter} target="_blank" rel="noopener noreferrer" className="text-gray-400 hover:text-blue-600 transition-colors duration-300">
                                            <span className="sr-only">Twitter</span>
                                            <Twitter className="h-6 w-6" />
                                        </a>
                                        <a href={dev.hashnode} target="_blank" rel="noopener noreferrer" className="text-gray-400 hover:text-blue-600 transition-colors duration-300">
                                            <span className="sr-only">Hashnode</span>
                                            <BookOpen className="h-6 w-6" />
                                        </a>
                                    </div>
                                </div>
                            </motion.div>
                        ))}
                    </div>
                </motion.div>

                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: 0.8 }}
                    className="mt-16 text-center"
                >
                    <p className="text-xl text-blue-600 font-semibold">
                        Made with ❤️ by Teesha and Janki
                    </p>
                </motion.div>

                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: 1 }}
                    className="mt-8 text-center"
                >
                    <Link href="/" className="inline-flex items-center text-blue-600 hover:text-blue-800 font-medium transition-colors duration-300">
                        <ArrowLeft className="mr-2 h-4 w-4" />
                        Back to Home
                    </Link>
                </motion.div>
            </div>
        </div>
    );
}