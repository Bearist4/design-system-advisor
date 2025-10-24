"use client"

import * as React from "react"
import { InputField } from "@/components/ui/input-field"
import { 
  Mail, 
  Lock, 
  Search, 
  Phone, 
  User, 
  Globe,
  DollarSign,
  Calendar,
  Eye,
  EyeOff
} from "lucide-react"

export default function InputShowcasePage() {
  const [showPassword, setShowPassword] = React.useState(false)
  const [emailValue, setEmailValue] = React.useState("")
  const [emailError, setEmailError] = React.useState("")
  const [passwordValue, setPasswordValue] = React.useState("")
  const [passwordError, setPasswordError] = React.useState("")

  // Email validation
  const validateEmail = (email: string) => {
    if (!email) {
      setEmailError("")
      return
    }
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(email)) {
      setEmailError("Please enter a valid email address")
    } else {
      setEmailError("")
    }
  }

  // Password validation
  const validatePassword = (password: string) => {
    if (!password) {
      setPasswordError("")
      return
    }
    if (password.length < 8) {
      setPasswordError("Password must be at least 8 characters")
    } else {
      setPasswordError("")
    }
  }

  return (
    <div className="min-h-screen bg-background p-4 sm:p-6 md:p-8">
      <div className="max-w-7xl mx-auto space-y-8 sm:space-y-12">
        {/* Header */}
        <div className="space-y-2 sm:space-y-3">
          <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold text-foreground">
            Input Field Components
          </h1>
          <p className="text-base sm:text-lg text-muted-foreground max-w-3xl">
            A comprehensive set of input field components with validation states, icons, 
            size variants, and full accessibility support.
          </p>
        </div>

        {/* Size Variants */}
        <section className="space-y-4 sm:space-y-6">
          <div>
            <h2 className="text-2xl sm:text-3xl font-semibold text-foreground mb-2">
              Size Variants
            </h2>
            <p className="text-sm sm:text-base text-muted-foreground">
              Three size options: small, medium (default), and large
            </p>
          </div>
          
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 sm:gap-6">
            <InputField
              size="sm"
              label="Small Input"
              placeholder="Small size input..."
              helperText="This is a small input field"
            />
            <InputField
              size="md"
              label="Medium Input"
              placeholder="Medium size input..."
              helperText="This is a medium input field (default)"
            />
            <InputField
              size="lg"
              label="Large Input"
              placeholder="Large size input..."
              helperText="This is a large input field"
            />
          </div>
        </section>

        {/* Input Types */}
        <section className="space-y-4 sm:space-y-6">
          <div>
            <h2 className="text-2xl sm:text-3xl font-semibold text-foreground mb-2">
              Input Types
            </h2>
            <p className="text-sm sm:text-base text-muted-foreground">
              Support for all HTML5 input types
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6">
            <InputField
              type="text"
              label="Text Input"
              placeholder="Enter text..."
              leftIcon={<User className="w-full h-full" />}
              helperText="Standard text input field"
            />
            
            <InputField
              type="email"
              label="Email Input"
              placeholder="email@example.com"
              leftIcon={<Mail className="w-full h-full" />}
              value={emailValue}
              onChange={(e) => {
                setEmailValue(e.target.value)
                validateEmail(e.target.value)
              }}
              errorMessage={emailError}
              successMessage={emailValue && !emailError ? "Valid email address" : ""}
              helperText="Enter your email address"
            />
            
            <InputField
              type="password"
              label="Password Input"
              placeholder="Enter password..."
              leftIcon={<Lock className="w-full h-full" />}
              value={passwordValue}
              onChange={(e) => {
                setPasswordValue(e.target.value)
                validatePassword(e.target.value)
              }}
              errorMessage={passwordError}
              successMessage={passwordValue && !passwordError ? "Strong password" : ""}
              helperText="Must be at least 8 characters"
            />
            
            <InputField
              type="search"
              label="Search Input"
              placeholder="Search..."
              leftIcon={<Search className="w-full h-full" />}
              helperText="Search for anything"
            />
            
            <InputField
              type="tel"
              label="Phone Input"
              placeholder="+1 (555) 123-4567"
              leftIcon={<Phone className="w-full h-full" />}
              helperText="Enter your phone number"
            />
            
            <InputField
              type="url"
              label="URL Input"
              placeholder="https://example.com"
              leftIcon={<Globe className="w-full h-full" />}
              helperText="Enter a valid URL"
            />
            
            <InputField
              type="number"
              label="Number Input"
              placeholder="0"
              leftIcon={<DollarSign className="w-full h-full" />}
              helperText="Enter a number"
              min="0"
              step="0.01"
            />
            
            <InputField
              type="date"
              label="Date Input"
              leftIcon={<Calendar className="w-full h-full" />}
              helperText="Select a date"
            />
          </div>
        </section>

        {/* Validation States */}
        <section className="space-y-4 sm:space-y-6">
          <div>
            <h2 className="text-2xl sm:text-3xl font-semibold text-foreground mb-2">
              Validation States
            </h2>
            <p className="text-sm sm:text-base text-muted-foreground">
              Visual feedback for success, error, and warning states
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
            <InputField
              label="Default State"
              placeholder="Default input..."
              helperText="This is a default input"
            />
            
            <InputField
              label="Success State"
              placeholder="Success input..."
              defaultValue="john.doe@example.com"
              successMessage="Email is valid and available"
            />
            
            <InputField
              label="Error State"
              placeholder="Error input..."
              defaultValue="invalid-email"
              errorMessage="This email format is invalid"
            />
            
            <InputField
              label="Warning State"
              placeholder="Warning input..."
              defaultValue="test@test.com"
              warningMessage="This email domain is commonly used for testing"
            />
          </div>
        </section>

        {/* Icon Positions */}
        <section className="space-y-4 sm:space-y-6">
          <div>
            <h2 className="text-2xl sm:text-3xl font-semibold text-foreground mb-2">
              Icon Positions
            </h2>
            <p className="text-sm sm:text-base text-muted-foreground">
              Icons can be placed on the left, right, or both sides
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
            <InputField
              label="Left Icon"
              placeholder="Search..."
              leftIcon={<Search className="w-full h-full" />}
              helperText="Icon on the left side"
            />
            
            <InputField
              label="Right Icon"
              placeholder="Enter amount..."
              rightIcon={<DollarSign className="w-full h-full" />}
              helperText="Icon on the right side"
            />
            
            <InputField
              label="Both Icons"
              placeholder="Search for user..."
              leftIcon={<Search className="w-full h-full" />}
              rightIcon={<User className="w-full h-full" />}
              helperText="Icons on both sides"
            />
          </div>
        </section>

        {/* Interactive Password Toggle */}
        <section className="space-y-4 sm:space-y-6">
          <div>
            <h2 className="text-2xl sm:text-3xl font-semibold text-foreground mb-2">
              Interactive Example
            </h2>
            <p className="text-sm sm:text-base text-muted-foreground">
              Password field with visibility toggle
            </p>
          </div>
          
          <div className="max-w-md">
            <div className="relative">
              <InputField
                type={showPassword ? "text" : "password"}
                label="Password with Toggle"
                placeholder="Enter your password..."
                leftIcon={<Lock className="w-full h-full" />}
                helperText="Click the eye icon to toggle visibility"
                showValidationIcon={false}
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-[42px] -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-ring rounded-sm p-0.5"
                aria-label={showPassword ? "Hide password" : "Show password"}
              >
                {showPassword ? (
                  <EyeOff className="w-5 h-5" />
                ) : (
                  <Eye className="w-5 h-5" />
                )}
              </button>
            </div>
          </div>
        </section>

        {/* Disabled State */}
        <section className="space-y-4 sm:space-y-6">
          <div>
            <h2 className="text-2xl sm:text-3xl font-semibold text-foreground mb-2">
              Disabled State
            </h2>
            <p className="text-sm sm:text-base text-muted-foreground">
              Disabled inputs with reduced opacity
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
            <InputField
              label="Disabled Input"
              placeholder="Cannot edit..."
              disabled
              helperText="This field is disabled"
            />
            
            <InputField
              label="Disabled with Value"
              defaultValue="Read-only content"
              disabled
              leftIcon={<Lock className="w-full h-full" />}
              helperText="This field is disabled"
            />
            
            <InputField
              label="Disabled with Icon"
              placeholder="Disabled..."
              disabled
              leftIcon={<Mail className="w-full h-full" />}
              rightIcon={<User className="w-full h-full" />}
              helperText="This field is disabled"
            />
          </div>
        </section>

        {/* Required Fields */}
        <section className="space-y-4 sm:space-y-6">
          <div>
            <h2 className="text-2xl sm:text-3xl font-semibold text-foreground mb-2">
              Required Fields
            </h2>
            <p className="text-sm sm:text-base text-muted-foreground">
              Fields marked as required with asterisk indicator
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6">
            <InputField
              label="Email"
              type="email"
              placeholder="email@example.com"
              required
              leftIcon={<Mail className="w-full h-full" />}
              helperText="Required field - must be a valid email"
            />
            
            <InputField
              label="Password"
              type="password"
              placeholder="Enter password..."
              required
              leftIcon={<Lock className="w-full h-full" />}
              helperText="Required field - minimum 8 characters"
            />
          </div>
        </section>

        {/* Form Example */}
        <section className="space-y-4 sm:space-y-6">
          <div>
            <h2 className="text-2xl sm:text-3xl font-semibold text-foreground mb-2">
              Complete Form Example
            </h2>
            <p className="text-sm sm:text-base text-muted-foreground">
              A realistic form using various input field components
            </p>
          </div>
          
          <form 
            className="max-w-2xl space-y-4 sm:space-y-6 p-4 sm:p-6 border border-border rounded-lg bg-card"
            onSubmit={(e) => {
              e.preventDefault()
              alert("Form submitted!")
            }}
          >
            <div className="space-y-4">
              <InputField
                label="Full Name"
                type="text"
                placeholder="John Doe"
                required
                leftIcon={<User className="w-full h-full" />}
                helperText="Enter your full name"
              />
              
              <InputField
                label="Email Address"
                type="email"
                placeholder="john@example.com"
                required
                leftIcon={<Mail className="w-full h-full" />}
                helperText="We'll never share your email"
              />
              
              <InputField
                label="Phone Number"
                type="tel"
                placeholder="+1 (555) 123-4567"
                leftIcon={<Phone className="w-full h-full" />}
                helperText="Optional - for account recovery"
              />
              
              <InputField
                label="Website"
                type="url"
                placeholder="https://example.com"
                leftIcon={<Globe className="w-full h-full" />}
                helperText="Optional - your personal or company website"
              />
              
              <InputField
                label="Password"
                type="password"
                placeholder="Enter a strong password..."
                required
                leftIcon={<Lock className="w-full h-full" />}
                helperText="Minimum 8 characters with mixed case and numbers"
              />
            </div>
            
            <div className="flex gap-3 pt-4">
              <button
                type="submit"
                className="px-4 py-2 bg-primary text-primary-foreground rounded-md hover:bg-primary/90 transition-colors focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
              >
                Submit Form
              </button>
              <button
                type="reset"
                className="px-4 py-2 bg-secondary text-secondary-foreground rounded-md hover:bg-secondary/80 transition-colors focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
              >
                Reset
              </button>
            </div>
          </form>
        </section>

        {/* Accessibility Features */}
        <section className="space-y-4 sm:space-y-6">
          <div>
            <h2 className="text-2xl sm:text-3xl font-semibold text-foreground mb-2">
              Accessibility Features
            </h2>
            <p className="text-sm sm:text-base text-muted-foreground">
              All inputs include proper ARIA labels and screen reader support
            </p>
          </div>
          
          <div className="grid grid-cols-1 gap-4 p-4 sm:p-6 border border-border rounded-lg bg-card max-w-3xl">
            <div className="space-y-2">
              <h3 className="text-lg font-semibold text-foreground">
                Built-in Accessibility
              </h3>
              <ul className="space-y-2 text-sm sm:text-base text-muted-foreground list-disc list-inside">
                <li>Proper ARIA labels and descriptions</li>
                <li>Screen reader announcements for validation states</li>
                <li>Keyboard navigation support</li>
                <li>Focus indicators for keyboard users</li>
                <li>Required field indicators</li>
                <li>Error state announcements with aria-live regions</li>
                <li>High contrast mode support</li>
                <li>Reduced motion support</li>
              </ul>
            </div>
          </div>
        </section>
      </div>
    </div>
  )
}
