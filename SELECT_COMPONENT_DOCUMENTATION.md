# Select/Dropdown Component Documentation

## Overview

A comprehensive, accessible select/dropdown component built with Radix UI primitives and React. Supports single and multi-select modes, search functionality, custom rendering, grouped options, loading states, and more.

## Features

✨ **Core Features:**
- ✅ Search functionality with debouncing
- ✅ Multi-select support with checkboxes
- ✅ Custom option rendering (icons, descriptions, etc.)
- ✅ Full keyboard navigation (Arrow keys, Enter, Space, Escape)
- ✅ Loading states for async data
- ✅ Clear functionality
- ✅ Grouped options support
- ✅ Proper ARIA attributes for accessibility
- ✅ Controlled and uncontrolled modes
- ✅ Dark mode support
- ✅ Responsive design

## Installation

The component is already installed in the project. Dependencies:

```json
{
  "@radix-ui/react-select": "latest",
  "@radix-ui/react-checkbox": "latest",
  "lucide-react": "latest"
}
```

## Usage

### Basic Select

```tsx
import { Select } from "@/components/ui/select"

const options = [
  { value: "apple", label: "Apple" },
  { value: "banana", label: "Banana" },
  { value: "cherry", label: "Cherry" },
]

function MyComponent() {
  const [value, setValue] = React.useState("")
  
  return (
    <Select
      options={options}
      value={value}
      onValueChange={setValue}
      placeholder="Choose a fruit..."
    />
  )
}
```

### Searchable Select

```tsx
<Select
  options={options}
  value={value}
  onValueChange={setValue}
  searchable
  searchPlaceholder="Type to search..."
  placeholder="Search fruits..."
/>
```

### Multi-Select

```tsx
const [values, setValues] = React.useState<string[]>([])

<Select
  options={options}
  value={values}
  onValueChange={setValues}
  multiSelect
  searchable
  placeholder="Select multiple options..."
/>
```

### Clearable Select

```tsx
<Select
  options={options}
  value={value}
  onValueChange={setValue}
  clearable
  placeholder="Choose an option..."
/>
```

### Options with Icons and Descriptions

```tsx
const options = [
  { 
    value: "profile", 
    label: "Profile", 
    icon: <User className="h-4 w-4" />,
    description: "Manage your profile settings"
  },
  { 
    value: "settings", 
    label: "Settings", 
    icon: <Settings className="h-4 w-4" />,
    description: "Configure application settings"
  },
]

<Select
  options={options}
  placeholder="Select an option..."
/>
```

### Grouped Options

```tsx
const groups = [
  {
    label: "Fruits",
    options: [
      { value: "apple", label: "Apple" },
      { value: "banana", label: "Banana" },
    ],
  },
  {
    label: "Vegetables",
    options: [
      { value: "carrot", label: "Carrot" },
      { value: "lettuce", label: "Lettuce" },
    ],
  },
]

<Select
  groups={groups}
  placeholder="Select food..."
/>
```

### Async Loading

```tsx
const [options, setOptions] = React.useState([])
const [loading, setLoading] = React.useState(false)

const handleSearch = async (query: string) => {
  setLoading(true)
  const results = await fetchOptions(query)
  setOptions(results)
  setLoading(false)
}

<Select
  options={options}
  isLoading={loading}
  onSearch={handleSearch}
  searchable
  debounceMs={500}
  placeholder="Search..."
/>
```

### Custom Option Rendering

```tsx
<Select
  options={options}
  renderOption={(option) => (
    <div className="flex items-center gap-2">
      <Avatar src={option.avatar} />
      <div>
        <div className="font-medium">{option.label}</div>
        <div className="text-xs text-muted-foreground">{option.email}</div>
      </div>
    </div>
  )}
/>
```

## API Reference

