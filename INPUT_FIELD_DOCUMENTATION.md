# Input Field Components Documentation

## Overview

A comprehensive set of input field components with validation states, icons, size variants, and full accessibility support. Built on the existing input component foundation with enhanced features for form handling and user feedback.

## Components

### InputField

The main comprehensive input component with full feature support.

### Input

The base input component (legacy) - still available for simple use cases.

## Features

### ✅ Input Types
- **Text** - Standard text input
- **Email** - Email address with validation support
- **Password** - Secure password input
- **Search** - Search queries with search icon
- **Number** - Numeric input with step control
- **Tel** - Phone number input
- **URL** - Website URL input
- **Date** - Date picker input
- And all other HTML5 input types

### ✅ Validation States
- **Default** - Standard input state
- **Success** - Green border and checkmark icon
- **Error** - Red border and error icon with message
- **Warning** - Orange/yellow border and warning icon

### ✅ Size Variants
- **Small (sm)** - Compact input for tight spaces
- **Medium (md)** - Default size, balanced for most use cases
- **Large (lg)** - Prominent input for primary actions

### ✅ Icon Support
- **Left Icon** - Icon positioned at the start of the input
- **Right Icon** - Icon positioned at the end of the input
- **Both Icons** - Icons on both sides simultaneously
- **Validation Icons** - Automatic icons for validation states

### ✅ Helper Text & Messages
- **Helper Text** - Instructional text below input
- **Error Message** - Red error text with alert role
- **Success Message** - Green success text
- **Warning Message** - Warning text for cautions

### ✅ Accessibility Features
- **ARIA Labels** - Proper labeling for screen readers
- **ARIA Descriptions** - Linked helper text and error messages
- **ARIA Invalid** - Error state announcement
- **Screen Reader Announcements** - Live regions for state changes
- **Keyboard Navigation** - Full keyboard support
- **Focus Indicators** - Clear focus rings
- **Required Indicators** - Visual asterisk for required fields
- **High Contrast Support** - Enhanced visibility in high contrast mode
- **Reduced Motion** - Respects prefers-reduced-motion

## Usage Examples

### Basic Input

```tsx
import { InputField } from "@/components/ui/input-field"

<InputField
  label="Email Address"
  type="email"
  placeholder="Enter your email..."
  helperText="We'll never share your email"
/>
```

### Input with Validation

```tsx
<InputField
  label="Email"
  type="email"
  value={email}
  onChange={(e) => setEmail(e.target.value)}
  errorMessage={emailError}
  successMessage={!emailError && email ? "Valid email" : ""}
/>
```

### Input with Icons

```tsx
import { Mail, User } from "lucide-react"

<InputField
  label="Search Users"
  placeholder="Search..."
  leftIcon={<Search className="w-full h-full" />}
  rightIcon={<User className="w-full h-full" />}
/>
```

### Size Variants

```tsx
<InputField size="sm" label="Small" placeholder="Small input..." />
<InputField size="md" label="Medium" placeholder="Medium input..." />
<InputField size="lg" label="Large" placeholder="Large input..." />
```

### Required Field

```tsx
<InputField
  label="Password"
  type="password"
  required
  placeholder="Enter password..."
  helperText="Minimum 8 characters"
/>
```

### Disabled State

```tsx
<InputField
  label="Username"
  value="johndoe"
  disabled
  helperText="Username cannot be changed"
/>
```

### Complete Form Example

```tsx
import { InputField } from "@/components/ui/input-field"
import { Mail, Lock, User } from "lucide-react"

export default function LoginForm() {
  const [email, setEmail] = React.useState("")
  const [password, setPassword] = React.useState("")
  const [errors, setErrors] = React.useState({})

  const handleSubmit = (e) => {
    e.preventDefault()
    // Validation logic
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <InputField
        label="Full Name"
        type="text"
        leftIcon={<User className="w-full h-full" />}
        required
      />
      
      <InputField
        label="Email"
        type="email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        leftIcon={<Mail className="w-full h-full" />}
        errorMessage={errors.email}
        required
      />
      
      <InputField
        label="Password"
        type="password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        leftIcon={<Lock className="w-full h-full" />}
        errorMessage={errors.password}
        helperText="Minimum 8 characters"
        required
      />
      
      <button type="submit">Sign Up</button>
    </form>
  )
}
```

## Props Reference

### InputField Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `label` | `string` | - | Label text displayed above input |
| `type` | `string` | `"text"` | HTML input type (text, email, password, etc.) |
| `size` | `"sm" \| "md" \| "lg"` | `"md"` | Size variant of the input |
| `state` | `"default" \| "success" \| "error" \| "warning"` | `"default"` | Validation state |
| `helperText` | `string` | - | Helper text displayed below input |
| `errorMessage` | `string` | - | Error message (overrides helperText) |
| `successMessage` | `string` | - | Success message (overrides helperText) |
| `warningMessage` | `string` | - | Warning message (overrides helperText) |
| `leftIcon` | `ReactNode` | - | Icon displayed on the left |
| `rightIcon` | `ReactNode` | - | Icon displayed on the right |
| `showValidationIcon` | `boolean` | `true` | Show automatic validation icons |
| `disabled` | `boolean` | `false` | Disable the input |
| `required` | `boolean` | `false` | Mark field as required |
| `containerClassName` | `string` | - | Additional classes for container |
| `labelClassName` | `string` | - | Additional classes for label |
| `helperTextClassName` | `string` | - | Additional classes for helper text |
| `className` | `string` | - | Additional classes for input element |

