// Core components
export { Container } from './container';
export { Header } from './header';
export { Footer } from './footer';
export { Logo } from './logo';
export { DesktopNav } from './desktop-nav';
export { ThemeProvider, useTheme } from './theme-provider';
export { ThemeToggle } from './theme-toggle';
export { ThemeAwareImage } from './theme-aware-image';

// World-class authentication exports
export { WorldClassAuthProvider, useWorldClassAuth } from './auth/supabase-auth-provider';
export { WorldClassAuthNav } from './auth/world-class-auth-nav';

// Auth components
export { SupabaseAuthProvider } from './auth/supabase-auth-provider';
export { LogoutButton } from './auth/logout-button';
export { AuthNav } from './auth/auth-nav';

// UI components
export {
  Button,
  buttonVariants,
  Input,
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
  CardFooter,
  Skeleton,
  Dialog,
  DialogPortal,
  DialogOverlay,
  DialogClose,
  DialogTrigger,
  DialogContent,
  DialogHeader,
  DialogFooter,
  DialogTitle,
  DialogDescription,
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuCheckboxItem,
  DropdownMenuRadioItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuShortcut,
  DropdownMenuGroup,
  DropdownMenuPortal,
  DropdownMenuSub,
  DropdownMenuSubContent,
  DropdownMenuSubTrigger,
  DropdownMenuRadioGroup,
  Toaster,
  ErrorBoundary,
} from './ui';
export type { ErrorBoundaryProps } from './ui';
