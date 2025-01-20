// src/components/TranslationWrapper.js
import React, { useEffect, useRef, useState } from 'react';

const TranslationWrapper = ({ children, language }) => {
  const wrapperRef = useRef(null);
  const [isTranslating, setIsTranslating] = useState(false);
  const translationCache = useRef(new Map());

  const translateNode = async (node, targetLang) => {
    if (!node || !node.textContent || !node.textContent.trim()) return;

    const originalText = node.textContent.trim();
    const cacheKey = `${originalText}_${targetLang}`;

    try {
      // Check cache first
      if (translationCache.current.has(cacheKey)) {
        node.textContent = translationCache.current.get(cacheKey);
        return;
      }

      // Skip translation if target language is English
      if (targetLang === 'en') return;

      console.log('Translating:', originalText); // Debug log

      const response = await fetch(
        `https://api.mymemory.translated.net/get?q=${encodeURIComponent(originalText)}&langpair=en|${targetLang}`
      );
      const data = await response.json();

      if (data.responseData?.translatedText) {
        const translatedText = data.responseData.translatedText;
        node.textContent = translatedText;
        translationCache.current.set(cacheKey, translatedText);
        console.log('Translated:', translatedText); // Debug log
      }
    } catch (error) {
      console.error('Translation error for text:', originalText, error);
    }
  };

  useEffect(() => {
    const translateContent = async () => {
      if (!wrapperRef.current || language === 'en' || isTranslating) return;

      setIsTranslating(true);
      console.log('Starting translation to:', language); // Debug log

      try {
        const walker = document.createTreeWalker(
          wrapperRef.current,
          NodeFilter.SHOW_TEXT,
          {
            acceptNode: (node) => {
              // Skip translation for scripts, styles, and empty nodes
              if (
                node.parentNode.tagName === 'SCRIPT' ||
                node.parentNode.tagName === 'STYLE' ||
                !node.textContent.trim() ||
                node.parentNode.hasAttribute('data-no-translate')
              ) {
                return NodeFilter.FILTER_REJECT;
              }
              return NodeFilter.FILTER_ACCEPT;
            },
          }
        );

        const textNodes = [];
        let currentNode = walker.nextNode();
        
        while (currentNode) {
          textNodes.push(currentNode);
          currentNode = walker.nextNode();
        }

        console.log('Found text nodes:', textNodes.length); // Debug log

        // Translate in batches
        const batchSize = 5;
        for (let i = 0; i < textNodes.length; i += batchSize) {
          const batch = textNodes.slice(i, i + batchSize);
          await Promise.all(batch.map(node => translateNode(node, language)));
          // Add a small delay between batches to avoid rate limiting
          await new Promise(resolve => setTimeout(resolve, 100));
        }
      } catch (error) {
        console.error('Translation error:', error);
      } finally {
        setIsTranslating(false);
      }
    };

    translateContent();
  }, [language]);

  return (
    <div ref={wrapperRef}>
      {isTranslating && (
        <div style={{
          position: 'fixed',
          top: '60px',
          right: '20px',
          background: '#333',
          color: 'white',
          padding: '8px 16px',
          borderRadius: '4px',
          zIndex: 9999
        }}>
          Translating...
        </div>
      )}
      {children}
    </div>
  );
};

export default TranslationWrapper;