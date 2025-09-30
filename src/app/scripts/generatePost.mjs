import { GoogleGenerativeAI } from '@google/generative-ai';
import fs from 'fs';
import path from 'path';

// Konfiguracja
const GEMINI_API_KEY = process.env.GEMINI_API_KEY;
if (!GEMINI_API_KEY) {
    throw new Error("Brak klucza GEMINI_API_KEY w zmiennych środowiskowych.");
}
const genAI = new GoogleGenerativeAI(GEMINI_API_KEY);
const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" }); // Używamy szybszego modelu

// Lista tematów, aby AI miało z czego losować
const topics = [
    "jak wyjść z pętli chwilówek",
    "konsolidacja kredytów czy warto",
    "negocjacje z windykatorem",
    "skuteczne sposoby na oszczędzanie",
    "jak zbudować poduszkę finansową",
    "upadłość konsumencka krok po kroku",
    "przedawnienie długów w Polsce",
];

async function generatePost() {
    try {
        const topic = topics[Math.floor(Math.random() * topics.length)];
        console.log(`Wybrano temat: ${topic}`);

        // --- Tutaj uwzględniamy Twoje wytyczne SEO! ---
        const prompt = `
      Napisz artykuł blogowy na temat: "${topic}".
      Artykuł powinien być napisany w języku polskim, w formacie Markdown.
      Celem jest SEO, więc używaj nagłówków (H2, H3), list i pogrubień.
      Artykuł ma być praktyczny i pomocny dla kogoś, kto ma problemy finansowe.

      Na samym początku odpowiedzi, bez żadnych dodatkowych opisów, zwróć obiekt JSON wewnątrz bloku kodu markdown, o następującej strukturze:
      {
        "title": "Tytuł SEO (maksymalnie 30 znaków)",
        "description": "Meta description (maksymalnie 90 znaków)",
        "slug": "prosty-unikalny-slug-do-url",
        "content": "Cała treść artykułu w formacie Markdown, zaczynając od nagłówka H1 (np. '# Tytuł Artykułu')"
      }
    `;

        const result = await model.generateContent(prompt);
        const response = await result.response;
        let text = response.text();

        // Wyciąganie JSON-a z odpowiedzi
        text = text.replace('```json', '').replace('```', '').trim();
        const data = JSON.parse(text);

        // Walidacja danych
        if (!data.title || !data.description || !data.slug || !data.content) {
            throw new Error("AI nie zwróciło poprawnych danych JSON.");
        }

        const { title, description, slug, content } = data;
        const date = new Date().toISOString().split('T')[0]; // Format YYYY-MM-DD

        const markdownContent = `---
title: "${title.replace(/"/g, '\\"')}"
date: "${date}"
description: "${description.replace(/"/g, '\\"')}"
---

${content}
`;
        const filePath = path.join(process.cwd(), 'posts', `${slug}.md`);

        if (fs.existsSync(filePath)) {
            console.log(`Plik ${slug}.md już istnieje. Przerywam.`);
            return;
        }

        fs.writeFileSync(filePath, markdownContent);
        console.log(`Pomyślnie wygenerowano i zapisano artykuł: ${slug}.md`);

    } catch (error) {
        console.error("Wystąpił błąd podczas generowania posta:", error);
        process.exit(1); // Zakończ z kodem błędu
    }
}

generatePost();