import { ParallaxSection } from '@/components/ParallaxSection';
import { Camera, Zap, BarChart3, CheckCircle } from 'lucide-react';

const steps = [
  {
    icon: Camera,
    title: 'Enable Camera',
    description: 'Grant camera access to begin tracking your movements',
    step: '01',
  },
  {
    icon: Zap,
    title: 'Start Exercising',
    description: 'Choose your exercise and our AI starts tracking in real-time',
    step: '02',
  },
  {
    icon: CheckCircle,
    title: 'Get Feedback',
    description: 'Receive instant voice guidance on form and posture',
    step: '03',
  },
  {
    icon: BarChart3,
    title: 'Track Progress',
    description: 'View detailed analytics and improve over time',
    step: '04',
  },
];

export const HowItWorks = () => {
  return (
    <section className="py-32 px-6 relative overflow-hidden bg-gradient-to-b from-background to-secondary/20">
      <div className="container mx-auto relative z-10">
        <ParallaxSection speed={0.2}>
          <div className="text-center mb-20">
            <h2 className="text-5xl md:text-6xl font-bold mb-6">
              How It <span className="bg-gradient-to-r from-accent to-accent-glow bg-clip-text text-transparent">Works</span>
            </h2>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Get started in minutes and experience AI-powered fitness coaching
            </p>
          </div>
        </ParallaxSection>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8 max-w-6xl mx-auto">
          {steps.map((step, index) => (
            <ParallaxSection key={index} speed={0.15 - index * 0.02}>
              <div 
                className="relative group animate-fade-in"
                style={{ animationDelay: `${index * 0.15}s` }}
              >
                {/* Step Number */}
                <div className="absolute -top-6 -left-6 text-8xl font-bold text-primary/10 group-hover:text-primary/20 transition-colors">
                  {step.step}
                </div>

                {/* Card */}
                <div className="relative bg-card border border-border rounded-2xl p-8 hover:border-accent/50 transition-all duration-500 hover:shadow-accent-glow hover:-translate-y-2">
                  {/* Icon */}
                  <div className="inline-flex p-4 rounded-xl bg-accent/10 mb-6 group-hover:scale-110 transition-transform duration-300">
                    <step.icon className="w-8 h-8 text-accent" />
                  </div>

                  {/* Content */}
                  <h3 className="text-xl font-bold mb-3 group-hover:text-accent transition-colors">
                    {step.title}
                  </h3>
                  <p className="text-muted-foreground text-sm leading-relaxed">
                    {step.description}
                  </p>
                </div>

                {/* Connection Line */}
                {index < steps.length - 1 && (
                  <div className="hidden lg:block absolute top-1/2 -right-4 w-8 h-0.5 bg-gradient-to-r from-accent/50 to-transparent" />
                )}
              </div>
            </ParallaxSection>
          ))}
        </div>
      </div>
    </section>
  );
};
