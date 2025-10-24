"use client"

import * as React from "react"
import * as SelectPrimitive from "@radix-ui/react-select"
import * as CheckboxPrimitive from "@radix-ui/react-checkbox"
import { Check, ChevronDown, ChevronUp, X, Search, Loader2 } from "lucide-react"
import { cn } from "@/lib/utils"

/* ============================================
   TYPES & INTERFACES
   ============================================ */

export interface SelectOption {
  value: string
  label: string
  disabled?: boolean
  icon?: React.ReactNode
  description?: string
}

export interface SelectOptionGroup {
  label: string
  options: SelectOption[]
}

export interface SelectProps {
  options?: SelectOption[]
  groups?: SelectOptionGroup[]
  value?: string | string[]
  defaultValue?: string | string[]
  onValueChange?: (value: string | string[]) => void
  placeholder?: string
  disabled?: boolean
  className?: string
  searchable?: boolean
  searchPlaceholder?: string
  multiSelect?: boolean
  clearable?: boolean
  isLoading?: boolean
  loadingText?: string
  emptyText?: string
  maxHeight?: string
  renderOption?: (option: SelectOption) => React.ReactNode
  onSearch?: (query: string) => void
  debounceMs?: number
}

/* ============================================
   UTILITY HOOKS
   ============================================ */

function useDebounce<T>(value: T, delay: number): T {
  const [debouncedValue, setDebouncedValue] = React.useState<T>(value)

  React.useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedValue(value)
    }, delay)

    return () => {
      clearTimeout(handler)
    }
  }, [value, delay])

  return debouncedValue
}

/* ============================================
   SELECT COMPONENT
   ============================================ */

