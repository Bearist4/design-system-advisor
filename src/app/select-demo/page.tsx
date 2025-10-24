"use client"

import * as React from "react"
import { Select, SelectOption, SelectOptionGroup } from "@/components/ui/select"
import { 
  User, 
  Mail, 
  Phone, 
  MapPin, 
  Calendar, 
  Code, 
  Database,
  Zap
} from "lucide-react"

/* ============================================
   DEMO DATA
   ============================================ */

const basicOptions: SelectOption[] = [
  { value: "apple", label: "Apple" },
  { value: "banana", label: "Banana" },
  { value: "cherry", label: "Cherry" },
  { value: "date", label: "Date" },
  { value: "elderberry", label: "Elderberry" },
  { value: "fig", label: "Fig" },
  { value: "grape", label: "Grape" },
  { value: "honeydew", label: "Honeydew" },
]

const optionsWithIcons: SelectOption[] = [
  { 
    value: "profile", 
    label: "Profile", 
    icon: <User className="h-4 w-4" />,
    description: "Manage your profile settings"
  },
  { 
    value: "email", 
    label: "Email", 
    icon: <Mail className="h-4 w-4" />,
    description: "Configure email preferences"
  },
  { 
    value: "phone", 
    label: "Phone", 
    icon: <Phone className="h-4 w-4" />,
    description: "Update phone numbers"
  },
  { 
    value: "location", 
    label: "Location", 
    icon: <MapPin className="h-4 w-4" />,
    description: "Set your location"
  },
  { 
    value: "calendar", 
    label: "Calendar", 
    icon: <Calendar className="h-4 w-4" />,
    description: "View and manage events"
  },
]

const groupedOptions: SelectOptionGroup[] = [
  {
    label: "Frontend",
    options: [
      { 
        value: "react", 
        label: "React", 
        icon: <Code className="h-4 w-4" />,
        description: "JavaScript library for building UIs"
      },
      { 
        value: "vue", 
        label: "Vue", 
        icon: <Code className="h-4 w-4" />,
        description: "Progressive JavaScript framework"
      },
      { 
        value: "angular", 
        label: "Angular", 
        icon: <Code className="h-4 w-4" />,
        description: "Platform for building web apps"
      },
    ],
  },
  {
    label: "Backend",
    options: [
      { 
        value: "nodejs", 
        label: "Node.js", 
        icon: <Database className="h-4 w-4" />,
        description: "JavaScript runtime environment"
      },
      { 
        value: "python", 
        label: "Python", 
        icon: <Database className="h-4 w-4" />,
        description: "High-level programming language"
      },
      { 
        value: "java", 
        label: "Java", 
        icon: <Database className="h-4 w-4" />,
        description: "Object-oriented programming language"
      },
    ],
  },
  {
    label: "Database",
    options: [
      { 
        value: "postgres", 
        label: "PostgreSQL", 
        icon: <Database className="h-4 w-4" />,
        description: "Open source relational database"
      },
      { 
        value: "mongodb", 
        label: "MongoDB", 
        icon: <Database className="h-4 w-4" />,
        description: "NoSQL document database"
      },
      { 
        value: "redis", 
        label: "Redis", 
        icon: <Database className="h-4 w-4" />,
        description: "In-memory data structure store"
      },
    ],
  },
]

/* ============================================
   DEMO PAGE COMPONENT
   ============================================ */

