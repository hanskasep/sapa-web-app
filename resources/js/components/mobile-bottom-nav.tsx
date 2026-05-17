import { Link, usePage } from '@inertiajs/react';
import { MoreHorizontal } from 'lucide-react';
import { useState } from 'react';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';
import { getMainNavItems, getNavGroups, resolveNavIcon } from '@/lib/navigation';
import { cn, toUrl } from '@/lib/utils';
import type { NavItem } from '@/types';

type Props = {
    /**
     * Maximum number of primary items to surface in the bar before the
     * remaining items get rolled up under a "Lainnya" sheet.
     */
    maxItems?: number;
};

/**
 * Bottom navigation bar shown only on small screens. The first `maxItems`
 * navigation entries (after permission filtering) appear as direct tabs;
 * everything else gets a single "Lainnya" entry that opens a sheet listing
 * the rest, including the admin group.
 */
export function MobileBottomNav({ maxItems = 4 }: Props) {
    const page = usePage();
    const { auth, menus } = page.props;
    const url = page.url;
    const [moreOpen, setMoreOpen] = useState(false);

    const main = getMainNavItems(auth, menus);
    const navGroups = getNavGroups(auth, menus);

    if (main.length === 0 && navGroups.length === 0) {
        return null;
    }

    const primary = main.slice(0, maxItems);
    const overflow = main.slice(maxItems);
    const adminGroups = navGroups.filter(
        (group) => group.title !== 'Platform' && group.children.length > 0,
    );
    const hasMore = overflow.length > 0 || adminGroups.length > 0;

    return (
        <nav
            className="fixed inset-x-0 bottom-0 z-30 border-t border-sidebar-border/70 bg-background/95 backdrop-blur md:hidden dark:border-sidebar-border"
            aria-label="Navigasi utama"
        >
            <ul
                className="grid"
                style={{
                    gridTemplateColumns: `repeat(${primary.length + (hasMore ? 1 : 0)}, minmax(0, 1fr))`,
                }}
            >
                {primary.map((item) => (
                    <li key={item.id ?? item.title}>
                        <BottomNavLink item={item} currentUrl={url} />
                    </li>
                ))}

                {hasMore && (
                    <li>
                        <Sheet open={moreOpen} onOpenChange={setMoreOpen}>
                            <SheetTrigger asChild>
                                <button
                                    type="button"
                                    className={cn(
                                        'flex h-full w-full flex-col items-center justify-center gap-0.5 px-1 py-2 text-[11px] font-medium transition-colors',
                                        'text-muted-foreground hover:text-foreground',
                                    )}
                                    aria-label="Lihat menu lainnya"
                                >
                                    <span className="grid size-7 place-items-center">
                                        <MoreHorizontal className="size-5" />
                                    </span>
                                    <span className="leading-none">
                                        Lainnya
                                    </span>
                                </button>
                            </SheetTrigger>
                            <SheetContent
                                side="bottom"
                                className="max-h-[80vh] gap-0 overflow-y-auto rounded-t-2xl p-0"
                            >
                                <div className="flex flex-col gap-5 p-5 pb-8">
                                    {overflow.length > 0 && (
                                        <MobileNavSection
                                            title="Menu lainnya"
                                            items={overflow}
                                            currentUrl={url}
                                            onSelect={() => setMoreOpen(false)}
                                        />
                                    )}
                                    {adminGroups.map((group) => (
                                        <MobileNavSection
                                            key={group.id ?? group.title}
                                            title={group.title}
                                            items={group.children}
                                            currentUrl={url}
                                            onSelect={() => setMoreOpen(false)}
                                        />
                                    ))}
                                </div>
                            </SheetContent>
                        </Sheet>
                    </li>
                )}
            </ul>
        </nav>
    );
}

function BottomNavLink({
    item,
    currentUrl,
}: {
    item: NavItem;
    currentUrl: string;
}) {
    const Icon = resolveNavIcon(item.icon);
    const href = toUrl(item.href);
    const active = isActive(href, currentUrl);

    return (
        <Link
            href={item.href}
            prefetch
            className={cn(
                'flex h-full w-full flex-col items-center justify-center gap-0.5 px-1 py-2 text-[11px] font-medium transition-colors',
                active
                    ? 'text-primary'
                    : 'text-muted-foreground hover:text-foreground',
            )}
            aria-current={active ? 'page' : undefined}
        >
            <span className="relative grid size-7 place-items-center">
                {Icon ? <Icon className="size-5" /> : null}
                {item.badge != null && item.badge !== 0 && (
                    <span className="absolute -top-0.5 -right-1 grid h-4 min-w-4 place-items-center rounded-full bg-rose-500 px-1 text-[10px] font-semibold text-white">
                        {Number(item.badge) > 99 ? '99+' : item.badge}
                    </span>
                )}
            </span>
            <span className="line-clamp-1 leading-none">{item.title}</span>
        </Link>
    );
}

function MobileNavSection({
    title,
    items,
    currentUrl,
    onSelect,
}: {
    title: string;
    items: NavItem[];
    currentUrl: string;
    onSelect: () => void;
}) {
    return (
        <section className="flex flex-col gap-2">
            <h2 className="text-xs font-semibold tracking-wider text-muted-foreground uppercase">
                {title}
            </h2>
            <ul className="grid grid-cols-3 gap-2">
                {items.map((item) => {
                    const Icon = resolveNavIcon(item.icon);
                    const href = toUrl(item.href);
                    const active = isActive(href, currentUrl);

                    return (
                        <li key={item.id ?? item.title}>
                            <Link
                                href={item.href}
                                prefetch
                                onClick={onSelect}
                                className={cn(
                                    'flex h-20 w-full flex-col items-center justify-center gap-1.5 rounded-lg border px-2 py-3 text-center text-xs font-medium transition-colors',
                                    active
                                        ? 'border-primary bg-primary/10 text-primary'
                                        : 'border-sidebar-border/70 bg-card text-muted-foreground hover:bg-muted dark:border-sidebar-border',
                                )}
                            >
                                <span className="relative grid size-6 place-items-center">
                                    {Icon ? <Icon className="size-5" /> : null}
                                    {item.badge != null && item.badge !== 0 && (
                                        <span className="absolute -top-0.5 -right-1 grid h-4 min-w-4 place-items-center rounded-full bg-rose-500 px-1 text-[10px] font-semibold text-white">
                                            {Number(item.badge) > 99
                                                ? '99+'
                                                : item.badge}
                                        </span>
                                    )}
                                </span>
                                <span className="line-clamp-2 leading-tight">
                                    {item.title}
                                </span>
                            </Link>
                        </li>
                    );
                })}
            </ul>
        </section>
    );
}

function isActive(href: string, currentUrl: string): boolean {
    if (!href || href === '#') {
        return false;
    }

    if (href === '/') {
        return currentUrl === '/';
    }

    return currentUrl === href || currentUrl.startsWith(`${href}/`);
}
