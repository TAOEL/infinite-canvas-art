import { PanelLeftClose, PanelLeftOpen } from "lucide-react";
import { Tooltip } from "antd";
import { useRef, useState, type ReactNode } from "react";
import { useTranslation } from "react-i18next";
import { Link, useLocation } from "react-router-dom";

import { AgentPanel } from "@/components/agent/agent-panel";
import { AppSideNav } from "@/components/layout/app-side-nav";
import { AppConfigModal } from "@/components/layout/app-config-modal";
import { navigationTools, type NavigationToolSlug } from "@/constant/navigation-tools";
import { cn } from "@/lib/utils";

export default function UserLayout({ children }: { children: ReactNode }) {
    const { t } = useTranslation();
    const { pathname } = useLocation();
    const [collapsed, setCollapsed] = useState(false);
    const [hoverMenu, setHoverMenu] = useState(false);
    const hoverTimer = useRef<number | null>(null);

    const slug = pathname.split("/").filter(Boolean)[0];
    const activeToolSlug = navigationTools.some((tool) => tool.slug === slug) ? (slug as NavigationToolSlug) : undefined;
    const hideToggle = /^\/canvas\/[^/]+/.test(pathname);

    const scheduleClose = () => {
        if (hoverTimer.current) window.clearTimeout(hoverTimer.current);
        hoverTimer.current = window.setTimeout(() => setHoverMenu(false), 200);
    };
    const cancelClose = () => {
        if (hoverTimer.current) window.clearTimeout(hoverTimer.current);
    };

    const isCollapsed = collapsed;
    const toggleIcon = isCollapsed ? <PanelLeftOpen className="size-4" /> : <PanelLeftClose className="size-4" />;
    const toggleLabel = isCollapsed ? t("canvas.expandPanel") : t("canvas.collapsePanel");

    return (
        <div className="flex h-dvh overflow-hidden bg-background text-foreground">
            <AppSideNav collapsed={collapsed} />

            <div className="relative flex min-w-0 flex-1 flex-col overflow-hidden">
                {/* Toggle button: content area top-left */}
                {!hideToggle && (
                <div
                    className="absolute left-3 top-[14px] z-40"
                    onMouseEnter={cancelClose}
                    onMouseLeave={scheduleClose}
                >
                    <Tooltip title={toggleLabel} placement="right">
                        <button
                            type="button"
                            onClick={() => setCollapsed((v) => !v)}
                            onMouseEnter={() => {
                                if (collapsed) setHoverMenu(true);
                            }}
                            aria-label={toggleLabel}
                            className="grid size-8 place-items-center rounded-lg text-stone-500 transition hover:bg-stone-100 hover:text-stone-950 dark:text-stone-400 dark:hover:bg-stone-800 dark:hover:text-stone-100"
                        >
                            {toggleIcon}
                        </button>
                    </Tooltip>

                    {/* Dropdown menu when collapsed and hovered */}
                    {collapsed && hoverMenu && (
                        <div className="absolute left-0 top-10 w-48 rounded-lg border border-stone-200 bg-background p-1.5 shadow-xl dark:border-stone-800">
                            {navigationTools.map((tool) => {
                                const Icon = tool.icon;
                                const active = tool.slug === activeToolSlug;
                                return (
                                    <Link
                                        key={tool.slug}
                                        to={`/${tool.slug}`}
                                        className={cn(
                                            "flex items-center gap-3 rounded-md px-3 py-2 text-sm transition",
                                            active
                                                ? "bg-stone-100 font-medium text-stone-950 dark:bg-stone-800 dark:text-stone-100"
                                                : "text-stone-500 hover:bg-stone-50 hover:text-stone-950 dark:text-stone-400 dark:hover:bg-stone-900/60 dark:hover:text-stone-100",
                                        )}
                                    >
                                        <Icon className="size-4 shrink-0" />
                                        <span className="truncate">{t(`navigation.${tool.slug}`)}</span>
                                    </Link>
                                );
                            })}
                        </div>
                    )}
                </div>
                )}

                <div className="min-h-0 flex-1 overflow-hidden">{children}</div>
            </div>
            <AgentPanel />
            <AppConfigModal />
        </div>
    );
}
