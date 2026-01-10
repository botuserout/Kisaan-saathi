import PageHeader from '@/components/shared/page-header';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { BotMessageSquare, Landmark, LineChart, Mic, Sprout, Stethoscope, TestTube2, Tractor } from 'lucide-react';

export const metadata = {
    title: 'About Krishi Sakhi',
};

const features = [
    {
        icon: Mic,
        title: 'AI Voice Assistant',
        description: 'Get instant farming advice using your voice. Ask questions about crops, weather, and more, and get immediate answers.',
    },
    {
        icon: BotMessageSquare,
        title: 'Chat Support',
        description: 'Engage in a text-based conversation with our AI for detailed guidance on farming practices and government schemes.',
    },
    {
        icon: Stethoscope,
        title: 'AI-Powered Disease Detection',
        description: 'Upload a photo of a plant leaf, and our AI will analyze it to detect potential diseases and suggest organic treatments.',
    },
    {
        icon: Sprout,
        title: 'Smart Crop Recommendation',
        description: 'Receive personalized crop suggestions by providing your farm\'s location, soil analysis, and local weather conditions.',
    },
    {
        icon: LineChart,
        title: 'Crop Yield Prediction',
        description: 'Estimate your potential harvest by inputting data like crop type, farm size, historical yield, and weather patterns.',
    },
    {
        icon: Tractor,
        title: 'Pest Detection',
        description: 'Identify and learn how to manage common agricultural pests by uploading an image for AI analysis. (Feature coming soon)',
    },
    {
        icon: TestTube2,
        title: 'Fertilizer Recommendation',
        description: 'Get tailored fertilizer recommendations based on your specific crop and soil composition. (Feature coming soon)',
    },
    {
        icon: Landmark,
        title: 'Government Schemes',
        description: 'Easily access and learn about the latest government loans, subsidies, and support schemes available to farmers.',
    },
];

export default function AboutPage() {
    return (
        <div className="space-y-8">
            <PageHeader title="About Krishi Sakhi" />
            <Card className="rounded-2xl">
                <CardHeader>
                    <CardTitle className="text-center">Your Smart Farming Assistant</CardTitle>
                </CardHeader>
                <CardContent>
                    <p className="text-center text-muted-foreground">
                        Krishi Sakhi is an AI-powered personal farming assistant designed to empower farmers with data-driven insights and smart technology. Our goal is to make farming more sustainable, profitable, and efficient by providing easy-to-use tools right at your fingertips.
                    </p>
                </CardContent>
            </Card>

            <Card className="rounded-2xl">
                <CardHeader>
                    <CardTitle>Core Features</CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                    {features.map((feature) => {
                        const Icon = feature.icon;
                        return (
                            <div key={feature.title} className="flex items-start gap-4">
                                <div className="bg-muted p-3 rounded-full">
                                    <Icon className="h-6 w-6 text-muted-foreground" />
                                </div>
                                <div>
                                    <h3 className="font-semibold">{feature.title}</h3>
                                    <p className="text-sm text-muted-foreground">{feature.description}</p>
                                </div>
                            </div>
                        );
                    })}
                </CardContent>
            </Card>

            <Card className="rounded-2xl">
                <CardHeader>
                    <CardTitle>Technology Stack</CardTitle>
                </CardHeader>
                <CardContent>
                    <p className="text-muted-foreground">
                        This application is built with a modern, robust tech stack to ensure a high-quality user experience:
                    </p>
                    <ul className="list-disc pl-5 mt-4 space-y-2 text-muted-foreground">
                        <li><strong>Frontend:</strong> Next.js and React with TypeScript</li>
                        <li><strong>UI Components:</strong> ShadCN UI and Tailwind CSS</li>
                        <li><strong>Generative AI:</strong> Google's Gemini models via Genkit</li>
                        <li><strong>Icons:</strong> Lucide React</li>
                    </ul>
                </CardContent>
            </Card>
        </div>
    );
}