export default function SelectDemoPage() {
  const [basicValue, setBasicValue] = React.useState<string>("")
  const [searchableValue, setSearchableValue] = React.useState<string>("")
  const [multiValue, setMultiValue] = React.useState<string[]>([])
  const [groupedValue, setGroupedValue] = React.useState<string>("")
  const [clearableValue, setClearableValue] = React.useState<string>("apple")
  const [asyncValue, setAsyncValue] = React.useState<string>("")
  const [isLoading, setIsLoading] = React.useState(false)
  const [asyncOptions, setAsyncOptions] = React.useState<SelectOption[]>([])

  // Simulate async loading
  const handleAsyncSearch = React.useCallback((query: string) => {
    setIsLoading(true)
    
    // Simulate API call
    setTimeout(() => {
      const filtered = basicOptions.filter((option) =>
        option.label.toLowerCase().includes(query.toLowerCase())
      )
      setAsyncOptions(filtered)
      setIsLoading(false)
    }, 800)
  }, [])

  React.useEffect(() => {
    // Load initial data
    setAsyncOptions(basicOptions)
  }, [])

  return (
    <div className="container mx-auto py-10 px-4 max-w-6xl">
      <div className="space-y-8">
        {/* Header */}
        <div className="space-y-2">
          <h1 className="text-3xl sm:text-4xl font-bold tracking-tight">
            Select/Dropdown Component
          </h1>
          <p className="text-muted-foreground text-sm sm:text-base">
            A comprehensive select component with search, multi-select, custom rendering, and more.
          </p>
        </div>

        {/* Demo Sections */}
        <div className="grid gap-8 md:grid-cols-2">
          {/* Basic Select */}
          <section className="space-y-4 p-6 rounded-lg border bg-card">
            <div>
              <h2 className="text-xl font-semibold mb-1">Basic Select</h2>
              <p className="text-sm text-muted-foreground">
                Simple single selection dropdown
              </p>
            </div>
            <Select
              options={basicOptions}
              value={basicValue}
              onValueChange={(value) => setBasicValue(value as string)}
              placeholder="Choose a fruit..."
            />
            <div className="text-xs text-muted-foreground">
              Selected: <code className="bg-muted px-1 py-0.5 rounded">{basicValue || "none"}</code>
            </div>
          </section>

          {/* Searchable Select */}
          <section className="space-y-4 p-6 rounded-lg border bg-card">
            <div>
              <h2 className="text-xl font-semibold mb-1">Searchable Select</h2>
              <p className="text-sm text-muted-foreground">
                Filter options as you type
              </p>
            </div>
            <Select
              options={basicOptions}
              value={searchableValue}
              onValueChange={(value) => setSearchableValue(value as string)}
              placeholder="Search fruits..."
              searchable
              searchPlaceholder="Type to search..."
            />
            <div className="text-xs text-muted-foreground">
              Selected: <code className="bg-muted px-1 py-0.5 rounded">{searchableValue || "none"}</code>
            </div>
          </section>

          {/* Multi-Select */}
          <section className="space-y-4 p-6 rounded-lg border bg-card">
            <div>
              <h2 className="text-xl font-semibold mb-1">Multi-Select</h2>
              <p className="text-sm text-muted-foreground">
                Select multiple options at once
              </p>
            </div>
            <Select
              options={basicOptions}
              value={multiValue}
              onValueChange={(value) => setMultiValue(value as string[])}
              placeholder="Choose fruits..."
              multiSelect
              searchable
            />
            <div className="text-xs text-muted-foreground">
              Selected: <code className="bg-muted px-1 py-0.5 rounded">
                {multiValue.length > 0 ? multiValue.join(", ") : "none"}
              </code>
            </div>
          </section>

          {/* Clearable Select */}
          <section className="space-y-4 p-6 rounded-lg border bg-card">
            <div>
              <h2 className="text-xl font-semibold mb-1">Clearable Select</h2>
              <p className="text-sm text-muted-foreground">
                Clear selection with X button
              </p>
            </div>
            <Select
              options={basicOptions}
              value={clearableValue}
              onValueChange={(value) => setClearableValue(value as string)}
              placeholder="Choose a fruit..."
              clearable
            />
            <div className="text-xs text-muted-foreground">
              Selected: <code className="bg-muted px-1 py-0.5 rounded">{clearableValue || "none"}</code>
            </div>
          </section>

          {/* Custom Options with Icons */}
          <section className="space-y-4 p-6 rounded-lg border bg-card">
            <div>
              <h2 className="text-xl font-semibold mb-1">Custom Options</h2>
              <p className="text-sm text-muted-foreground">
                Options with icons and descriptions
              </p>
            </div>
            <Select
              options={optionsWithIcons}
              placeholder="Select a setting..."
              searchable
            />
          </section>

          {/* Grouped Options */}
          <section className="space-y-4 p-6 rounded-lg border bg-card">
            <div>
              <h2 className="text-xl font-semibold mb-1">Grouped Options</h2>
              <p className="text-sm text-muted-foreground">
                Organized into categories
              </p>
            </div>
            <Select
              groups={groupedOptions}
              value={groupedValue}
              onValueChange={(value) => setGroupedValue(value as string)}
              placeholder="Select a technology..."
              searchable
            />
            <div className="text-xs text-muted-foreground">
              Selected: <code className="bg-muted px-1 py-0.5 rounded">{groupedValue || "none"}</code>
            </div>
          </section>

          {/* Loading State */}
          <section className="space-y-4 p-6 rounded-lg border bg-card">
            <div>
              <h2 className="text-xl font-semibold mb-1">Loading State</h2>
              <p className="text-sm text-muted-foreground">
                Shows loading spinner during data fetch
              </p>
            </div>
            <Select
              options={asyncOptions}
              value={asyncValue}
              onValueChange={(value) => setAsyncValue(value as string)}
              placeholder="Search with delay..."
              searchable
              isLoading={isLoading}
              onSearch={handleAsyncSearch}
              debounceMs={500}
            />
            <div className="text-xs text-muted-foreground">
              Selected: <code className="bg-muted px-1 py-0.5 rounded">{asyncValue || "none"}</code>
            </div>
          </section>

          {/* Disabled State */}
          <section className="space-y-4 p-6 rounded-lg border bg-card">
            <div>
              <h2 className="text-xl font-semibold mb-1">Disabled State</h2>
              <p className="text-sm text-muted-foreground">
                Select is disabled and cannot be interacted with
              </p>
            </div>
            <Select
              options={basicOptions}
              placeholder="This select is disabled..."
              disabled
            />
          </section>
        </div>

        {/* Advanced Example */}
        <section className="space-y-4 p-6 rounded-lg border bg-card">
          <div>
            <h2 className="text-xl font-semibold mb-1">Advanced Example</h2>
            <p className="text-sm text-muted-foreground">
              All features combined: Multi-select, searchable, clearable, with icons
            </p>
          </div>
          <Select
            groups={groupedOptions}
            placeholder="Select technologies..."
            multiSelect
            searchable
            clearable
            searchPlaceholder="Search technologies..."
          />
        </section>

        {/* Features List */}
        <section className="space-y-4 p-6 rounded-lg border bg-card">
          <h2 className="text-xl font-semibold">✨ Features</h2>
          <div className="grid gap-3 sm:grid-cols-2">
            <div className="flex items-start gap-2">
              <Zap className="h-4 w-4 mt-0.5 text-primary shrink-0" />
              <div>
                <div className="font-medium text-sm">Search with Debouncing</div>
                <div className="text-xs text-muted-foreground">Filter options in real-time with configurable delay</div>
              </div>
            </div>
            <div className="flex items-start gap-2">
              <Zap className="h-4 w-4 mt-0.5 text-primary shrink-0" />
              <div>
                <div className="font-medium text-sm">Multi-Select Support</div>
                <div className="text-xs text-muted-foreground">Select multiple options with checkboxes</div>
              </div>
            </div>
            <div className="flex items-start gap-2">
              <Zap className="h-4 w-4 mt-0.5 text-primary shrink-0" />
              <div>
                <div className="font-medium text-sm">Custom Rendering</div>
                <div className="text-xs text-muted-foreground">Render options with icons, descriptions, and more</div>
              </div>
            </div>
            <div className="flex items-start gap-2">
              <Zap className="h-4 w-4 mt-0.5 text-primary shrink-0" />
              <div>
                <div className="font-medium text-sm">Keyboard Navigation</div>
                <div className="text-xs text-muted-foreground">Full keyboard support for accessibility</div>
              </div>
            </div>
            <div className="flex items-start gap-2">
              <Zap className="h-4 w-4 mt-0.5 text-primary shrink-0" />
              <div>
                <div className="font-medium text-sm">Loading States</div>
                <div className="text-xs text-muted-foreground">Handle async option loading gracefully</div>
              </div>
            </div>
            <div className="flex items-start gap-2">
              <Zap className="h-4 w-4 mt-0.5 text-primary shrink-0" />
              <div>
                <div className="font-medium text-sm">Clear Functionality</div>
                <div className="text-xs text-muted-foreground">Easy way to clear all selections</div>
              </div>
            </div>
            <div className="flex items-start gap-2">
              <Zap className="h-4 w-4 mt-0.5 text-primary shrink-0" />
              <div>
                <div className="font-medium text-sm">Grouped Options</div>
                <div className="text-xs text-muted-foreground">Organize options into logical categories</div>
              </div>
            </div>
            <div className="flex items-start gap-2">
              <Zap className="h-4 w-4 mt-0.5 text-primary shrink-0" />
              <div>
                <div className="font-medium text-sm">Accessible</div>
                <div className="text-xs text-muted-foreground">Proper ARIA attributes and screen reader support</div>
              </div>
            </div>
          </div>
        </section>

        {/* Code Examples */}
        <section className="space-y-4 p-6 rounded-lg border bg-card">
          <h2 className="text-xl font-semibold">📝 Usage Examples</h2>
          
          <div className="space-y-4">
            <div>
              <h3 className="text-sm font-semibold mb-2">Basic Select</h3>
              <pre className="bg-muted p-4 rounded-md text-xs overflow-x-auto">
{`<Select
  options={options}
  value={value}
  onValueChange={setValue}
  placeholder="Choose an option..."
/>`}
              </pre>
            </div>

            <div>
              <h3 className="text-sm font-semibold mb-2">Multi-Select with Search</h3>
              <pre className="bg-muted p-4 rounded-md text-xs overflow-x-auto">
{`<Select
  options={options}
  value={values}
  onValueChange={setValues}
  multiSelect
  searchable
  clearable
  placeholder="Select multiple..."
/>`}
              </pre>
            </div>

            <div>
              <h3 className="text-sm font-semibold mb-2">Grouped Options</h3>
              <pre className="bg-muted p-4 rounded-md text-xs overflow-x-auto">
{`<Select
  groups={[
    {
      label: "Category 1",
      options: [...],
    },
    {
      label: "Category 2",
      options: [...],
    },
  ]}
  placeholder="Select..."
/>`}
              </pre>
            </div>

            <div>
              <h3 className="text-sm font-semibold mb-2">Async Loading</h3>
              <pre className="bg-muted p-4 rounded-md text-xs overflow-x-auto">
{`<Select
  options={asyncOptions}
  isLoading={loading}
  onSearch={(query) => fetchOptions(query)}
  searchable
  debounceMs={500}
  placeholder="Search..."
/>`}
              </pre>
            </div>
          </div>
        </section>
      </div>
    </div>
  )
}
