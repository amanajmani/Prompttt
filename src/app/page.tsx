import { Container } from '@/components/container';
import { AuthNav } from '@/components/auth/auth-nav';

export default function Home() {
  return (
    <div className="min-h-screen bg-background py-8 text-foreground md:py-16">
      <Container>
        <div className="space-y-8 md:space-y-12">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <h1 className="text-2xl font-bold md:text-3xl">AI VideoHub</h1>
            </div>
            <AuthNav />
          </div>

          <div className="text-center">
            <p className="mx-auto max-w-2xl text-muted-foreground">
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
