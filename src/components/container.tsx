import { cn } from '@/lib/utils';

interface ContainerProps {
  children: React.ReactNode;
  className?: string;
}

export function Container({ children, className }: ContainerProps) {
  return (
    <div
      className={cn(
        'mx-auto max-w-7xl px-4 sm:px-6 md:px-8 lg:px-12',
        className
      )}
    >
      {children}
    </div>
  );
}
