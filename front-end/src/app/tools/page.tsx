
import DashboardHeader from '@/components/dashboard/header';
import ToolGrid from '@/components/dashboard/tool-grid';
import PageHeader from '@/components/shared/page-header';

export default function ToolsPage() {
    return (
        <div className="space-y-8">
            <PageHeader title="More Tools" />
            <section>
                <ToolGrid />
            </section>
        </div>
    );
}
