import Link from "next/link";

export default function Footer() {
    return (
        <footer className="bg-neutral-900 text-white py-10  z-10">
            <div className="max-w-7xl mx-auto px-4 grid grid-cols-1 md:grid-cols-3 gap-8">
                <div>
                    <h3 className="font-bold text-lg mb-2">DługoMat</h3>
                    <p className="text-sm">Twój dług, nasz plan</p>
                </div>

                <div>
                    <h4 className="font-semibold mb-2">Linki</h4>
                    <ul className="space-y-1 text-sm">
                        <li><Link href="/" className="hover:underline">Strona główna</Link></li>
                        <li><Link href="/blog" className="hover:underline">Blog</Link></li>
                        <li><Link href="/kontakt" className="hover:underline">Kontakt</Link></li>
                        <li><Link href="/polityka-prywatnosci" className="hover:underline">Polityka Prywatności</Link>
                        </li>

                    </ul>
                </div>

                <div>
                    <h4 className="font-semibold mb-2">Kontakt</h4>
                    <p className="text-sm">tel: +48 796 464 273<br />email: kontakt@twojeoddluzanie.pl</p>
                </div>
            </div>
            <div className="text-center mt-8 text-xs text-gray-400">&copy; 2025 DługoMat. Wszelkie prawa zastrzeżone. Stworzone przez <Link href={"https://wisstack.pl/"}>WISSTACK</Link></div>
        </footer>
    )
}