import { Container } from '@/components/container';

export default function Home() {
  return (
    <main className="min-h-screen bg-background py-8 text-foreground md:py-16">
      <Container>
        <div className="space-y-8 text-center md:space-y-12">
          <h1>AI VideoHub</h1>

          <p className="mx-auto max-w-2xl text-muted-foreground">
            The definitive, curated gallery for the world&apos;s best
            AI-generated video art. Built with obsessive craft, layer by layer.
          </p>
        </div>
      </Container>
    </main>
  );
}
