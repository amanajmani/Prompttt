'use client'

import { useState } from 'react'
import { 
  Modal,
  ConfirmDialog,
  Header,
  Container,
  Grid,
  Stack,
  Flex,
  Section,
  Divider,
  Form,
  FormField,
  FormInput,
  FormTextarea,
  FormSubmit,
  Button,
  Card,
  CardHeader,
  CardTitle,
  CardContent,
  FadeIn,
  Stagger,
  Scale,
  Bounce,
  Pulse,
  Reveal,
  ThemeToggle
} from '@/components/ui'
import { Play, Heart, Upload, Download, Settings, User } from 'lucide-react'

export default function AdvancedComponentsPage() {
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [isConfirmOpen, setIsConfirmOpen] = useState(false)

  const handleFormSubmit = async (data: FormData) => {
    console.log('Form submitted:', data)
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 2000))
    alert('Form submitted successfully!')
  }

  const handleConfirm = () => {
    console.log('Action confirmed!')
    setIsConfirmOpen(false)
  }

  return (
    <div className="min-h-screen bg-primary-bg">
      {/* Header Component Demo */}
      <Header 
        showSearch={true}
        onSearchClick={() => console.log('Search clicked')}
      />

      <Container size="xl" padding="lg">
        {/* Page Header */}
        <Section padding="md">
          <FadeIn>
            <div className="text-center">
              <h1 className="font-heading font-bold text-2xl sm:text-3xl lg:text-4xl text-high mb-4">
                Advanced Components & Patterns
              </h1>
              <p className="text-medium text-sm sm:text-base lg:text-lg mb-6">
                Milestone 6: Complete component library with modals, navigation, forms, layouts, and animations
              </p>
              <div className="flex justify-center">
                <ThemeToggle />
              </div>
            </div>
          </FadeIn>
        </Section>

        <Divider />

        {/* Modal & Dialog Components */}
        <Section padding="md">
          <Reveal>
            <h2 className="font-heading font-bold text-xl sm:text-2xl text-high mb-4 sm:mb-6 text-center sm:text-left">
              Modal & Dialog Components
            </h2>
          </Reveal>
          
          <Stagger staggerDelay={150}>
            <div>
              <h3 className="font-heading font-semibold text-lg text-high mb-4">Modal System</h3>
              <Flex gap="md" wrap={true}>
                <Button onClick={() => setIsModalOpen(true)}>
                  Open Modal
                </Button>
                <Button 
                  variant="destructive" 
                  onClick={() => setIsConfirmOpen(true)}
                >
                  Delete Item
                </Button>
              </Flex>
            </div>

            <Card>
              <CardHeader>
                <CardTitle>Modal Features</CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2 text-medium">
                  <li>• Accessible with proper focus management</li>
                  <li>• Mobile-first responsive design</li>
                  <li>• Backdrop blur and overlay click handling</li>
                  <li>• Escape key support</li>
                  <li>• Multiple sizes (sm, md, lg, xl, full)</li>
                  <li>• Confirmation dialogs with loading states</li>
                </ul>
              </CardContent>
            </Card>
          </Stagger>
        </Section>

        <Divider />

        {/* Layout Components */}
        <Section padding="md">
          <Reveal>
            <h2 className="font-heading font-bold text-xl sm:text-2xl text-high mb-4 sm:mb-6 text-center sm:text-left">
              Layout Components
            </h2>
          </Reveal>

          <Stagger staggerDelay={100}>
            <div>
              <h3 className="font-heading font-semibold text-lg text-high mb-4">Grid System</h3>
              <Grid cols={4} gap="md">
                <Scale trigger="hover">
                  <Card className="h-24 flex items-center justify-center">
                    <span className="text-medium">Grid 1</span>
                  </Card>
                </Scale>
                <Scale trigger="hover">
                  <Card className="h-24 flex items-center justify-center">
                    <span className="text-medium">Grid 2</span>
                  </Card>
                </Scale>
                <Scale trigger="hover">
                  <Card className="h-24 flex items-center justify-center">
                    <span className="text-medium">Grid 3</span>
                  </Card>
                </Scale>
                <Scale trigger="hover">
                  <Card className="h-24 flex items-center justify-center">
                    <span className="text-medium">Grid 4</span>
                  </Card>
                </Scale>
              </Grid>
            </div>

            <div>
              <h3 className="font-heading font-semibold text-lg text-high mb-4">Flex Layouts</h3>
              <Stack spacing="md">
                <Flex justify="between" align="center" className="p-4 bg-secondary-surface rounded-lg">
                  <span className="text-high font-medium">Space Between</span>
                  <Button size="sm">Action</Button>
                </Flex>
                <Flex justify="center" gap="md" className="p-4 bg-secondary-surface rounded-lg">
                  <Button size="sm" variant="outline">Cancel</Button>
                  <Button size="sm">Confirm</Button>
                </Flex>
              </Stack>
            </div>
          </Stagger>
        </Section>

        <Divider />

        {/* Form Components */}
        <Section padding="md">
          <Reveal>
            <h2 className="font-heading font-bold text-xl sm:text-2xl text-high mb-4 sm:mb-6 text-center sm:text-left">
              Advanced Form System
            </h2>
          </Reveal>

          <Grid cols={2} gap="lg">
            <FadeIn delay={200}>
              <Card>
                <CardHeader>
                  <CardTitle>Contact Form</CardTitle>
                </CardHeader>
                <CardContent>
                  <Form onSubmit={handleFormSubmit}>
                    <FormField name="name" label="Full Name" required>
                      <FormInput
                        name="name"
                        placeholder="Enter your name"
                        required
                      />
                    </FormField>

                    <FormField name="email" label="Email Address" required>
                      <FormInput
                        name="email"
                        type="email"
                        placeholder="Enter your email"
                        required
                      />
                    </FormField>

                    <FormField name="category" label="Category" required>
                      <select
                        name="category"
                        className="w-full h-10 px-3 text-sm border border-border rounded-lg transition-colors bg-transparent text-high focus:outline-none focus:ring-2 focus:ring-accent focus:border-transparent"
                        required
                      >
                        <option value="">Select category</option>
                        <option value="general">General Inquiry</option>
                        <option value="support">Technical Support</option>
                        <option value="feedback">Feedback</option>
                      </select>
                    </FormField>

                    <FormField name="message" label="Message" required>
                      <FormTextarea
                        name="message"
                        placeholder="Enter your message"
                        rows={4}
                        required
                      />
                    </FormField>

                    <FormSubmit>Send Message</FormSubmit>
                  </Form>
                </CardContent>
              </Card>
            </FadeIn>

            <FadeIn delay={400}>
              <Card>
                <CardHeader>
                  <CardTitle>Form Features</CardTitle>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-2 text-medium">
                    <li>• Real-time validation with error states</li>
                    <li>• Touch-friendly mobile inputs (16px font)</li>
                    <li>• Loading states and submission handling</li>
                    <li>• Accessible labels and error announcements</li>
                    <li>• File upload with drag & drop</li>
                    <li>• Custom validation rules</li>
                    <li>• Form context for complex forms</li>
                  </ul>
                </CardContent>
              </Card>
            </FadeIn>
          </Grid>
        </Section>

        <Divider />

        {/* Animation Components */}
        <Section padding="md">
          <Reveal>
            <h2 className="font-heading font-bold text-xl sm:text-2xl text-high mb-4 sm:mb-6 text-center sm:text-left">
              Animation System
            </h2>
          </Reveal>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
              <Card className="text-center p-4 sm:p-6">
                <div className="w-12 h-12 sm:w-16 sm:h-16 bg-accent rounded-full mx-auto mb-3 sm:mb-4 flex items-center justify-center animate-bounce">
                  <Play className="text-white" size={20} />
                </div>
                <h3 className="font-heading font-semibold text-high mb-2 text-sm sm:text-base">Bounce Animation</h3>
                <p className="text-medium text-xs sm:text-sm">Attention-grabbing bounce effect</p>
              </Card>

              <Card className="text-center p-4 sm:p-6">
                <div className="w-12 h-12 sm:w-16 sm:h-16 bg-green-500 rounded-full mx-auto mb-3 sm:mb-4 flex items-center justify-center animate-pulse">
                  <Heart className="text-white" size={20} />
                </div>
                <h3 className="font-heading font-semibold text-high mb-2 text-sm sm:text-base">Pulse Animation</h3>
                <p className="text-medium text-xs sm:text-sm">Subtle pulsing for notifications</p>
              </Card>

              <Card className="text-center p-4 sm:p-6 sm:col-span-2 lg:col-span-1">
                <Scale trigger="hover" scale={1.1}>
                  <div className="w-12 h-12 sm:w-16 sm:h-16 bg-purple-500 rounded-full mx-auto mb-3 sm:mb-4 flex items-center justify-center">
                    <Upload className="text-white" size={20} />
                  </div>
                </Scale>
                <h3 className="font-heading font-semibold text-high mb-2 text-sm sm:text-base">Scale Animation</h3>
                <p className="text-medium text-xs sm:text-sm">Hover to see scale effect</p>
              </Card>
            </div>
          </Stagger>

          <div className="mt-6 sm:mt-8">
            <h3 className="font-heading font-semibold text-base sm:text-lg text-high mb-3 sm:mb-4">Stagger Animation</h3>
            <div className="space-y-3">
              <Card className="p-3 sm:p-4 animate-in fade-in slide-in-from-left duration-500 delay-0">
                <Flex align="center" gap="sm" className="gap-3 sm:gap-4">
                  <div className="w-10 h-10 sm:w-12 sm:h-12 bg-accent rounded-lg flex items-center justify-center flex-shrink-0">
                    <Download className="text-white" size={16} />
                  </div>
                  <div className="min-w-0">
                    <h4 className="font-medium text-high text-sm sm:text-base">Item 1</h4>
                    <p className="text-xs sm:text-sm text-medium">Staggered animation item</p>
                  </div>
                </Flex>
              </Card>
              <Card className="p-3 sm:p-4 animate-in fade-in slide-in-from-left duration-500 delay-150">
                <Flex align="center" gap="sm" className="gap-3 sm:gap-4">
                  <div className="w-10 h-10 sm:w-12 sm:h-12 bg-green-500 rounded-lg flex items-center justify-center flex-shrink-0">
                    <Settings className="text-white" size={16} />
                  </div>
                  <div className="min-w-0">
                    <h4 className="font-medium text-high text-sm sm:text-base">Item 2</h4>
                    <p className="text-xs sm:text-sm text-medium">Staggered animation item</p>
                  </div>
                </Flex>
              </Card>
              <Card className="p-3 sm:p-4 animate-in fade-in slide-in-from-left duration-500 delay-300">
                <Flex align="center" gap="sm" className="gap-3 sm:gap-4">
                  <div className="w-10 h-10 sm:w-12 sm:h-12 bg-purple-500 rounded-lg flex items-center justify-center flex-shrink-0">
                    <User className="text-white" size={16} />
                  </div>
                  <div className="min-w-0">
                    <h4 className="font-medium text-high text-sm sm:text-base">Item 3</h4>
                    <p className="text-xs sm:text-sm text-medium">Staggered animation item</p>
                  </div>
                </Flex>
              </Card>
            </div>
          </div>
        </Section>

        {/* Footer */}
        <Section padding="md">
          <FadeIn>
            <div className="text-center pt-6 sm:pt-8 border-t border-border">
              <h2 className="font-heading font-bold text-accent mb-2 text-lg sm:text-xl">
                Milestone 6: Advanced Components & Patterns - COMPLETE
              </h2>
              <p className="text-medium text-sm sm:text-base">
                Production-ready component library with modals, navigation, forms, layouts, and animations
              </p>
            </div>
          </FadeIn>
        </Section>
      </Container>

      {/* Modal Examples */}
      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title="Example Modal"
        description="This is a demonstration of the modal component"
        size="md"
      >
        <div className="space-y-4">
          <p className="text-medium">
            This modal demonstrates the complete modal system with proper accessibility,
            focus management, and mobile-first responsive design.
          </p>
          <div className="flex gap-3 justify-end">
            <Button variant="outline" onClick={() => setIsModalOpen(false)}>
              Cancel
            </Button>
            <Button onClick={() => setIsModalOpen(false)}>
              Confirm
            </Button>
          </div>
        </div>
      </Modal>

      <ConfirmDialog
        isOpen={isConfirmOpen}
        onClose={() => setIsConfirmOpen(false)}
        onConfirm={handleConfirm}
        title="Delete Item"
        description="Are you sure you want to delete this item? This action cannot be undone."
        confirmText="Delete"
        cancelText="Cancel"
        variant="destructive"
      />
    </div>
  )
}