import { Bot } from "lucide-react";
import { Tooltip } from "antd";
import { Link, useLocation } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { useEffect, useRef } from "react";

import { navigationTools, type NavigationToolSlug } from "@/constant/navigation-tools";
import { UserStatusActions } from "@/components/layout/user-status-actions";
import { cn } from "@/lib/utils";
import { useAgentStore } from "@/stores/use-agent-store";

type AppSideNavProps = {
    collapsed: boolean;
};

export function AppSideNav({ collapsed }: AppSideNavProps) {
    const { t } = useTranslation();
    const { pathname } = useLocation();
    const autoConnectRef = useRef(false);
    const agentToken = useAgentStore((state) => state.token);
    const agentEnabled = useAgentStore((state) => state.enabled);
    const agentConnected = useAgentStore((state) => state.connected);
    const connectAgent = useAgentStore((state) => state.connectAgent);
    const togglePanel = useAgentStore((state) => state.togglePanel);
    const panelOpen = useAgentStore((state) => state.panelOpen);

    const hideSidebar = /^\/canvas\/[^/]+/.test(pathname);
    const slug = pathname.split("/").filter(Boolean)[0];
    const activeToolSlug = navigationTools.some((tool) => tool.slug === slug) ? (slug as NavigationToolSlug) : undefined;

    useEffect(() => {
        if (autoConnectRef.current || agentEnabled || agentConnected || !agentToken.trim()) return;
        autoConnectRef.current = true;
        connectAgent({ silent: true });
    }, [agentConnected, agentEnabled, agentToken, connectAgent]);

    if (hideSidebar) return null;

    return (
        <aside
            className={cn(
                "flex h-full shrink-0 flex-col border-r border-stone-200 bg-background transition-[width] duration-200 dark:border-stone-800",
                collapsed ? "w-0 border-r-0" : "w-56",
            )}
        >
            {/* Logo */}
            <div className="flex h-14 shrink-0 items-center gap-2 border-b border-stone-200 px-3 dark:border-stone-800">
                <Link to="/" className="flex min-w-0 flex-1 items-center gap-2">
                    <span
                        className="size-5 shrink-0 bg-current"
                        style={{
                            mask: "url(/logo.svg) center / contain no-repeat",
                            WebkitMask: "url(/logo.svg) center / contain no-repeat",
                        }}
                    />
                    <span className="truncate text-base font-medium leading-none tracking-tight text-stone-950 dark:text-stone-100">
                        {t("meta.title")}
                    </span>
                </Link>
            </div>

            {/* Nav items */}
            <nav className="flex min-h-0 flex-1 flex-col gap-1 overflow-y-auto px-2 py-3">
                {navigationTools.map((tool) => {
                    const Icon = tool.icon;
                    const active = tool.slug === activeToolSlug;
                    return (
                        <Link
                            key={tool.slug}
                            to={`/${tool.slug}`}
                            className={cn(
                                "flex items-center gap-3 rounded-lg px-3 py-2 text-sm transition",
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
            </nav>

            {/* Bottom actions */}
            <div className="shrink-0 border-t border-stone-200 px-2 py-3 dark:border-stone-800">
                <Tooltip title={t(panelOpen ? "topNav.closeAgent" : "topNav.openAgent")} placement="right">
                    <button
                        type="button"
                        onClick={togglePanel}
                        className="mb-2 flex w-full items-center gap-3 rounded-lg px-3 py-2 text-sm text-stone-500 transition hover:bg-stone-50 hover:text-stone-950 dark:text-stone-400 dark:hover:bg-stone-900/60 dark:hover:text-stone-100"
                    >
                        <Bot className="size-4 shrink-0" />
                        <span>{t(panelOpen ? "topNav.closeAgent" : "topNav.openAgent")}</span>
                    </button>
                </Tooltip>
                <div className="flex flex-wrap items-center gap-0.5 px-1">
                    <UserStatusActions />
                </div>
            </div>
        </aside>
    );
}
