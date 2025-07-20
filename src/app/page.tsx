import { Container } from '@/components/container';

export default function Home() {
  return (
    <div className="min-h-[calc(100vh-4rem)] bg-background py-8 text-foreground md:py-16">
      <Container>
        <div className="space-y-8 md:space-y-12">
          <div className="text-center">
            <h1 className="mb-4 text-4xl font-bold md:text-5xl lg:text-6xl">
              Welcome to AI VideoHub
            </h1>
            <p className="mx-auto max-w-2xl text-lg text-muted-foreground md:text-xl">
              The definitive, curated gallery for the world&apos;s best
              AI-generated video art. Built with obsessive craft, layer by
              layer.
            </p>
          </div>
        </div>
      </Container>
    </div>
  );
}
