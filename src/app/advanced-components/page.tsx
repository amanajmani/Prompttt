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
  FormSelect,
  FormSubmit,
  Button,
  Card,
  CardHeader,
  CardTitle,
  CardContent,
  FadeIn,
  Stagger,
  Scale,
  Slide,
  Bounce,
  Pulse,
  Reveal,
  ThemeToggle
} from '@/components/ui'
import { Play, Heart, Upload, Download, Settings, User } from 'lucide-react'

export default function AdvancedComponentsPage() {
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [isConfirmOpen, setIsConfirmOpen] = useState(false)
  const [formData, setFormData] = useState<any>({})

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
        <Section padding="lg">
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
        <Section padding="lg">
          <Reveal>
            <h2 className="font-heading font-bold text-xl sm:text-2xl text-high mb-6">
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
        <Section padding="lg">
          <Reveal>
            <h2 className="font-heading font-bold text-xl sm:text-2xl text-high mb-6">
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
        <Section padding="lg">
          <Reveal>
            <h2 className="font-heading font-bold text-xl sm:text-2xl text-high mb-6">
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
                    <FormField>
                      <FormInput
                        name="name"
                        label="Full Name"
                        placeholder="Enter your name"
                        required
                      />
                    </FormField>

                    <FormField>
                      <FormInput
                        name="email"
                        type="email"
                        label="Email Address"
                        placeholder="Enter your email"
                        required
                      />
                    </FormField>

                    <FormField>
                      <FormSelect
                        name="category"
                        label="Category"
                        placeholder="Select category"
                        options={[
                          { value: 'general', label: 'General Inquiry' },
                          { value: 'support', label: 'Technical Support' },
                          { value: 'feedback', label: 'Feedback' }
                        ]}
                        required
                      />
                    </FormField>

                    <FormField>
                      <FormTextarea
                        name="message"
                        label="Message"
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
        <Section padding="lg">
          <Reveal>
            <h2 className="font-heading font-bold text-xl sm:text-2xl text-high mb-6">
              Animation System
            </h2>
          </Reveal>

          <Grid cols={3} gap="lg">
            <Slide direction="left" delay={100}>
              <Card className="text-center p-6">
                <Bounce intensity="normal" delay={500}>
                  <div className="w-16 h-16 bg-accent rounded-full mx-auto mb-4 flex items-center justify-center">
                    <Play className="text-white" size={24} />
                  </div>
                </Bounce>
                <h3 className="font-heading font-semibold text-high mb-2">Bounce Animation</h3>
                <p className="text-medium text-sm">Attention-grabbing bounce effect</p>
              </Card>
            </Slide>

            <Slide direction="up" delay={200}>
              <Card className="text-center p-6">
                <Pulse intensity="normal" color="rgba(0, 169, 255, 0.2)">
                  <div className="w-16 h-16 bg-green-500 rounded-full mx-auto mb-4 flex items-center justify-center">
                    <Heart className="text-white" size={24} />
                  </div>
                </Pulse>
                <h3 className="font-heading font-semibold text-high mb-2">Pulse Animation</h3>
                <p className="text-medium text-sm">Subtle pulsing for notifications</p>
              </Card>
            </Slide>

            <Slide direction="right" delay={300}>
              <Card className="text-center p-6">
                <Scale trigger="hover" scale={1.1}>
                  <div className="w-16 h-16 bg-purple-500 rounded-full mx-auto mb-4 flex items-center justify-center">
                    <Upload className="text-white" size={24} />
                  </div>
                </Scale>
                <h3 className="font-heading font-semibold text-high mb-2">Scale Animation</h3>
                <p className="text-medium text-sm">Hover to see scale effect</p>
              </Card>
            </Slide>
          </Grid>

          <div className="mt-8">
            <h3 className="font-heading font-semibold text-lg text-high mb-4">Stagger Animation</h3>
            <Stagger staggerDelay={100}>
              <Card className="p-4">
                <Flex align="center" gap="md">
                  <div className="w-12 h-12 bg-accent rounded-lg flex items-center justify-center">
                    <Download className="text-white" size={20} />
                  </div>
                  <div>
                    <h4 className="font-medium text-high">Item 1</h4>
                    <p className="text-sm text-medium">Staggered animation item</p>
                  </div>
                </Flex>
              </Card>
              <Card className="p-4">
                <Flex align="center" gap="md">
                  <div className="w-12 h-12 bg-green-500 rounded-lg flex items-center justify-center">
                    <Settings className="text-white" size={20} />
                  </div>
                  <div>
                    <h4 className="font-medium text-high">Item 2</h4>
                    <p className="text-sm text-medium">Staggered animation item</p>
                  </div>
                </Flex>
              </Card>
              <Card className="p-4">
                <Flex align="center" gap="md">
                  <div className="w-12 h-12 bg-purple-500 rounded-lg flex items-center justify-center">
                    <User className="text-white" size={20} />
                  </div>
                  <div>
                    <h4 className="font-medium text-high">Item 3</h4>
                    <p className="text-sm text-medium">Staggered animation item</p>
                  </div>
                </Flex>
              </Card>
            </Stagger>
          </div>
        </Section>

        {/* Footer */}
        <Section padding="lg">
          <FadeIn>
            <div className="text-center pt-8 border-t border-border">
              <h2 className="font-heading font-bold text-accent mb-2">
                Milestone 6: Advanced Components & Patterns - COMPLETE
              </h2>
              <p className="text-medium">
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