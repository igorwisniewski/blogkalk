// components/Navbar.js
"use client";

// ZMIANA: Dodajemy useEffect i aktualizujemy import useState
import { useState, useEffect } from 'react';
import Image from "next/image";
import Link from 'next/link';
import {Bars3Icon, XMarkIcon} from "@heroicons/react/16/solid";

const Logo = () => (
    <div className="flex items-center space-x-2">
        <div className="relative w-10 h-10">
            <Image
                src="/logo.png"
                fill
                alt="Logo"
            />
        </div>
        <span className="font-serif text-lg text-gray-800">Zaręczyny Marzeń</span>
    </div>
);

export default function Navbar() {
    const [isOpen, setIsOpen] = useState(false);

    // ZMIANA: Dodajemy nowe stany do obsługi scrollowania
    const [isNavbarVisible, setIsNavbarVisible] = useState(true);
    const [lastScrollY, setLastScrollY] = useState(0);

    // ZMIANA: Dodajemy useEffect do obsługi logiki scrollowania
    useEffect(() => {
        const handleScroll = () => {
            const currentScrollY = window.scrollY;

            // Pokaż navbar, jeśli jesteśmy blisko góry strony
            if (currentScrollY < 200) {
                setIsNavbarVisible(true);
            } else {
                // Ukryj przy scrollowaniu w dół, pokaż przy scrollowaniu w górę
                setIsNavbarVisible(currentScrollY < lastScrollY);
            }

            setLastScrollY(currentScrollY);
        };

        window.addEventListener('scroll', handleScroll, { passive: true });

        // Czyszczenie event listenera po odmontowaniu komponentu
        return () => window.removeEventListener('scroll', handleScroll);
    }, [lastScrollY]);


    const navLinks = [
        { name: 'O nas', href: '/o-nas' },
        { name: 'Galeria', href: '/galeria' },
        { name: 'Kontakt', href: '/kontakt' },
        { name: 'Konsjerż', href: '/concierge' },
    ];

    return (
        // ZMIANA: Dodajemy klasy do animacji chowania/pokazywania
        <nav className={`bg-white shadow-sm sticky top-0 z-50 transition-transform duration-300 ease-in-out z-10 ${
            isNavbarVisible ? 'translate-y-0' : '-translate-y-full'
        }`}>
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex items-center justify-between h-20">
                    <div className="flex-shrink-0">
                        <Link href="/">
                            <Logo />
                        </Link>
                    </div>

                    <div className="hidden md:flex items-center space-x-8">
                        {navLinks.map((link) => (
                            <Link key={link.name} href={link.href} className="text-gray-600 hover:text-blue-800 transition-colors duration-300">
                                {link.name}
                            </Link>
                        ))}
                        <div className="bg-blue-500 p-0.5 rounded-lg inline-block shadow">
                            <Link href="/kontakt#telefon" className="block bg-white text-gray-800 px-5 py-2 rounded-md hover:bg-blue-500 hover:text-white transition-colors duration-300">
                                Zadzwoń
                            </Link>
                        </div>
                    </div>

                    <div className="md:hidden flex items-center">
                        <button
                            onClick={() => setIsOpen(!isOpen)}
                            type="button"
                            className="inline-flex items-center justify-center p-2 rounded-md text-gray-700 hover:text-gray-900 focus:outline-none"
                            aria-controls="mobile-menu"
                            aria-expanded="false"
                        >
                            <span className="sr-only">Otwórz menu</span>
                            {isOpen ? (
                                <XMarkIcon className="block h-8 w-8" aria-hidden="true" />
                            ) : (
                                <Bars3Icon className="block h-8 w-8" aria-hidden="true"  />
                            )}
                        </button>
                    </div>
                </div>
            </div>

            <div
                className={`md:hidden overflow-hidden transition-all duration-300 ease-in-out bg-white ${
                    isOpen ? 'max-h-96 opacity-100' : 'max-h-0 opacity-0'
                }`}
                id="mobile-menu"
            >
                <div className="px-2 pt-2 pb-4 space-y-1 sm:px-3 border-t">
                    {navLinks.map((link) => (
                        <Link key={link.name} href={link.href} className="text-gray-700 hover:bg-gray-100 block px-3 py-3 rounded-md text-base font-medium">
                            {link.name}
                        </Link>
                    ))}
                    <div className="px-3 pt-4">
                        <div className="bg-blue-500 p-0.5 rounded-lg shadow text-center">
                            <Link href="/kontakt#telefon" className="block bg-white text-gray-800 px-5 py-3 rounded-md hover:bg-blue-500 hover:text-white transition-colors duration-300">
                                Zadzwoń
                            </Link>
                        </div>
                    </div>
                </div>
            </div>
        </nav>
    );
}