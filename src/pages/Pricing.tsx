import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ParallaxSection } from "@/components/ParallaxSection";
import {
  ArrowRight,
  CheckCircle2,
  Sparkles,
  ShieldCheck,
  Zap,
  Star,
} from "lucide-react";

const pricingTiers = [
  {
    name: "Starter",
    price: "Free",
    description: "Explore real-time posture tracking with limited sessions.",
    features: [
      "3 guided workouts / week",
      "Real-time pose feedback",
      "Voice cues & motivation",
      "Activity timeline",
    ],
    cta: "Get Started",
  },
  {
    name: "Pro",
    price: "$29",
    highlight: "Most Popular",
    description: "Unlimited AI coaching, analytics, and personalization.",
    features: [
      "Unlimited workouts",
      "Advanced form analytics",
      "Personalized goals",
      "Rep history & progress charts",
      "Priority support",
    ],
    cta: "Start Pro Trial",
  },
  {
    name: "Elite",
    price: "$59",
    description: "For athletes and studios needing precision insights.",
    features: [
      "Everything in Pro",
      "Coach dashboards",
      "Custom exercise library",
      "Exportable analytics",
      "1:1 onboarding session",
    ],
    cta: "Talk to Sales",
  },
];

const valuePoints = [
  {
    icon: ShieldCheck,
    title: "Human-level accuracy",
    description:
      "MediaPipe precision with continuous calibration for every frame.",
  },
  {
    icon: Sparkles,
    title: "Adaptive guidance",
    description:
      "Custom cues adjust to your pace, form score, and fatigue levels.",
  },
  {
    icon: Zap,
    title: "Instant momentum",
    description:
      "No wearables required—just camera access for immersive training.",
  },
];

const faqs = [
  {
    question: "Can I switch plans anytime?",
    answer:
      "Absolutely. Upgrade or downgrade directly inside the app and changes apply instantly.",
  },
  {
    question: "Do you support teams or studios?",
    answer:
      "Yes. Elite includes multi-seat dashboards. Contact us for custom pricing.",
  },
  {
    question: "Is my data private?",
    answer:
      "Data is encrypted at rest and in transit. Only you control workout history unless shared.",
  },
];

const Pricing = () => {
  return (
    <main className="min-h-screen bg-background text-foreground">
      {/* Hero */}
      <section className="relative overflow-hidden bg-gradient-hero">
        <div className="absolute inset-0 bg-gradient-mesh opacity-30" />
        <ParallaxSection speed={0.2} className="absolute inset-0 opacity-40">
          <div className="w-full h-full bg-[radial-gradient(circle,_rgba(14,165,233,0.2)_0%,_rgba(15,23,42,0)_65%)]" />
        </ParallaxSection>

        <div className="relative z-10 container mx-auto px-6 py-24 text-center">
          <Badge className="mb-6 bg-primary/10 text-primary border border-primary/30 w-fit mx-auto">
            <Sparkles className="h-3.5 w-3.5 mr-2" />
            Flexible plans
          </Badge>
          <h1 className="text-4xl md:text-6xl font-bold mb-6">
            Choose the plan that{" "}
            <span className="bg-gradient-to-r from-primary via-primary-glow to-accent bg-clip-text text-transparent">
              moves with you
            </span>
          </h1>
          <p className="text-lg md:text-xl text-muted-foreground max-w-3xl mx-auto">
            From casual movers to elite athletes, FitSpa adapts to your flow
            with AI posture correction, detailed analytics, and motivating audio
            cues.
          </p>
          <div className="flex flex-col sm:flex-row justify-center gap-4 mt-10">
            <Button variant="hero" size="lg">
              Start free
              <ArrowRight className="h-4 w-4 ml-2" />
            </Button>
            <Button variant="outline" size="lg" className="border-border">
              Compare features
            </Button>
          </div>
        </div>
      </section>

      {/* Pricing cards */}
      <section className="container mx-auto px-6 py-20">
        <div className="grid gap-8 lg:grid-cols-3">
          {pricingTiers.map((tier, idx) => (
            <Card
              key={tier.name}
              className={`relative h-full border-border bg-card/80 backdrop-blur-xl shadow-elegant ${
                tier.highlight
                  ? "ring-2 ring-primary shadow-glow scale-[1.01]"
                  : ""
              }`}
            >
              {tier.highlight && (
                <Badge className="absolute -top-3 left-1/2 -translate-x-1/2 bg-primary text-primary-foreground shadow-glow">
                  {tier.highlight}
                </Badge>
              )}
              <CardHeader>
                <CardTitle className="text-2xl">{tier.name}</CardTitle>
                <CardDescription>{tier.description}</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div>
                  <span className="text-4xl font-bold">{tier.price}</span>
                  {tier.price !== "Free" && (
                    <span className="text-sm text-muted-foreground"> /mo</span>
                  )}
                </div>
                <ul className="space-y-3">
                  {tier.features.map((feature) => (
                    <li key={feature} className="flex items-center gap-2">
                      <CheckCircle2 className="h-4 w-4 text-primary" />
                      <span className="text-sm text-muted-foreground">
                        {feature}
                      </span>
                    </li>
                  ))}
                </ul>
              </CardContent>
              <CardFooter>
                <Button
                  variant={tier.highlight ? "hero" : "outline"}
                  className="w-full"
                >
                  {tier.cta}
                </Button>
              </CardFooter>
            </Card>
          ))}
        </div>
      </section>

      {/* Value props */}
      <section className="py-16 bg-secondary/30">
        <div className="container mx-auto px-6 grid md:grid-cols-3 gap-6">
          {valuePoints.map((point) => (
            <Card
              key={point.title}
              className="border-border bg-card/80 backdrop-blur-xl hover:-translate-y-1 transition-all duration-300"
            >
              <CardHeader className="space-y-3">
                <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center text-primary">
                  <point.icon className="h-5 w-5" />
                </div>
                <CardTitle>{point.title}</CardTitle>
                <CardDescription>{point.description}</CardDescription>
              </CardHeader>
            </Card>
          ))}
        </div>
      </section>

      {/* FAQ */}
      <section className="container mx-auto px-6 py-20">
        <div className="grid lg:grid-cols-2 gap-10 items-start">
          <div>
            <Badge className="mb-4 bg-primary/10 text-primary border border-primary/20">
              FAQs
            </Badge>
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              Everything you need to know
            </h2>
            <p className="text-muted-foreground">
              Still curious? Reach out anytime—our AI coach and human team are
              ready to help you build momentum.
            </p>
            <div className="mt-8 flex gap-4">
              <Button variant="hero">
                Chat with us
                <ArrowRight className="h-4 w-4 ml-2" />
              </Button>
              <Button variant="outline" className="border-border">
                Download brochure
              </Button>
            </div>
          </div>
          <div className="space-y-4">
            {faqs.map((faq) => (
              <Card
                key={faq.question}
                className="border-border bg-card/70 hover:bg-card/90 transition-colors"
              >
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-lg flex items-center gap-3">
                      <Star className="h-4 w-4 text-primary" />
                      {faq.question}
                    </CardTitle>
                  </div>
                  <CardDescription>{faq.answer}</CardDescription>
                </CardHeader>
              </Card>
            ))}
          </div>
        </div>
      </section>
    </main>
  );
};

export default Pricing;

