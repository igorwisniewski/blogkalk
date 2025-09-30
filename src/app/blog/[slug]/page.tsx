import fs from 'fs';
import path from 'path';
import matter from 'gray-matter';
import { remark } from 'remark';
import html from 'remark-html';

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
        title: postData.title, // Tutaj trafi tytuł z pliku .md
        description: postData.description, // Tutaj meta opis z pliku .md
    };
}

// Komponent strony posta
export default async function Post({ params }: { params: { slug: string } }) {
    const postData = await getPostData(params.slug);

    return (
        <article>
            <h1>{postData.title}</h1>
            <div>{postData.date}</div>
            <div dangerouslySetInnerHTML={{ __html: postData.contentHtml }} />
        </article>
    );
}

// Funkcja generująca statyczne ścieżki dla wszystkich postów
// app/blog/[slug]/page.tsx

// ... (reszta importów i kodu bez zmian) ...

export async function generateStaticParams() {
    const postsDirectory = path.join(process.cwd(), 'posts');

    // Sprawdzamy, czy folder w ogóle istnieje
    if (!fs.existsSync(postsDirectory)) {
        // Jeśli nie, zwracamy pustą tablicę. Build się powiedzie, ale nie wygeneruje żadnych postów.
        return [];
    }

    const fileNames = fs.readdirSync(postsDirectory);

    return fileNames.map((fileName) => ({
        slug: fileName.replace(/\.md$/, ''),
    }));
}