export const Select = React.forwardRef<HTMLButtonElement, SelectProps>(
  (
    {
      options = [],
      groups = [],
      value,
      defaultValue,
      onValueChange,
      placeholder = "Select an option...",
      disabled = false,
      className,
      searchable = false,
      searchPlaceholder = "Search...",
      multiSelect = false,
      clearable = false,
      isLoading = false,
      loadingText = "Loading...",
      emptyText = "No options found",
      maxHeight = "300px",
      renderOption,
      onSearch,
      debounceMs = 300,
    },
    ref
  ) => {
    const [open, setOpen] = React.useState(false)
    const [searchQuery, setSearchQuery] = React.useState("")
    const [internalValue, setInternalValue] = React.useState<string | string[]>(
      defaultValue ?? (multiSelect ? [] : "")
    )
    const searchInputRef = React.useRef<HTMLInputElement>(null)
    
    const debouncedSearchQuery = useDebounce(searchQuery, debounceMs)

    // Determine controlled vs uncontrolled
    const isControlled = value !== undefined
    const currentValue = isControlled ? value : internalValue

    // Handle value changes
    const handleValueChange = React.useCallback(
      (newValue: string | string[]) => {
        if (!isControlled) {
          setInternalValue(newValue)
        }
        onValueChange?.(newValue)
      },
      [isControlled, onValueChange]
    )

    // Focus search input when opening
    React.useEffect(() => {
      if (open && searchable && searchInputRef.current) {
        setTimeout(() => searchInputRef.current?.focus(), 0)
      }
    }, [open, searchable])

    // Call onSearch callback with debounced query
    React.useEffect(() => {
      if (onSearch) {
        onSearch(debouncedSearchQuery)
      }
    }, [debouncedSearchQuery, onSearch])

    // Flatten all options for filtering
    const allOptions = React.useMemo(() => {
      if (groups.length > 0) {
        return groups.flatMap((group) => group.options)
      }
      return options
    }, [options, groups])

    // Filter options based on search query
    const filteredOptions = React.useMemo(() => {
      if (!searchQuery) return allOptions
      
      const query = searchQuery.toLowerCase()
      return allOptions.filter(
        (option) =>
          option.label.toLowerCase().includes(query) ||
          option.value.toLowerCase().includes(query) ||
          option.description?.toLowerCase().includes(query)
      )
    }, [allOptions, searchQuery])

    // Filter groups based on search query
    const filteredGroups = React.useMemo(() => {
      if (!searchQuery || groups.length === 0) return groups

      return groups
        .map((group) => ({
          ...group,
          options: group.options.filter((option) =>
            filteredOptions.some((fo) => fo.value === option.value)
          ),
        }))
        .filter((group) => group.options.length > 0)
    }, [groups, filteredOptions, searchQuery])

    // Handle multi-select toggle
    const handleMultiSelectToggle = React.useCallback(
      (optionValue: string) => {
        const values = Array.isArray(currentValue) ? currentValue : []
        const newValues = values.includes(optionValue)
          ? values.filter((v) => v !== optionValue)
          : [...values, optionValue]
        handleValueChange(newValues)
      },
      [currentValue, handleValueChange]
    )

    // Handle single select
    const handleSingleSelect = React.useCallback(
      (optionValue: string) => {
        handleValueChange(optionValue)
        setOpen(false)
        setSearchQuery("")
      },
      [handleValueChange]
    )

    // Clear selection
    const handleClear = React.useCallback(
      (e: React.MouseEvent) => {
        e.stopPropagation()
        handleValueChange(multiSelect ? [] : "")
      },
      [handleValueChange, multiSelect]
    )

    // Get display label
    const getDisplayLabel = React.useCallback(() => {
      if (multiSelect && Array.isArray(currentValue)) {
        if (currentValue.length === 0) return placeholder
        if (currentValue.length === 1) {
          const option = allOptions.find((o) => o.value === currentValue[0])
          return option?.label ?? currentValue[0]
        }
        return `${currentValue.length} selected`
      }

      if (!multiSelect && typeof currentValue === "string") {
        if (!currentValue) return placeholder
        const option = allOptions.find((o) => o.value === currentValue)
        return option?.label ?? currentValue
      }

      return placeholder
    }, [currentValue, multiSelect, placeholder, allOptions])

    // Check if value is selected
    const isSelected = React.useCallback(
      (optionValue: string) => {
        if (multiSelect && Array.isArray(currentValue)) {
          return currentValue.includes(optionValue)
        }
        return currentValue === optionValue
      },
      [currentValue, multiSelect]
    )

    // Check if clear button should show
    const shouldShowClear = React.useMemo(() => {
      if (!clearable || disabled) return false
      if (multiSelect && Array.isArray(currentValue)) {
        return currentValue.length > 0
      }
      return Boolean(currentValue)
    }, [clearable, disabled, multiSelect, currentValue])

    // Render an option
    const renderSelectOption = React.useCallback(
      (option: SelectOption) => {
        if (renderOption) {
          return renderOption(option)
        }

        return (
          <div className="flex items-start gap-2">
            {option.icon && (
              <span className="mt-0.5 shrink-0">{option.icon}</span>
            )}
            <div className="flex-1 min-w-0">
              <div className="font-medium truncate">{option.label}</div>
              {option.description && (
                <div className="text-xs text-muted-foreground truncate">
                  {option.description}
                </div>
              )}
            </div>
          </div>
        )
      },
      [renderOption]
    )

    if (multiSelect) {
      return (
        <SelectPrimitive.Root open={open} onOpenChange={setOpen}>
          <SelectPrimitive.Trigger
            ref={ref}
            disabled={disabled || isLoading}
            className={cn(
              "flex h-10 w-full items-center justify-between rounded-md border border-input bg-background",
              "px-3 py-2 text-sm ring-offset-background",
              "placeholder:text-muted-foreground",
              "focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2",
              "disabled:cursor-not-allowed disabled:opacity-50",
              "transition-colors duration-200",
              className
            )}
            aria-label="Select options"
          >
            <span className="truncate">{getDisplayLabel()}</span>
            <div className="flex items-center gap-2 shrink-0 ml-2">
              {shouldShowClear && (
                <button
                  onClick={handleClear}
                  className="rounded-sm opacity-70 hover:opacity-100 focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2"
                  aria-label="Clear selection"
                  type="button"
                >
                  <X className="h-4 w-4" />
                </button>
              )}
              {isLoading ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                <SelectPrimitive.Icon asChild>
                  <ChevronDown className="h-4 w-4 opacity-50" />
                </SelectPrimitive.Icon>
              )}
            </div>
          </SelectPrimitive.Trigger>

          <SelectPrimitive.Portal>
            <SelectPrimitive.Content
              className={cn(
                "relative z-dropdown overflow-hidden rounded-md border bg-popover text-popover-foreground shadow-md",
                "data-[state=open]:animate-in data-[state=closed]:animate-out",
                "data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0",
                "data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95",
                "data-[side=bottom]:slide-in-from-top-2 data-[side=top]:slide-in-from-bottom-2"
              )}
              position="popper"
              sideOffset={4}
              style={{ maxHeight }}
            >
              {searchable && (
                <div className="flex items-center border-b px-3 py-2 sticky top-0 bg-popover z-10">
                  <Search className="mr-2 h-4 w-4 shrink-0 opacity-50" />
                  <input
                    ref={searchInputRef}
                    type="text"
                    placeholder={searchPlaceholder}
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className={cn(
                      "flex-1 bg-transparent text-sm outline-none placeholder:text-muted-foreground",
                      "disabled:cursor-not-allowed disabled:opacity-50"
                    )}
                  />
                </div>
              )}

              <SelectPrimitive.Viewport className="p-1">
                {isLoading ? (
                  <div className="py-6 text-center text-sm text-muted-foreground">
                    <Loader2 className="mx-auto h-5 w-5 animate-spin mb-2" />
                    {loadingText}
                  </div>
                ) : filteredOptions.length === 0 ? (
                  <div className="py-6 text-center text-sm text-muted-foreground">
                    {emptyText}
                  </div>
                ) : (
                  <>
                    {filteredGroups.length > 0
                      ? filteredGroups.map((group) => (
                          <SelectPrimitive.Group key={group.label}>
                            <SelectPrimitive.Label className="px-2 py-1.5 text-xs font-semibold text-muted-foreground">
                              {group.label}
                            </SelectPrimitive.Label>
                            {group.options.map((option) => (
                              <MultiSelectItem
                                key={option.value}
                                option={option}
                                isSelected={isSelected(option.value)}
                                onToggle={handleMultiSelectToggle}
                                renderContent={() => renderSelectOption(option)}
                              />
                            ))}
                          </SelectPrimitive.Group>
                        ))
                      : filteredOptions.map((option) => (
                          <MultiSelectItem
                            key={option.value}
                            option={option}
                            isSelected={isSelected(option.value)}
                            onToggle={handleMultiSelectToggle}
                            renderContent={() => renderSelectOption(option)}
                          />
                        ))}
                  </>
                )}
              </SelectPrimitive.Viewport>

              <SelectPrimitive.ScrollUpButton className="flex cursor-default items-center justify-center py-1">
                <ChevronUp className="h-4 w-4" />
              </SelectPrimitive.ScrollUpButton>
              <SelectPrimitive.ScrollDownButton className="flex cursor-default items-center justify-center py-1">
                <ChevronDown className="h-4 w-4" />
              </SelectPrimitive.ScrollDownButton>
            </SelectPrimitive.Content>
          </SelectPrimitive.Portal>
        </SelectPrimitive.Root>
      )
    }

    // Single select mode
    return (
      <SelectPrimitive.Root
        value={typeof currentValue === "string" ? currentValue : ""}
        onValueChange={handleSingleSelect}
        open={open}
        onOpenChange={setOpen}
      >
        <SelectPrimitive.Trigger
          ref={ref}
          disabled={disabled || isLoading}
          className={cn(
            "flex h-10 w-full items-center justify-between rounded-md border border-input bg-background",
            "px-3 py-2 text-sm ring-offset-background",
            "placeholder:text-muted-foreground",
            "focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2",
            "disabled:cursor-not-allowed disabled:opacity-50",
            "transition-colors duration-200",
            className
          )}
          aria-label="Select option"
        >
          <SelectPrimitive.Value placeholder={placeholder}>
            {getDisplayLabel()}
          </SelectPrimitive.Value>
          <div className="flex items-center gap-2 shrink-0 ml-2">
            {shouldShowClear && (
              <button
                onClick={handleClear}
                className="rounded-sm opacity-70 hover:opacity-100 focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2"
                aria-label="Clear selection"
                type="button"
              >
                <X className="h-4 w-4" />
              </button>
            )}
            {isLoading ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              <SelectPrimitive.Icon asChild>
                <ChevronDown className="h-4 w-4 opacity-50" />
              </SelectPrimitive.Icon>
            )}
          </div>
        </SelectPrimitive.Trigger>

        <SelectPrimitive.Portal>
          <SelectPrimitive.Content
            className={cn(
              "relative z-dropdown overflow-hidden rounded-md border bg-popover text-popover-foreground shadow-md",
              "data-[state=open]:animate-in data-[state=closed]:animate-out",
              "data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0",
              "data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95",
              "data-[side=bottom]:slide-in-from-top-2 data-[side=top]:slide-in-from-bottom-2"
            )}
            position="popper"
            sideOffset={4}
            style={{ maxHeight }}
          >
            {searchable && (
              <div className="flex items-center border-b px-3 py-2 sticky top-0 bg-popover z-10">
                <Search className="mr-2 h-4 w-4 shrink-0 opacity-50" />
                <input
                  ref={searchInputRef}
                  type="text"
                  placeholder={searchPlaceholder}
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className={cn(
                    "flex-1 bg-transparent text-sm outline-none placeholder:text-muted-foreground",
                    "disabled:cursor-not-allowed disabled:opacity-50"
                  )}
                  onKeyDown={(e) => {
                    // Prevent select from closing when typing
                    e.stopPropagation()
                  }}
                />
              </div>
            )}

            <SelectPrimitive.Viewport className="p-1">
              {isLoading ? (
                <div className="py-6 text-center text-sm text-muted-foreground">
                  <Loader2 className="mx-auto h-5 w-5 animate-spin mb-2" />
                  {loadingText}
                </div>
              ) : filteredOptions.length === 0 ? (
                <div className="py-6 text-center text-sm text-muted-foreground">
                  {emptyText}
                </div>
              ) : (
                <>
                  {filteredGroups.length > 0
                    ? filteredGroups.map((group) => (
                        <SelectPrimitive.Group key={group.label}>
                          <SelectPrimitive.Label className="px-2 py-1.5 text-xs font-semibold text-muted-foreground">
                            {group.label}
                          </SelectPrimitive.Label>
                          {group.options.map((option) => (
                            <SelectItem
                              key={option.value}
                              value={option.value}
                              disabled={option.disabled}
                            >
                              {renderSelectOption(option)}
                            </SelectItem>
                          ))}
                        </SelectPrimitive.Group>
                      ))
                    : filteredOptions.map((option) => (
                        <SelectItem
                          key={option.value}
                          value={option.value}
                          disabled={option.disabled}
                        >
                          {renderSelectOption(option)}
                        </SelectItem>
                      ))}
                </>
              )}
            </SelectPrimitive.Viewport>

            <SelectPrimitive.ScrollUpButton className="flex cursor-default items-center justify-center py-1">
              <ChevronUp className="h-4 w-4" />
            </SelectPrimitive.ScrollUpButton>
            <SelectPrimitive.ScrollDownButton className="flex cursor-default items-center justify-center py-1">
              <ChevronDown className="h-4 w-4" />
            </SelectPrimitive.ScrollDownButton>
          </SelectPrimitive.Content>
        </SelectPrimitive.Portal>
      </SelectPrimitive.Root>
    )
  }
)
Select.displayName = "Select"

