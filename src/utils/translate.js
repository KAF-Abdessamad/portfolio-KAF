export async function translateText(text, from = 'fr', to = 'en') {
    if (!text || text.trim() === '') return '';
    
    try {
        // MyMemory free endpoint rejects long queries (limit is 500 chars).
        // We use a safer 350 to allow for encoding expansion.
        const MAX_CHARS = 350;

        const normalize = (s) => String(s).replace(/\s+/g, ' ').trim();

        const chunkText = (input) => {
            const s = normalize(input);
            if (s.length <= MAX_CHARS) return [s];

            // Split by newlines, then sentences, then words if necessary
            const parts = s
                .split(/\n+/)
                .map(p => p.trim())
                .filter(Boolean)
                .flatMap(p => p.split(/(?<=[.!?])\s+/));

            const chunks = [];
            let buf = '';
            for (const part of parts) {
                if (!part) continue;
                
                // If a single part (sentence) is still too long, hard-split it
                if (part.length > MAX_CHARS) {
                    if (buf) chunks.push(buf);
                    for (let i = 0; i < part.length; i += MAX_CHARS) {
                        chunks.push(part.slice(i, i + MAX_CHARS));
                    }
                    buf = '';
                    continue;
                }

                const candidate = buf ? `${buf} ${part}` : part;
                if (candidate.length <= MAX_CHARS) {
                    buf = candidate;
                } else {
                    if (buf) chunks.push(buf);
                    buf = part;
                }
            }
            if (buf) chunks.push(buf);
            return chunks.length ? chunks : [s.slice(0, MAX_CHARS)];
        };

        const chunks = chunkText(text);
        const translatedChunks = [];

        for (const chunk of chunks) {
            const response = await fetch(
                `https://api.mymemory.translated.net/get?q=${encodeURIComponent(chunk)}&langpair=${from}|${to}`
            );
            const data = await response.json();

            const translated = data?.responseData?.translatedText;
            const status = data?.responseStatus;

            // MyMemory sometimes returns 200 with an error message in translatedText
            const isError = translated && (
                translated.includes("QUERY LENGTH LIMIT EXCEEDED") ||
                translated.includes("MYMEMORY WARNING")
            );

            if (status != 200 || !translated || isError) {
                console.warn("Translation partial failure or limit reached:", translated || status);
                // Return original chunk as fallback for this part
                translatedChunks.push(chunk);
                continue;
            }
            translatedChunks.push(translated);
        }

        return translatedChunks.join(' ');
    } catch (error) {
        console.error("Translation error:", error);
        return text;
    }
}