### SelectProps

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `options` | `SelectOption[]` | `[]` | Array of options to display |
| `groups` | `SelectOptionGroup[]` | `[]` | Array of grouped options |
| `value` | `string \| string[]` | - | Controlled value |
| `defaultValue` | `string \| string[]` | - | Default uncontrolled value |
| `onValueChange` | `(value: string \| string[]) => void` | - | Callback when value changes |
| `placeholder` | `string` | `"Select an option..."` | Placeholder text |
| `disabled` | `boolean` | `false` | Disable the select |
| `className` | `string` | - | Additional CSS classes |
| `searchable` | `boolean` | `false` | Enable search functionality |
| `searchPlaceholder` | `string` | `"Search..."` | Search input placeholder |
| `multiSelect` | `boolean` | `false` | Enable multi-select mode |
| `clearable` | `boolean` | `false` | Show clear button |
| `isLoading` | `boolean` | `false` | Show loading state |
| `loadingText` | `string` | `"Loading..."` | Loading state text |
| `emptyText` | `string` | `"No options found"` | Empty state text |
| `maxHeight` | `string` | `"300px"` | Max height of dropdown |
| `renderOption` | `(option: SelectOption) => ReactNode` | - | Custom option renderer |
| `onSearch` | `(query: string) => void` | - | Search callback (debounced) |
| `debounceMs` | `number` | `300` | Debounce delay in ms |

### SelectOption

```tsx
interface SelectOption {
  value: string
  label: string
  disabled?: boolean
  icon?: React.ReactNode
  description?: string
}
```

### SelectOptionGroup

```tsx
interface SelectOptionGroup {
  label: string
  options: SelectOption[]
}
```

## Keyboard Navigation

The component supports full keyboard navigation:

| Key | Action |
|-----|--------|
| `Arrow Down` | Move focus to next option |
| `Arrow Up` | Move focus to previous option |
| `Enter` / `Space` | Select focused option |
| `Escape` | Close dropdown |
| `Home` | Move focus to first option |
| `End` | Move focus to last option |
| `Type to search` | Filter options (when searchable) |

## Accessibility

The component follows WAI-ARIA best practices:

- ✅ Proper ARIA roles (`listbox`, `option`, `combobox`)
- ✅ ARIA attributes (`aria-selected`, `aria-disabled`, `aria-label`, `aria-busy`)
- ✅ Keyboard navigation support
- ✅ Focus management
- ✅ Screen reader announcements
- ✅ High contrast mode support

## Styling

The component uses Tailwind CSS and follows the design system tokens. It supports:

- Light and dark modes
- Custom color schemes via CSS variables
- Responsive breakpoints
- Smooth animations and transitions

## Demo

Visit `/select-demo` to see all features in action with interactive examples.

## Implementation Details

### Built With

- **Radix UI Select**: Accessible select primitive
- **Radix UI Checkbox**: For multi-select checkboxes
- **React**: Hooks for state management
- **Tailwind CSS**: Styling and design tokens
- **Lucide React**: Icons

### State Management

- Supports both controlled and uncontrolled modes
- Uses `React.useState` for internal state
- Debounced search with custom `useDebounce` hook

### Performance

- Memoized filtered options
- Debounced search queries (configurable delay)
- Virtualization-ready (can be extended)

## Acceptance Criteria

All acceptance criteria from the Linear issue have been met:

- ✅ Search filters options in real-time
- ✅ Multi-select works with proper state management
- ✅ Custom options render correctly
- ✅ Keyboard navigation is fully functional
- ✅ Loading states display appropriately
- ✅ Clear functionality works for all selection types

## Future Enhancements

Potential improvements for future iterations:

- Virtual scrolling for large option lists (1000+ items)
- Option to create new items inline
- Drag and drop reordering for multi-select
- Batch actions for multi-select
- Export selected items
- Option pinning (pin favorites to top)
- Recent selections history
- Advanced filtering (regex, fuzzy search)

## Testing

To test the component:

1. Start the development server: `npm run dev`
2. Navigate to `/select-demo`
3. Test each variant:
   - Basic select
   - Searchable select
   - Multi-select
   - Clearable select
   - Custom options with icons
   - Grouped options
   - Loading states
   - Disabled states

Build test: `npm run build` ✅ Passes

## Support

For issues or questions, please refer to:
- Component source: `/src/components/ui/select.tsx`
- Demo page: `/src/app/select-demo/page.tsx`
- This documentation: `/SELECT_COMPONENT_DOCUMENTATION.md`
