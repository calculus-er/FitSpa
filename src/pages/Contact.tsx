import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { ParallaxSection } from "@/components/ParallaxSection";
import {
  ArrowRight,
  Mail,
  Phone,
  MapPin,
  Clock,
  MessageSquare,
  Youtube,
  Instagram,
} from "lucide-react";

const contactChannels = [
  {
    icon: Mail,
    title: "Email support",
    value: "support@fitspa.ai",
    description: "Avg. response < 2 hours",
  },
  {
    icon: Phone,
    title: "Coach hotline",
    value: "+1 (415) 555-0190",
    description: "Mon–Sat · 6am – 10pm PST",
  },
  {
    icon: MapPin,
    title: "Experience lab",
    value: "San Francisco · São Paulo",
    description: "Book a live studio session",
  },
];

const socialLinks = [
  { icon: Youtube, label: "YouTube", handle: "@fitspa" },
  { icon: Instagram, label: "Instagram", handle: "@fitspa.ai" },
  { icon: MessageSquare, label: "Community", handle: "discord.gg/fitspa" },
];

const Contact = () => {
  return (
    <main className="min-h-screen bg-background text-foreground">
      {/* Hero */}
      <section className="relative overflow-hidden bg-gradient-hero">
        <div className="absolute inset-0 bg-gradient-mesh opacity-30" />
        <ParallaxSection speed={0.25} className="absolute inset-0 opacity-30">
          <div className="w-full h-full bg-[radial-gradient(circle,_rgba(14,165,233,0.25)_0%,_rgba(15,23,42,0)_65%)]" />
        </ParallaxSection>

        <div className="relative z-10 container mx-auto px-6 py-24 text-center">
          <Badge className="mb-6 bg-primary/10 text-primary border border-primary/30 w-fit mx-auto">
            We reply fast
          </Badge>
          <h1 className="text-4xl md:text-6xl font-bold mb-6">
            Let’s build your{" "}
            <span className="bg-gradient-to-r from-primary via-primary-glow to-accent bg-clip-text text-transparent">
              strongest season
            </span>
          </h1>
          <p className="text-lg md:text-xl text-muted-foreground max-w-3xl mx-auto">
            From onboarding questions to elite studio setups, our product
            designers and AI coaches are a message away.
          </p>
        </div>
      </section>

      {/* Contact grid */}
      <section className="container mx-auto px-6 py-16 grid lg:grid-cols-2 gap-10">
        <div className="space-y-6">
          {contactChannels.map((channel) => (
            <Card
              key={channel.title}
              className="border-border bg-card/80 backdrop-blur-xl hover:-translate-y-1 transition-all duration-300"
            >
              <CardHeader className="flex flex-row items-center gap-4">
                <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center text-primary">
                  <channel.icon className="h-5 w-5" />
                </div>
                <div>
                  <CardTitle className="text-xl">{channel.title}</CardTitle>
                  <p className="text-lg">{channel.value}</p>
                  <p className="text-sm text-muted-foreground">
                    {channel.description}
                  </p>
                </div>
              </CardHeader>
            </Card>
          ))}

          <Card className="border-border bg-card/70 backdrop-blur-xl">
            <CardContent className="flex items-center gap-4 py-6">
              <Clock className="h-10 w-10 text-primary" />
              <div>
                <p className="text-sm uppercase tracking-widest text-muted-foreground">
                  Response time
                </p>
                <p className="text-2xl font-semibold">98% within 5 minutes</p>
                <p className="text-muted-foreground">
                  Dedicated Slack + email for Pro and Elite studios.
                </p>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Contact form */}
        <Card className="border-border bg-card/80 backdrop-blur-xl shadow-elegant">
          <CardHeader>
            <CardTitle className="text-2xl">Tell us about your goals</CardTitle>
            <p className="text-muted-foreground">
              We’ll reply with a custom action plan and live demo link.
            </p>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid md:grid-cols-2 gap-4">
              <Input placeholder="Full name" className="bg-secondary border-border" />
              <Input placeholder="Company or studio" className="bg-secondary border-border" />
            </div>
            <Input
              type="email"
              placeholder="Email address"
              className="bg-secondary border-border"
            />
            <Input
              placeholder="Phone or WhatsApp (optional)"
              className="bg-secondary border-border"
            />
            <Textarea
              placeholder="Share your current training workflow and goals..."
              className="bg-secondary border-border min-h-[140px]"
            />
            <div className="flex flex-col sm:flex-row gap-4 items-center">
              <Button variant="hero" className="w-full sm:w-auto">
                Send message
                <ArrowRight className="h-4 w-4 ml-2" />
              </Button>
              <p className="text-xs text-muted-foreground">
                By submitting, you agree to receive product updates and can
                unsubscribe anytime.
              </p>
            </div>
          </CardContent>
        </Card>
      </section>

      {/* Social proof */}
      <section className="py-16 bg-secondary/30">
        <div className="container mx-auto px-6 grid md:grid-cols-3 gap-6">
          {socialLinks.map((social) => (
            <Card
              key={social.label}
              className="border border-border bg-card/80 backdrop-blur-xl hover:-translate-y-1 transition-all"
            >
              <CardContent className="flex items-center gap-4 py-6">
                <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center text-primary">
                  <social.icon className="h-5 w-5" />
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">{social.label}</p>
                  <p className="font-semibold">{social.handle}</p>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </section>
    </main>
  );
};

export default Contact;

