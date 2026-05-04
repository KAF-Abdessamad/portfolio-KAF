/**
 * Simple translation utility using a free API (MyMemory)
 * Note: For production use, consider a more robust service like Google Translate or DeepL.
 */
export async function translateText(text, from = 'fr', to = 'en') {
    if (!text || text.trim() === '') return '';
    
    try {
        const response = await fetch(`https://api.mymemory.translated.net/get?q=${encodeURIComponent(text)}&langpair=${from}|${to}`);
        const data = await response.json();
        
        if (data && data.responseData && data.responseData.translatedText) {
            return data.responseData.translatedText;
        }
        return text;
    } catch (error) {
        console.error("Translation error:", error);
        return text;
    }
}