/* ============================================
   SELECT ITEM (Single Select)
   ============================================ */

interface SelectItemProps extends React.ComponentPropsWithoutRef<typeof SelectPrimitive.Item> {
  children: React.ReactNode
}

const SelectItem = React.forwardRef<
  React.ElementRef<typeof SelectPrimitive.Item>,
  SelectItemProps
>(({ className, children, ...props }, ref) => (
  <SelectPrimitive.Item
    ref={ref}
    className={cn(
      "relative flex w-full cursor-pointer select-none items-center rounded-sm py-1.5 pl-8 pr-2 text-sm outline-none",
      "focus:bg-accent focus:text-accent-foreground",
      "data-[disabled]:pointer-events-none data-[disabled]:opacity-50",
      "transition-colors duration-150",
      className
    )}
    {...props}
  >
    <span className="absolute left-2 flex h-3.5 w-3.5 items-center justify-center">
      <SelectPrimitive.ItemIndicator>
        <Check className="h-4 w-4" />
      </SelectPrimitive.ItemIndicator>
    </span>
    <SelectPrimitive.ItemText>{children}</SelectPrimitive.ItemText>
  </SelectPrimitive.Item>
))
SelectItem.displayName = "SelectItem"

/* ============================================
   MULTI-SELECT ITEM
   ============================================ */

