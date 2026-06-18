import { createInertiaApp } from '@inertiajs/react';
import { Toaster } from '@/components/ui/sonner';
import { TooltipProvider } from '@/components/ui/tooltip';
import { initializeTheme } from '@/hooks/use-appearance';
import AppLayout from '@/layouts/app-layout';
import AuthLayout from '@/layouts/auth-layout';
import SettingsLayout from '@/layouts/settings/layout';

// Resolve the app name at runtime so it always reflects APP_NAME from .env
// without requiring a frontend rebuild. Falls back to the build-time
// VITE_APP_NAME (and finally 'Laravel') when the meta tag is unavailable
// (e.g. in tests or SSR before the document is ready).
function resolveAppName(): string {
    if (typeof document !== 'undefined') {
        const meta = document.querySelector<HTMLMetaElement>(
            'meta[name="app-name"]',
        );
        const fromMeta = meta?.content?.trim();
        if (fromMeta) {
            return fromMeta;
        }
    }

    return import.meta.env.VITE_APP_NAME || 'Laravel';
}

const appName = resolveAppName();

createInertiaApp({
    title: (title) => (title ? `${title} - ${appName}` : appName),
    layout: (name) => {
        switch (true) {
            case name === 'welcome':
                return null;
            case name.startsWith('auth/'):
                return AuthLayout;
            case name.startsWith('settings/'):
                return [AppLayout, SettingsLayout];
            default:
                return AppLayout;
        }
    },
    strictMode: true,
    withApp(app) {
        return (
            <TooltipProvider delayDuration={0}>
                {app}
                <Toaster />
            </TooltipProvider>
        );
    },
    progress: {
        color: '#4B5563',
    },
});

// This will set light / dark mode on load...
initializeTheme();
