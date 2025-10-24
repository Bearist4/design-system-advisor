# Input Field Components - Quick Reference

## Quick Import

```tsx
import { InputField } from "@/components/ui/input-field"
```

## Common Patterns

### 1. Basic Input
```tsx
<InputField
  label="Email"
  type="email"
  placeholder="email@example.com"
/>
```

### 2. With Validation
```tsx
<InputField
  label="Password"
  type="password"
  errorMessage="Password too short"
  // or
  successMessage="Strong password!"
  // or
  warningMessage="Commonly used password"
/>
```

### 3. With Icons
```tsx
import { Mail, Search, Lock } from "lucide-react"

// Left icon
<InputField
  leftIcon={<Mail className="w-full h-full" />}
  label="Email"
/>

// Right icon
<InputField
  rightIcon={<Search className="w-full h-full" />}
  label="Search"
/>

// Both sides
<InputField
  leftIcon={<Lock className="w-full h-full" />}
  rightIcon={<Eye className="w-full h-full" />}
  label="Password"
/>
```

### 4. Size Variants
```tsx
<InputField size="sm" label="Small" />
<InputField size="md" label="Medium" /> // default
<InputField size="lg" label="Large" />
```

### 5. Required Field
```tsx
<InputField
  label="Email"
  required
  helperText="This field is required"
/>
```

### 6. Disabled State
```tsx
<InputField
  label="Username"
  disabled
  value="john_doe"
/>
```

## All Input Types

```tsx
// Text
<InputField type="text" label="Name" />

// Email
<InputField type="email" label="Email" />

// Password
<InputField type="password" label="Password" />

// Search
<InputField type="search" label="Search" />

// Tel
<InputField type="tel" label="Phone" />

// URL
<InputField type="url" label="Website" />

// Number
<InputField type="number" label="Age" min="0" max="120" />

// Date
<InputField type="date" label="Birthday" />
```

## Validation States

```tsx
// Default
<InputField label="Field" />

// Success
<InputField
  label="Field"
  successMessage="Looks good!"
/>

// Error
<InputField
  label="Field"
  errorMessage="Invalid value"
/>

// Warning
<InputField
  label="Field"
  warningMessage="Please verify"
/>
```

## Form Integration

```tsx
const [formData, setFormData] = useState({
  email: "",
  password: "",
})
const [errors, setErrors] = useState({})

<form onSubmit={handleSubmit}>
  <InputField
    label="Email"
    type="email"
    value={formData.email}
    onChange={(e) => setFormData(prev => ({
      ...prev,
      email: e.target.value
    }))}
    errorMessage={errors.email}
    required
  />
  
  <InputField
    label="Password"
    type="password"
    value={formData.password}
    onChange={(e) => setFormData(prev => ({
      ...prev,
      password: e.target.value
    }))}
    errorMessage={errors.password}
    required
  />
  
  <button type="submit">Submit</button>
</form>
```

## Props Cheat Sheet

| Prop | Type | Default | Example |
|------|------|---------|---------|
| `label` | string | - | `"Email Address"` |
| `type` | string | `"text"` | `"email"`, `"password"` |
| `size` | enum | `"md"` | `"sm"`, `"md"`, `"lg"` |
| `placeholder` | string | - | `"Enter email..."` |
| `helperText` | string | - | `"We'll never share"` |
| `errorMessage` | string | - | `"Invalid format"` |
| `successMessage` | string | - | `"Looks good!"` |
| `warningMessage` | string | - | `"Please verify"` |
| `leftIcon` | ReactNode | - | `<Mail />` |
| `rightIcon` | ReactNode | - | `<Search />` |
| `required` | boolean | `false` | `true` |
| `disabled` | boolean | `false` | `true` |
| `value` | string | - | Controlled value |
| `onChange` | function | - | `(e) => {}` |

## Styling

```tsx
<InputField
  label="Custom"
  containerClassName="mb-8"
  labelClassName="text-blue-600"
  className="border-2"
  helperTextClassName="text-xs"
/>
```

## Accessibility

All inputs automatically include:
- ✅ ARIA labels (`aria-label`, `aria-labelledby`)
- ✅ ARIA descriptions (`aria-describedby`)
- ✅ ARIA invalid state (`aria-invalid`)
- ✅ ARIA required (`aria-required`)
- ✅ Live announcements (`aria-live`)
- ✅ Keyboard navigation
- ✅ Focus indicators
- ✅ Screen reader support

## Testing

```tsx
// Get by label
const input = screen.getByLabelText("Email")

// Get by role
const input = screen.getByRole("textbox", { name: "Email" })

// Check attributes
expect(input).toHaveAttribute("aria-invalid", "true")
expect(input).toHaveAttribute("required")

// User interactions
await userEvent.type(input, "test@example.com")
await userEvent.tab() // Focus next
```

## Common Recipes

### Email with Validation
```tsx
const [email, setEmail] = useState("")
const [error, setError] = useState("")

const validateEmail = (value) => {
  const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  if (!regex.test(value)) {
    setError("Invalid email format")
  } else {
    setError("")
  }
}

<InputField
  label="Email"
  type="email"
  value={email}
  onChange={(e) => {
    setEmail(e.target.value)
    validateEmail(e.target.value)
  }}
  errorMessage={error}
  leftIcon={<Mail className="w-full h-full" />}
/>
```

### Password with Toggle
```tsx
const [password, setPassword] = useState("")
const [showPassword, setShowPassword] = useState(false)

<div className="relative">
  <InputField
    type={showPassword ? "text" : "password"}
    label="Password"
    value={password}
    onChange={(e) => setPassword(e.target.value)}
    leftIcon={<Lock className="w-full h-full" />}
    showValidationIcon={false}
  />
  <button
    type="button"
    onClick={() => setShowPassword(!showPassword)}
    className="absolute right-3 top-[42px]"
  >
    {showPassword ? <EyeOff /> : <Eye />}
  </button>
</div>
```

### Search with Debounce
```tsx
const [search, setSearch] = useState("")
const [debouncedSearch, setDebouncedSearch] = useState("")

useEffect(() => {
  const timer = setTimeout(() => {
    setDebouncedSearch(search)
  }, 300)
  return () => clearTimeout(timer)
}, [search])

<InputField
  type="search"
  label="Search"
  value={search}
  onChange={(e) => setSearch(e.target.value)}
  leftIcon={<Search className="w-full h-full" />}
  placeholder="Search..."
/>
```

## Demo & Documentation

- **Live Demo**: Visit `/input-showcase` in your app
- **Full Docs**: See `INPUT_FIELD_DOCUMENTATION.md`
- **Implementation**: See `INPUT_FIELD_IMPLEMENTATION_SUMMARY.md`
- **Tests**: See `tests/input-field.spec.ts`

## Troubleshooting

### Icons not showing?
- Ensure `lucide-react` is installed
- Use `className="w-full h-full"` on icon components

### Validation not working?
- Use `errorMessage`, not `error` prop
- Messages automatically trigger visual states

### Styling not applied?
- Check Tailwind config includes component paths
- Ensure design tokens are defined in CSS

### TypeScript errors?
- Component extends `React.InputHTMLAttributes<HTMLInputElement>`
- All standard input props are supported

## Tips & Tricks

1. **Always provide a label** for accessibility
2. **Use helperText** to guide users
3. **Validate onBlur**, not onChange for better UX
4. **Show success states** for positive feedback
5. **Use appropriate input types** for better mobile keyboards
6. **Mark required fields** explicitly
7. **Provide clear error messages** with solutions