interface MultiSelectItemProps {
  option: SelectOption
  isSelected: boolean
  onToggle: (value: string) => void
  renderContent: () => React.ReactNode
}

const MultiSelectItem = React.forwardRef<HTMLDivElement, MultiSelectItemProps>(
  ({ option, isSelected, onToggle, renderContent }, ref) => {
    return (
      <div
        ref={ref}
        role="option"
        aria-selected={isSelected}
        aria-disabled={option.disabled}
        className={cn(
          "relative flex w-full cursor-pointer select-none items-center rounded-sm py-1.5 pl-8 pr-2 text-sm outline-none",
          "focus:bg-accent focus:text-accent-foreground hover:bg-accent hover:text-accent-foreground",
          "data-[disabled]:pointer-events-none data-[disabled]:opacity-50",
          "transition-colors duration-150",
          option.disabled && "pointer-events-none opacity-50"
        )}
        onClick={() => {
          if (!option.disabled) {
            onToggle(option.value)
          }
        }}
        onKeyDown={(e) => {
          if (e.key === "Enter" || e.key === " ") {
            e.preventDefault()
            if (!option.disabled) {
              onToggle(option.value)
            }
          }
        }}
        tabIndex={option.disabled ? -1 : 0}
      >
        <span className="absolute left-2 flex h-3.5 w-3.5 items-center justify-center">
          <CheckboxPrimitive.Root
            checked={isSelected}
            className={cn(
              "h-4 w-4 shrink-0 rounded-sm border border-primary ring-offset-background",
              "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2",
              "disabled:cursor-not-allowed disabled:opacity-50",
              "data-[state=checked]:bg-primary data-[state=checked]:text-primary-foreground"
            )}
            disabled={option.disabled}
            onCheckedChange={() => onToggle(option.value)}
            onClick={(e) => e.stopPropagation()}
          >
            <CheckboxPrimitive.Indicator className="flex items-center justify-center text-current">
              <Check className="h-3 w-3" />
            </CheckboxPrimitive.Indicator>
          </CheckboxPrimitive.Root>
        </span>
        {renderContent()}
      </div>
    )
  }
)
MultiSelectItem.displayName = "MultiSelectItem"

/* ============================================
   EXPORTS
   ============================================ */

export type { SelectOption, SelectOptionGroup }
