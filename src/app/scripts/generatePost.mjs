import { GoogleGenerativeAI } from '@google/generative-ai';
import fs from 'fs';
import path from 'path';
import 'dotenv/config'; // WAŻNE: Importujemy dotenv, aby załadować zmienne z pliku .env

// --- KONFIGURACJA ---
const POSTS_TO_GENERATE = 3; // Ile postów chcemy wygenerować?


const GEMINI_API_KEY = process.env.GEMINI_API_KEY;
if (!GEMINI_API_KEY) {
    throw new Error("Brak klucza GEMINI_API_KEY. Upewnij się, że masz plik .env z tym kluczem.");
}

// --- DODAJ TĘ LINIĘ ---
console.log(`DEBUG: Używany fragment klucza API: ${GEMINI_API_KEY.substring(0, 5)}...${GEMINI_API_KEY.slice(-4)}`);
// ----------------------

const genAI = new GoogleGenerativeAI(GEMINI_API_KEY);
const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash-lite" });
const topics = [
    "jak wyjść z pętli chwilówek",
    "konsolidacja kredytów czy warto",
    "negocjacje z windykatorem",
    "skuteczne sposoby na oszczędzanie",
    "jak zbudować poduszkę finansową",
    "upadłość konsumencka krok po kroku",
    "przedawnienie długów w Polsce",
    "jak poprawić swoją zdolność kredytową",
    "co to jest BIK i jak sprawdzić swój raport",
    "ulga na złe długi w podatkach"
];

// Funkcja pomocnicza do opóźnień
const sleep = (ms) => new Promise(resolve => setTimeout(resolve, ms));

// Główna funkcja generująca JEDEN post
// Proszę, zastąp całą swoją funkcję `generateSinglePost` tą wersją
// W pliku src/app/scripts/generatePost.mjs
// ZASTĄP TĘ FUNKCJĘ

// W pliku src/app/scripts/generatePost.mjs
// ZASTĄP TĘ FUNKCJĘ
// Funkcja do tworzenia "czystych" slugów
function slugify(text) {
    const a = 'àáâäæãåāăąçćčđďèéêëēėęěğǵḧîïíīįìłḿñńǹňôöòóœøōõőṕŕřßśšşșťțûüùúūǘůűųẃẍÿýžźż·/_,:;'
    const b = 'aaaaaaaaaacccddeeeeeeeegghiiiiiilmnnnnoooooooooprrssssssttuuuuuuuuuwxyyzzz------'
    const p = new RegExp(a.split('').join('|'), 'g')

    return text.toString().toLowerCase()
        .replace(/\s+/g, '-') // Replace spaces with -
        .replace(p, c => b.charAt(a.indexOf(c))) // Replace special characters
        .replace(/&/g, '-and-') // Replace & with 'and'
        .replace(/[^\w\-]+/g, '') // Remove all non-word chars
        .replace(/\-\-+/g, '-') // Replace multiple - with single -
        .replace(/^-+/, '') // Trim - from start of text
        .replace(/-+$/, '') // Trim - from end of text
}

async function generateSinglePost(topic) {
    console.log(`\n--- Generowanie posta na temat: "${topic}" ---`);

    const prompt = `
      Napisz artykuł blogowy na temat: "${topic}".
      Artykuł powinien być napisany w języku polskim, w formacie Markdown.
      Celem jest SEO, więc używaj nagłówków (H2, H3), list i pogrubień.
      Artykuł ma być praktyczny i pomocny dla kogoś, kto ma problemy finansowe.

      Zwróć obiekt JSON o następującej strukturze:
      {
        "title": "Tytuł SEO (maksymalnie 30 znaków)",
        "description": "Meta description (maksymalnie 90 znaków)",
        "slug": "prosty-unikalny-slug-do-url",
        "content": "Cała treść artykułu w formacie Markdown, zaczynając od nagłówka H1 (np. '# Tytuł Artykułu')"
      }
    `;

    const generationConfig = {
        responseMimeType: "application/json",
    };

    const result = await model.generateContent({
        contents: [{ role: "user", parts: [{ text: prompt }] }],
        generationConfig,
    });

    const response = await result.response;
    const text = response.text();
    let data;

    try {
        data = JSON.parse(text);
    } catch (error) {
        console.error("BŁĄD: Nie udało się sparsować odpowiedzi JSON od AI.");
        console.error("Otrzymany tekst:", text);
        throw new Error("Błąd parsowania JSON.");
    }

    // ZMIANA: Dodajemy logowanie obiektu PRZED rzuceniem błędu
    if (!data.title || !data.description || !data.slug || !data.content) {
        console.error("Otrzymany (niekompletny) obiekt JSON:", JSON.stringify(data, null, 2));
        throw new Error("AI nie zwróciło wszystkich wymaganych pól w JSON.");
    }

    const { title, description, content } = data;
    const cleanSlug = slugify(data.slug);

    const date = new Date().toLocaleDateString('pl-PL');

    const markdownContent = `---
title: "${title.replace(/"/g, '\\"')}"
date: "${date}"
description: "${description.replace(/"/g, '\\"')}"
---

${content}
`;
    const filePath = path.join(process.cwd(), 'posts', `${cleanSlug}.md`);

    if (fs.existsSync(filePath)) {
        console.log(`Plik ${cleanSlug}.md już istnieje. Pomijam.`);
        return;
    }

    fs.writeFileSync(filePath, markdownContent);
    console.log(`✅ Pomyślnie zapisano artykuł: ${cleanSlug}.md`);
}// Funkcja sterująca, która uruchamia pętlę
async function main() {
    console.log(`Rozpoczynam generowanie ${POSTS_TO_GENERATE} postów...`);

    // Tasujemy tematy, aby za każdym razem były inne i unikalne
    const shuffledTopics = topics.sort(() => 0.5 - Math.random());

    if (shuffledTopics.length < POSTS_TO_GENERATE) {
        console.error("Błąd: Za mało unikalnych tematów w liście 'topics' w porównaniu do 'POSTS_TO_GENERATE'.");
        return;
    }

    const selectedTopics = shuffledTopics.slice(0, POSTS_TO_GENERATE);

    for (const topic of selectedTopics) {
        try {
            await generateSinglePost(topic);
            await sleep(2000); // Czekamy 2 sekundy między zapytaniami, aby nie obciążać API
        } catch (error) {
            console.error(`Nie udało się wygenerować posta na temat "${topic}". Błąd:`, error.message);
        }
    }

    console.log('\nZakończono proces generowania.');
}

// Uruchomienie głównej funkcji
main();