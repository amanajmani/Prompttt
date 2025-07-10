// Core UI Components - Milestone 5: Component Library Foundation

// Theme System
export { ThemeToggle, ThemeToggleCompact } from './ThemeToggle'

// Button Components
export { 
  Button, 
  PrimaryButton, 
  SecondaryButton, 
  OutlineButton, 
  GhostButton,
  type ButtonProps 
} from './Button'

// Input Components
export { 
  Input, 
  Textarea,
  type InputProps,
  type TextareaProps 
} from './Input'

// Card Components
export { 
  Card, 
  CardHeader, 
  CardTitle, 
  CardDescription, 
  CardContent, 
  CardFooter,
  VideoCard,
  type CardProps,
  type VideoCardProps 
} from './Card'

// Loading Components
export { 
  LoadingSpinner,
  Skeleton,
  LoadingState,
  VideoCardSkeleton,
  ProfileSkeleton,
  ButtonSkeleton,
  TextSkeleton,
  VideoGridSkeleton,
  PageLoading,
  type LoadingSpinnerProps,
  type SkeletonProps,
  type LoadingStateProps 
} from './Loading'

// Modal & Dialog Components
export {
  Modal,
  Dialog,
  ConfirmDialog,
  type ModalProps,
  type DialogProps,
  type ConfirmDialogProps
} from './Modal'

// Dropdown Components
export {
  Dropdown,
  DropdownMenu,
  DropdownMenuItem,
  DropdownSeparator,
  type DropdownProps,
  type DropdownMenuProps,
  type DropdownItem
} from './Dropdown'

// Toast Components
export {
  ToastComponent as Toast,
  ToastProvider,
  ToastContainer,
  useToast,
  useToastActions,
  toast,
  type Toast as ToastType,
  type ToastProps
} from './Toast'

// Error Boundary Components
export {
  ErrorBoundary,
  ErrorState,
  NetworkErrorState,
  NotFoundState,
  PermissionErrorState,
  useErrorHandler
} from './ErrorBoundary'

// Navigation Components
export {
  Header,
  MobileMenu,
  Sidebar,
  Breadcrumb,
  type HeaderProps,
  type MobileMenuProps,
  type SidebarProps,
  type BreadcrumbProps,
  type NavItem,
  type BreadcrumbItem
} from './Navigation'

// Form Components
export {
  Form,
  FormField,
  FormInput,
  FormTextarea,
  FormFileUpload,
  FormSubmit,
  useFormContext,
  type FormProps,
  type FormFieldProps,
  type FormInputProps,
  type FormTextareaProps,
  type FormFileUploadProps,
  type FormSubmitProps
} from './Form'

// Layout Components
export {
  Container,
  Grid,
  Stack,
  Flex,
  Section,
  Divider,
  AspectRatio,
  Center,
  Masonry,
  type ContainerProps,
  type GridProps,
  type StackProps,
  type FlexProps,
  type SectionProps,
  type DividerProps,
  type AspectRatioProps,
  type CenterProps,
  type MasonryProps
} from './Layout'

// Animation Components
export {
  FadeIn,
  Stagger,
  Scale,
  Slide,
  Bounce,
  Pulse,
  PageTransition,
  Reveal,
  type FadeInProps,
  type StaggerProps,
  type ScaleProps,
  type SlideProps,
  type BounceProps,
  type PulseProps,
  type PageTransitionProps,
  type RevealProps
} from './Animation'

// Responsive Image Components
export {
  ResponsiveImage,
  LogoImage,
  IconImage,
  AvatarImage,
  ThumbnailImage,
  HeroImage,
  CardImage,
  type ResponsiveImageProps
} from './ResponsiveImage'