import { Button } from '@/components/ui/button';
import { ParallaxSection } from '@/components/ParallaxSection';
import { ArrowRight, Sparkles } from 'lucide-react';
import { Link } from 'react-router-dom';
import heroImage from '@/assets/hero-fitness.jpg';

export const Hero = () => {
  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden bg-gradient-hero">
      {/* Animated Background Mesh */}
      <div className="absolute inset-0 bg-gradient-mesh opacity-50" />
      
      {/* Parallax Background Image */}
      <ParallaxSection speed={0.3} className="absolute inset-0 opacity-30">
        <img 
          src={heroImage} 
          alt="AI Fitness" 
          className="w-full h-full object-cover"
        />
      </ParallaxSection>

      {/* Content */}
      <div className="relative z-10 container mx-auto px-6 py-32">
        <div className="max-w-4xl mx-auto text-center">
          <ParallaxSection speed={0.2}>
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 border border-primary/20 mb-8 animate-fade-in">
              <Sparkles className="w-4 h-4 text-primary animate-glow-pulse" />
              <span className="text-sm text-foreground">Powered by Advanced AI</span>
            </div>
          </ParallaxSection>

          <ParallaxSection speed={0.15}>
            <h1 className="text-6xl md:text-7xl lg:text-8xl font-bold mb-6 animate-fade-in-up">
              <span className="bg-gradient-to-r from-primary via-primary-glow to-accent bg-clip-text text-transparent">
                Your AI Fitness
              </span>
              <br />
              <span className="text-foreground">Coach</span>
            </h1>
          </ParallaxSection>

          <ParallaxSection speed={0.1}>
            <p className="text-xl md:text-2xl text-muted-foreground mb-12 max-w-2xl mx-auto animate-fade-in" style={{ animationDelay: '0.2s' }}>
              Real-time posture correction, personalized feedback, and detailed analytics to transform your workouts.
            </p>
          </ParallaxSection>

          <ParallaxSection speed={0.05}>
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center animate-fade-in" style={{ animationDelay: '0.4s' }}>
              <Link to="/auth">
                <Button variant="hero" size="xl" className="group">
                  Get Started
                  <ArrowRight className="w-5 h-5 transition-transform group-hover:translate-x-1" />
                </Button>
              </Link>
              <Button variant="outline" size="xl" className="border-border hover:bg-secondary">
                Learn More
              </Button>
            </div>
          </ParallaxSection>
        </div>
      </div>

      {/* Scroll Indicator */}
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 animate-bounce">
        <div className="w-6 h-10 rounded-full border-2 border-primary/30 flex items-start justify-center p-2">
          <div className="w-1 h-3 rounded-full bg-primary animate-glow-pulse" />
        </div>
      </div>
    </section>
  );
};
