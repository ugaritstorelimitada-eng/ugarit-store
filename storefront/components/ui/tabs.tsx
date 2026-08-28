"use client"

import * as React from "react"
import { cn } from "@/lib/utils"

type TabsContextValue = {
  value: string
  onValueChange: (value: string) => void
}

const TabsContext = React.createContext<TabsContextValue | undefined>(undefined)

function useTabs() {
  const ctx = React.useContext(TabsContext)
  if (!ctx) throw new Error("useTabs must be used within Tabs")
  return ctx
}

interface TabsProps {
  defaultValue?: string
  value?: string
  onValueChange?: (value: string) => void
  className?: string
  children: React.ReactNode
}

const Tabs = ({ defaultValue, value: controlled, onValueChange, className, children }: TabsProps) => {
  const [internal, setInternal] = React.useState(defaultValue ?? "")
  const value = controlled ?? internal
  const setValue = React.useCallback(
    (v: string) => {
      if (controlled === undefined) setInternal(v)
      onValueChange?.(v)
    },
    [controlled, onValueChange]
  )
  return (
    <TabsContext.Provider value={{ value, onValueChange: setValue }}>
      <div className={className}>{children}</div>
    </TabsContext.Provider>
  )
}

const TabsList = ({ className, children }: { className?: string; children: React.ReactNode }) => (
  <div
    role="tablist"
    className={cn(
      "inline-flex h-10 items-center justify-center rounded-md bg-muted p-1 text-muted-foreground",
      className
    )}
  >
    {children}
  </div>
)

const TabsTrigger = ({
  value,
  className,
  children,
}: {
  value: string
  className?: string
  children: React.ReactNode
}) => {
  const { value: active, onValueChange } = useTabs()
  const isActive = active === value
  return (
    <button
      type="button"
      role="tab"
      aria-selected={isActive}
      onClick={() => onValueChange(value)}
      className={cn(
        "inline-flex items-center justify-center whitespace-nowrap rounded-sm px-3 py-1.5 text-sm font-medium transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2",
        isActive
          ? "bg-background text-foreground shadow-sm"
          : "text-muted-foreground hover:text-foreground",
        className
      )}
    >
      {children}
    </button>
  )
}

const TabsContent = ({
  value,
  className,
  children,
}: {
  value: string
  className?: string
  children: React.ReactNode
}) => {
  const { value: active } = useTabs()
  if (active !== value) return null
  return (
    <div role="tabpanel" className={cn("mt-4", className)}>
      {children}
    </div>
  )
}

export { Tabs, TabsList, TabsTrigger, TabsContent }
