import PageHeader from '@/components/shared/page-header';
import DiseaseDetectionClient from '@/components/features/disease-detection/disease-detection-client';
import AuthGuard from '@/components/auth/auth-guard';

export const metadata = {
  title: 'Disease Detection',
};

export default function DiseaseDetectionPage() {
  return (
    <AuthGuard>
      <div>
        <PageHeader title="Disease Detection" />
        <DiseaseDetectionClient />
      </div>
    </AuthGuard>
  );
}
