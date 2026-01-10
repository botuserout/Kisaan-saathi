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
import ToolCard from './tool-card';

const tools = [
  {
    title: 'AI Assistant',
    description: 'Ask me anything',
    href: '/voice-assistant',
    icon: Mic,
  },
  {
    title: 'Chat Support',
    description: 'Get instant help',
    href: '/chat',
    icon: BotMessageSquare,
  },
  {
    title: 'Crop Recommendation',
    description: 'Find the best crops',
    href: '/crop-recommendation',
    icon: Sprout,
  },
  {
    title: 'Yield Prediction',
    description: 'Estimate your harvest',
    href: '/yield-prediction',
    icon: LineChart,
  },
  {
    title: 'Disease Detection',
    description: 'Identify plant diseases',
    href: '/disease-detection',
    icon: Stethoscope,
  },
  {
    title: 'Pest Detection',
    description: 'Find and control pests',
    href: '/pest-detection',
    icon: Tractor,
  },
  {
    title: 'Fertilizer Info',
    description: 'Optimize soil nutrients',
    href: '/fertilizer-recommendation',
    icon: TestTube2,
  },
  {
    title: 'Govt. Schemes',
    description: 'Loans and subsidies',
    href: '/schemes',
    icon: Landmark,
  },
];

export default function ToolGrid() {
  return (
    <div className="grid grid-cols-1 xs:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
      {tools.map((tool) => (
        <ToolCard
          key={tool.title}
          title={tool.title}
          description={tool.description}
          href={tool.href}
          icon={tool.icon}
        />
      ))}
    </div>
  );
}
