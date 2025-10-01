
import fs from 'fs';
import path from 'path';
import matter from 'gray-matter';
import { remark } from 'remark';
import html from 'remark-html';
import styles from './page.module.css';
import Link from "next/link";

const postsDirectory = path.join(process.cwd(), 'posts');

async function getPostData(slug: string) {
    const fullPath = path.join(postsDirectory, `${slug}.md`);
    const fileContents = fs.readFileSync(fullPath, 'utf8');

    const matterResult = matter(fileContents);

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

export async function generateMetadata({ params }: { params: { slug: string } }) {
    const postData = await getPostData(params.slug);
    return {
        title: postData.title,
        description: postData.description,
    };
}

export default async function Post({ params }: { params: { slug: string } }) {
    const postData = await getPostData(params.slug);

    return (
        <main className={styles.articleContainer}>

            <Link href="/blog" className={styles.backLink}>
                ← Wróć do wszystkich postów
            </Link>

            <article>
                <h1>{postData.title}</h1>
                <div style={{color: '#6b7280', marginBottom: '2rem', marginTop: '0.5rem'}}>
                    Opublikowano: {postData.date}
                </div>
                <div
                    className={styles.articleContent}
                    dangerouslySetInnerHTML={{__html: postData.contentHtml}}
                />
            </article>
        </main>
    );
}

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