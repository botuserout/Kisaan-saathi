'use client';

import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import LanguageDetector from 'i18next-browser-languagedetector';
import HttpApi from 'i18next-http-backend';

// Only use the robust side-effects (HTTP fetch, Browser Detector) on the client.
// During the build (server-side), we use a minimal config to prevent errors.
const isClient = typeof window !== 'undefined';

if (isClient) {
    i18n
        .use(HttpApi)
        .use(LanguageDetector)
        .use(initReactI18next)
        .init({
            supportedLngs: ['en', 'hi', 'gu', 'or', 'bho', 'kn', 'ml'],
            fallbackLng: 'en',
            debug: false,
            interpolation: {
                escapeValue: false,
            },
            backend: {
                loadPath: '/locales/{{lng}}/common.json',
            },
            react: {
                useSuspense: false // Avoids 'Suspense' related build issues/flicker
            }
        });
} else {
    // Server/Build environment: minimal init to satisfy calling t() without crashing
    i18n
        .use(initReactI18next)
        .init({
            lng: 'en', // Default to English during build
            fallbackLng: 'en',
            supportedLngs: ['en'],
            resources: {
                en: {
                    translations: {} // Empty resources, t('key') will return 'key'
                }
            },
            react: {
                useSuspense: false
            }
        });
}

export default i18n;
