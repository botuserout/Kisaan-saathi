
import PageHeader from '@/components/shared/page-header';
import { Card, CardContent } from '@/components/ui/card';
import { Bell } from 'lucide-react';

export default function AlertsPage() {
    return (
        <div className="space-y-6">
            <PageHeader title="Alerts" />
            <Card>
                <CardContent className="flex flex-col items-center justify-center p-8 text-center text-muted-foreground">
                    <Bell className="h-12 w-12 mb-4 opacity-50" />
                    <p>No new alerts at this time.</p>
                    <p className="text-sm">Weather and crop warnings will appear here.</p>
                </CardContent>
            </Card>
        </div>
    );
}