Plus all standard HTML input attributes (`placeholder`, `value`, `onChange`, `onBlur`, etc.)

## Validation Pattern Example

```tsx
const [formData, setFormData] = React.useState({
  email: "",
  password: "",
})

const [errors, setErrors] = React.useState({})
const [touched, setTouched] = React.useState({})

const validateEmail = (email) => {
  const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  return regex.test(email)
}

const validatePassword = (password) => {
  return password.length >= 8
}

const handleChange = (field, value) => {
  setFormData(prev => ({ ...prev, [field]: value }))
  
  // Validate on change if field was touched
  if (touched[field]) {
    validateField(field, value)
  }
}

const handleBlur = (field) => {
  setTouched(prev => ({ ...prev, [field]: true }))
  validateField(field, formData[field])
}

const validateField = (field, value) => {
  let error = ""
  
  if (field === "email" && !validateEmail(value)) {
    error = "Please enter a valid email"
  }
  
  if (field === "password" && !validatePassword(value)) {
    error = "Password must be at least 8 characters"
  }
  
  setErrors(prev => ({ ...prev, [field]: error }))
}

// In JSX:
<InputField
  label="Email"
  type="email"
  value={formData.email}
  onChange={(e) => handleChange("email", e.target.value)}
  onBlur={() => handleBlur("email")}
  errorMessage={errors.email}
  successMessage={
    formData.email && !errors.email ? "Valid email" : ""
  }
/>
```

## Styling Customization

### Custom Classes

```tsx
<InputField
  label="Custom Styled Input"
  containerClassName="my-custom-container"
  labelClassName="text-blue-600 font-bold"
  className="border-2 border-purple-500"
  helperTextClassName="text-gray-600"
/>
```

### Theme Integration

The component uses CSS variables from the design system:
- `--input` - Border color
- `--ring` - Focus ring color
- `--success` - Success state color
- `--error` - Error state color
- `--warning` - Warning state color

## Accessibility Testing

### Keyboard Navigation
- **Tab** - Navigate between inputs
- **Enter** - Submit form (when in input)
- **Escape** - Clear focused input (browser default)

### Screen Reader Testing
All inputs provide:
- Label association via `htmlFor` and `id`
- Description via `aria-describedby`
- Error announcements via `aria-live="assertive"`
- Required field indication via `aria-required`
- Invalid state via `aria-invalid`

### Testing Checklist
- [ ] All inputs can be reached via keyboard
- [ ] Focus indicators are visible
- [ ] Labels are read by screen readers
- [ ] Error messages are announced
- [ ] Required fields are indicated
- [ ] Validation states are visually distinct
- [ ] Color contrast meets WCAG AA standards
- [ ] Works in high contrast mode
- [ ] Respects reduced motion preferences

## Browser Support

- Chrome/Edge (latest 2 versions)
- Firefox (latest 2 versions)
- Safari (latest 2 versions)
- Mobile Safari (iOS 13+)
- Chrome Mobile (Android 8+)

## Design Tokens

The component uses these design tokens:

### Colors
- `border` - Default border
- `input` - Input border color
- `ring` - Focus ring
- `success` - Success state
- `error` - Error state
- `warning` - Warning state
- `muted-foreground` - Helper text and icons

### Spacing
- `space-1` to `space-32` - Standard spacing scale
- Responsive padding based on screen size

### Typography
- `text-xs` to `text-lg` - Responsive text sizes
- `font-medium` - Label weight
- `leading-none` - Label line height

### Border Radius
- `rounded-md` - Input corners
- `rounded-sm` - Focus ring

### Transitions
- `transition-fast` (150ms)
- `transition-base` (200ms)

## Migration Guide

### From Old Input Component

```tsx
// Old way
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"

<div>
  <Label htmlFor="email">Email</Label>
  <Input id="email" type="email" />
  <p className="text-sm text-muted-foreground">Helper text</p>
</div>

// New way
import { InputField } from "@/components/ui/input-field"

<InputField
  label="Email"
  type="email"
  helperText="Helper text"
/>
```

## Performance Considerations

- Component uses React.memo internally for re-render optimization
- Icons are rendered as separate components to avoid re-renders
- State calculations use React.useMemo for efficiency
- No unnecessary DOM mutations

## Best Practices

### Do's ✅
- Always provide a label for accessibility
- Use helper text to guide users
- Show validation messages clearly
- Use appropriate input types
- Mark required fields
- Provide immediate feedback on validation

### Don'ts ❌
- Don't use placeholder as a label replacement
- Don't validate on every keystroke (use onBlur instead)
- Don't disable submit button during validation
- Don't use only color to indicate state
- Don't forget to handle loading states

## Related Components

- **Label** - Standalone label component
- **Input** - Base input component (legacy)
- **Textarea** - Multi-line text input
- **Button** - Form submit buttons

## Support & Issues

For questions or issues:
1. Check this documentation
2. View the showcase page at `/input-showcase`
3. Review existing input implementations
4. Create an issue with reproduction steps

## Changelog

### Version 1.0.0 (Current)
- Initial release
- All input types supported
- Full validation state system
- Icon support (left and right)
- Size variants (sm, md, lg)
- Complete accessibility features
- Responsive design
- Dark mode support
