import * as UIComponents from '../index';

describe('UI Components Index', () => {
  it('exports all expected components', () => {
    // Button exports
    expect(UIComponents.Button).toBeDefined();
    expect(UIComponents.buttonVariants).toBeDefined();

    // Input exports
    expect(UIComponents.Input).toBeDefined();

    // Card exports
    expect(UIComponents.Card).toBeDefined();
    expect(UIComponents.CardHeader).toBeDefined();
    expect(UIComponents.CardTitle).toBeDefined();
    expect(UIComponents.CardDescription).toBeDefined();
    expect(UIComponents.CardContent).toBeDefined();
    expect(UIComponents.CardFooter).toBeDefined();

    // Skeleton exports
    expect(UIComponents.Skeleton).toBeDefined();
  });

  it('exports are functions/components', () => {
    expect(typeof UIComponents.Button).toBe('object'); // forwardRef returns object
    expect(typeof UIComponents.buttonVariants).toBe('function');
    expect(typeof UIComponents.Input).toBe('object'); // forwardRef returns object
    expect(typeof UIComponents.Card).toBe('object'); // forwardRef returns object
    expect(typeof UIComponents.Skeleton).toBe('object'); // forwardRef returns object
  });
});
