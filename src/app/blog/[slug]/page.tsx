// app/blog/[slug]/page.tsx

import fs from 'fs';
import path from 'path';
import matter from 'gray-matter';
import { remark } from 'remark';
import html from 'remark-html';
import styles from './page.module.css'; // <-- ZMIANA: Importujemy style

const postsDirectory = path.join(process.cwd(), 'posts');

// Funkcja do pobierania danych posta na podstawie sluga (nazwy pliku)
async function getPostData(slug: string) {
    const fullPath = path.join(postsDirectory, `${slug}.md`);
    const fileContents = fs.readFileSync(fullPath, 'utf8');

    // Użyj gray-matter do parsowania metadanych
    const matterResult = matter(fileContents);

    // Użyj remark do konwersji Markdown na HTML
    const processedContent = await remark()
        .use(html)
        .process(matterResult.content);
    const contentHtml = processedContent.toString();

    return {
        slug,
        contentHtml,
        ...(matterResult.data as { title: string; date: string; description: string }),
    };
}

// Generowanie metadanych SEO dla strony
export async function generateMetadata({ params }: { params: { slug: string } }) {
    const postData = await getPostData(params.slug);
    return {
        title: postData.title,
        description: postData.description,
    };
}

// Komponent strony posta
export default async function Post({ params }: { params: { slug: string } }) {
    const postData = await getPostData(params.slug);

    return (
        // <-- ZMIANA: Dodajemy główny kontener centrujący treść
        <main className={styles.articleContainer}>
            <article>
                {/* Tytuł i data są teraz poza treścią z Markdown dla lepszej kontroli */}
                <h1>{postData.title}</h1>
                <div style={{color: '#6b7280', marginBottom: '2rem', marginTop: '0.5rem'}}>
                    Opublikowano: {postData.date}
                </div>

                {/* Ten kontener otrzyma style dla treści artykułu (paragrafy, listy, etc.) */}
                <div
                    className={styles.articleContent}
                    dangerouslySetInnerHTML={{ __html: postData.contentHtml }}
                />
            </article>
        </main>
    );
}

// Funkcja generująca statyczne ścieżki dla wszystkich postów
export async function generateStaticParams() {
    const postsDirectory = path.join(process.cwd(), 'posts');

    if (!fs.existsSync(postsDirectory)) {
        return [];
    }

    const fileNames = fs.readdirSync(postsDirectory);

    return fileNames.map((fileName) => ({
        slug: fileName.replace(/\.md$/, ''),
    }));
}