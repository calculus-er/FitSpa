import { ParallaxSection } from '@/components/ParallaxSection';
import { Activity, Brain, TrendingUp, Camera } from 'lucide-react';
import aiTracking from '@/assets/ai-tracking.jpg';
import feedback from '@/assets/feedback.jpg';
import analytics from '@/assets/analytics.jpg';

const features = [
  {
    icon: Camera,
    title: 'Real-Time Tracking',
    description: 'Advanced AI analyzes your form through your camera, tracking every movement with precision.',
    image: aiTracking,
    color: 'primary',
  },
  {
    icon: Brain,
    title: 'Smart Feedback',
    description: 'Instant voice guidance helps you correct your posture and optimize every rep for maximum results.',
    image: feedback,
    color: 'accent',
  },
  {
    icon: TrendingUp,
    title: 'Performance Analytics',
    description: 'Track your progress with detailed insights, charts, and personalized recommendations.',
    image: analytics,
    color: 'success',
  },
];

export const Features = () => {
  return (
    <section className="py-32 px-6 relative overflow-hidden">
      <div className="absolute inset-0 bg-gradient-mesh opacity-30" />
      
      <div className="container mx-auto relative z-10">
        <ParallaxSection speed={0.2}>
          <div className="text-center mb-20">
            <h2 className="text-5xl md:text-6xl font-bold mb-6 bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
              Intelligent Training Features
            </h2>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Experience the future of fitness with AI-powered technology
            </p>
          </div>
        </ParallaxSection>

        <div className="grid md:grid-cols-3 gap-8">
          {features.map((feature, index) => (
            <ParallaxSection key={index} speed={0.1 * (index + 1)}>
              <div 
                className="group relative bg-card rounded-2xl p-8 border border-border hover:border-primary/50 transition-all duration-500 hover:shadow-elegant hover:-translate-y-2"
                style={{ animationDelay: `${index * 0.2}s` }}
              >
                {/* Feature Image */}
                <div className="relative h-48 -mx-8 -mt-8 mb-6 rounded-t-2xl overflow-hidden">
                  <img 
                    src={feature.image} 
                    alt={feature.title}
                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-card to-transparent" />
                </div>

                {/* Icon */}
                <div className={`inline-flex p-3 rounded-xl bg-${feature.color}/10 mb-6 group-hover:scale-110 transition-transform duration-300`}>
                  <feature.icon className={`w-6 h-6 text-${feature.color}`} />
                </div>

                {/* Content */}
                <h3 className="text-2xl font-bold mb-4 group-hover:text-primary transition-colors">
                  {feature.title}
                </h3>
                <p className="text-muted-foreground leading-relaxed">
                  {feature.description}
                </p>

                {/* Hover Glow Effect */}
                <div className="absolute inset-0 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none">
                  <div className={`absolute inset-0 bg-${feature.color}/5 rounded-2xl blur-xl`} />
                </div>
              </div>
            </ParallaxSection>
          ))}
        </div>
      </div>
    </section>
  );
};
