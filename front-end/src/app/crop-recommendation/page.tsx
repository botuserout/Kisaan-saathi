import PageHeader from '@/components/shared/page-header';
import CropRecommendationClient from '@/components/features/crop-recommendation/crop-recommendation-client';
import AuthGuard from '@/components/auth/auth-guard';

export const metadata = {
  title: 'Crop Recommendation',
};

export default function CropRecommendationPage() {
  return (
    <AuthGuard>
      <div>
        <PageHeader title="Crop Recommendation" />
        <CropRecommendationClient />
      </div>
    </AuthGuard>
  );
}
