
import {
    BotMessageSquare,
    Landmark,
    LineChart,
    Mic,
    Sprout,
    Stethoscope,
    TestTube2,
    Tractor,
} from 'lucide-react';
import type { LucideIcon } from 'lucide-react';
import Link from 'next/link';
import { useTranslation } from 'react-i18next';
import { Card, CardContent } from '@/components/ui/card';

// ... (imports remain)
const tools = [
    {
        titleKey: 'tool_assistant',
        href: '/voice-assistant',
        icon: Mic,
    },
    {
        titleKey: 'tool_chat',
        href: '/chat',
        icon: BotMessageSquare,
    },
    {
        titleKey: 'tool_crop',
        href: '/crop-recommendation',
        icon: Sprout,
    },
    {
        titleKey: 'tool_yield',
        href: '/yield-prediction',
        icon: LineChart,
    },
    {
        titleKey: 'tool_disease',
        href: '/disease-detection',
        icon: Stethoscope,
    },
    {
        titleKey: 'tool_pest',
        href: '/pest-detection',
        icon: Tractor,
    },
    {
        titleKey: 'tool_fertilizer',
        href: '/fertilizer-recommendation',
        icon: TestTube2,
    },
    {
        titleKey: 'tool_schemes',
        href: '/schemes',
        icon: Landmark,
    },
];

type SideToolCardProps = {
    title: string;
    href: string;
    icon: LucideIcon;
};

function SideToolCard({ title, href, icon: Icon }: SideToolCardProps) {
    return (
        <Link href={href} className="group h-full">
            <Card className="rounded-xl h-28 w-full transition-all duration-300 ease-in-out hover:scale-105 hover:shadow-md hover:border-primary/50 flex flex-col items-center justify-center p-2 bg-card text-card-foreground">
                <CardContent className="p-0 flex flex-col items-center justify-center gap-2">
                    <div className="text-primary p-2 rounded-full bg-primary/10 group-hover:bg-primary/20 transition-colors">
                        <Icon className="h-8 w-8" strokeWidth={1.5} />
                    </div>
                    <span className="font-semibold text-sm text-center text-foreground/90 whitespace-nowrap overflow-hidden text-ellipsis w-full px-1">
                        {title}
                    </span>
                </CardContent>
            </Card>
        </Link>
    );
}

export default function SideNavTools() {
    const { t } = useTranslation();

    return (
        <div className="grid grid-cols-2 gap-3 p-1">
            {tools.map((tool) => (
                <SideToolCard
                    key={tool.titleKey}
                    title={t(tool.titleKey)}
                    href={tool.href}
                    icon={tool.icon}
                />
            ))}
        </div>
    );
}
