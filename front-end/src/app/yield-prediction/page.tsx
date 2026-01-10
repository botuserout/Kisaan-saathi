import PageHeader from '@/components/shared/page-header';
import YieldPredictionClient from '@/components/features/yield-prediction/yield-prediction-client';

export const metadata = {
  title: 'Yield Prediction',
};

export default function YieldPredictionPage() {
  return (
    <div>
      <PageHeader title="Yield Prediction" />
      <YieldPredictionClient />
    </div>
  );
}
