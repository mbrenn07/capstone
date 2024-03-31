import React, { useEffect, useState } from 'react';

const API_KEY = 'AIzaSyCqHi8mxnym6HWx-fb4x4bvPmznNL-soSM';

const Translate = ({ sourceLang, targetLang, sourceText }: { sourceLang: string, targetLang: string, sourceText: string }) => {
    const [translation, setTranslation] = useState('');

    useEffect(() => {
        const translateText = async () => {
            const response = await fetch(
                `https://translation.googleapis.com/language/translate/v2?key=${API_KEY}`,
                {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({
                        q: sourceText,
                        source: sourceLang,
                        target: targetLang,
                        format: 'text'
                    })
                }
            );

            const data = await response.json();
            setTranslation(data.data.translations[0].translatedText);
        };

        translateText();
    }, [sourceLang, targetLang, sourceText]);

    return <div>{translation}</div>;
};

export default Translate;
