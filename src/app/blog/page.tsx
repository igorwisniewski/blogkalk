// app/blog/page.tsx

import fs from 'fs';
import path from 'path';
import matter from 'gray-matter';
import Link from 'next/link';

// Typ, który pomoże nam w zarządzaniu danymi posta
type Post = {
    slug: string;
    title: string;
    date: string;
    description: string;
};

// Funkcja, która pobierze i przetworzy wszystkie posty z folderu /posts
async function getAllPosts(): Promise<Post[]> {
    const postsDirectory = path.join(process.cwd(), 'posts');

    // Sprawdzamy, czy folder istnieje, aby uniknąć błędów
    if (!fs.existsSync(postsDirectory)) {
        return [];
    }

    const fileNames = fs.readdirSync(postsDirectory);

    const allPostsData = fileNames.map((fileName): Post => {
        // Usuwamy ".md" z nazwy pliku, aby uzyskać slug
        const slug = fileName.replace(/\.md$/, '');

        // Czytamy zawartość pliku markdown jako string
        const fullPath = path.join(postsDirectory, fileName);
        const fileContents = fs.readFileSync(fullPath, 'utf8');

        // Używamy gray-matter do sparsowania metadanych (frontmatter)
        const matterResult = matter(fileContents);

        return {
            slug,
            title: matterResult.data.title || 'Brak tytułu',
            date: matterResult.data.date || 'Brak daty',
            description: matterResult.data.description || 'Brak opisu',
        };
    });

    // Sortujemy posty po dacie, od najnowszego do najstarszego
    return allPostsData.sort((a, b) => {
        if (a.date < b.date) {
            return 1;
        } else {
            return -1;
        }
    });
}

// Główny komponent strony, który wyświetli listę postów
export default async function BlogIndexPage() {
    const posts = await getAllPosts();

    return (
        <div style={{ maxWidth: '800px', margin: '0 auto', padding: '2rem' }}>
            <h1 style={{ textAlign: 'center', marginBottom: '2rem' }}>Nasz Blog o Finansach</h1>

            {posts.length === 0 ? (
                <p>Nie znaleziono jeszcze żadnych artykułów.</p>
            ) : (
                <ul style={{ listStyle: 'none', padding: 0 }}>
                    {posts.map((post) => (
                        <li key={post.slug} style={{ marginBottom: '2rem', borderBottom: '1px solid #eee', paddingBottom: '1rem' }}>
                            <Link href={`/blog/${post.slug}`} style={{ textDecoration: 'none', color: 'inherit' }}>
                                <h2 style={{ marginBottom: '0.5rem' }}>{post.title}</h2>
                                <p style={{ margin: '0 0 0.5rem', color: '#666' }}>Opublikowano: {post.date}</p>
                                <p style={{ margin: 0 }}>{post.description}</p>
                            </Link>
                        </li>
                    ))}
                </ul>
            )}
        </div>
    );
}