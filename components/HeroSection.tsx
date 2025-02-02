'use client';
import { useState, useEffect } from 'react';
import Image from 'next/image';

const images = [
    '/Image1.png',
    '/Image2.png',
    '/Image3.png'
];

const HeroSection = () => {
    const [currentImage, setCurrentImage] = useState(0);

    useEffect(() => {
        const interval = setInterval(() => {
            setCurrentImage((prev) => (prev + 1) % images.length);
        }, 5000);

        return () => clearInterval(interval);
    }, []);

    return (
        <section className="flex min-h-[600px] bg-gray-50">
            {/* Left Side - Static Image and Button */}
            <div className="flex-1 relative flex items-end justify-center p-12">
                <Image
                    src="/Image4.png"
                    alt="Hero left image"
                    fill
                    className="object-cover"
                    priority
                />
                {/* Button positioned at bottom */}
                <button className="absolute bottom-12 px-8 py-3 rounded-full border-2 border-black text-black hover:bg-black hover:text-white transition-colors bg-white/80 backdrop-blur-sm">
                    Learn More
                </button>
            </div>

            {/* Right Side - Image Slider */}
            <div className="flex-1 relative">
                {images.map((img, index) => (
                    <div
                        key={img}
                        className={`absolute inset-0 transition-opacity duration-1000 ${
                            index === currentImage ? 'opacity-100' : 'opacity-0'
                        }`}
                    >
                        <Image
                            src={img}
                            alt={`Hero image ${index + 1}`}
                            fill
                            className="object-cover"
                            priority={index === 0}
                        />
                    </div>
                ))}
            </div>
        </section>
    );
};

export default HeroSection; 