import { Link } from '@inertiajs/react';
import { ClipboardCheck, FileHeart } from 'lucide-react';
import type { LucideIcon } from 'lucide-react';
import { cn } from '@/lib/utils';

type Tab = {
    label: string;
    href: string;
    icon: LucideIcon;
};

const tabs: Tab[] = [
    { label: 'Absensi', href: '/attendance', icon: ClipboardCheck },
    { label: 'Izin & Sakit', href: '/attendance/excuses', icon: FileHeart },
];

type Props = {
    active: 'attendance' | 'excuses';
};

export function AttendanceTabs({ active }: Props) {
    return (
        <nav className="flex flex-wrap items-center gap-1 border-b border-sidebar-border/70 dark:border-sidebar-border">
            {tabs.map((tab) => {
                const isActive =
                    (active === 'attendance' && tab.href === '/attendance') ||
                    (active === 'excuses' &&
                        tab.href === '/attendance/excuses');
                const Icon = tab.icon;

                return (
                    <Link
                        key={tab.href}
                        href={tab.href}
                        className={cn(
                            '-mb-px inline-flex items-center gap-2 border-b-2 px-3 py-2 text-sm font-medium transition-colors',
                            isActive
                                ? 'border-primary text-foreground'
                                : 'border-transparent text-muted-foreground hover:text-foreground',
                        )}
                    >
                        <Icon className="size-4" />
                        {tab.label}
                    </Link>
                );
            })}
        </nav>
    );
}
