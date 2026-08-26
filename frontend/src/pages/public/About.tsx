import { Seo } from '@/components/shared/Seo';
import { PageHeader } from '@/components/shared/PageHeader';
import { Card, CardContent } from '@/components/ui/card';
import { Shield, TrendingUp, Users } from 'lucide-react';

export default function About() {
  return (
    <>
      <Seo
        title="About InfyBuys"
        description="Learn about our mission to democratize digital acquisitions and build the world's most trusted marketplace."
      />

      <PageHeader
        title="About Us"
        description="We are building the future of digital acquisitions."
        breadcrumbs={[{ label: 'About Us' }]}
      />

      <div className="container mx-auto px-4 py-16">
        <div className="grid md:grid-cols-2 gap-12 items-center mb-24">
          <div>
            <h2 className="text-3xl font-bold mb-6">Our Mission</h2>
            <p className="text-lg text-muted-foreground mb-4">
              Founded in 2024, InfyBuys was born out of frustration with traditional business brokers. High fees, opaque processes, and misaligned incentives plagued the industry.
            </p>
            <p className="text-lg text-muted-foreground">
              Our mission is to create a frictionless, transparent, and secure marketplace where founders can exit on their terms, and acquirers can find high-quality assets with confidence.
            </p>
          </div>
          <div className="rounded-2xl overflow-hidden shadow-xl">
            <img
              src="https://images.unsplash.com/photo-1522071820081-009f0129c71c?q=80&w=2070&auto=format&fit=crop"
              alt="InfyBuys Team"
              className="w-full h-auto"
            />
          </div>
        </div>

        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold mb-4">Our Core Values</h2>
        </div>

        <div className="grid md:grid-cols-3 gap-8">
          <Card className="border-none shadow-md bg-muted/20">
            <CardContent className="p-8 text-center">
              <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-6 text-primary">
                <Shield className="w-8 h-8" />
              </div>
              <h3 className="text-xl font-bold mb-3">Radical Transparency</h3>
              <p className="text-muted-foreground">
                We believe both buyers and sellers deserve complete visibility into metrics, fees, and processes. No hidden agendas.
              </p>
            </CardContent>
          </Card>

          <Card className="border-none shadow-md bg-muted/20">
            <CardContent className="p-8 text-center">
              <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-6 text-primary">
                <TrendingUp className="w-8 h-8" />
              </div>
              <h3 className="text-xl font-bold mb-3">Founder First</h3>
              <p className="text-muted-foreground">
                We design our tools to maximize outcomes for founders who have poured their lives into building their businesses.
              </p>
            </CardContent>
          </Card>

          <Card className="border-none shadow-md bg-muted/20">
            <CardContent className="p-8 text-center">
              <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-6 text-primary">
                <Users className="w-8 h-8" />
              </div>
              <h3 className="text-xl font-bold mb-3">Vetted Community</h3>
              <p className="text-muted-foreground">
                Quality over quantity. We rigorously vet every listing and every buyer to ensure a safe ecosystem.
              </p>
            </CardContent>
          </Card>
        </div>
      </div>
    </>
  );
}
