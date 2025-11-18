import { Button } from '@/components/ui/button';
import { ParallaxSection } from '@/components/ParallaxSection';
import { ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';

export const CTA = () => {
  return (
    <section className="py-32 px-6 relative overflow-hidden">
      <div className="absolute inset-0 bg-gradient-mesh" />
      
      <ParallaxSection speed={0.3}>
        <div className="container mx-auto relative z-10">
          <div className="max-w-4xl mx-auto text-center bg-card/50 backdrop-blur-xl rounded-3xl p-16 border border-border shadow-elegant">
            <h2 className="text-5xl md:text-6xl font-bold mb-6">
              Ready to Transform Your
              <span className="bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent"> Fitness Journey?</span>
            </h2>
            <p className="text-xl text-muted-foreground mb-10 max-w-2xl mx-auto">
              Join thousands of users who are already achieving their fitness goals with AI-powered coaching.
            </p>
            <Link to="/auth">
              <Button variant="hero" size="xl" className="group">
                Start Free Today
                <ArrowRight className="w-5 h-5 transition-transform group-hover:translate-x-1" />
              </Button>
            </Link>
          </div>
        </div>
      </ParallaxSection>
    </section>
  );
};
