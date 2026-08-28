"use client"

import * as React from "react"
import { ChevronDown } from "lucide-react"
import { cn } from "@/lib/utils"

interface AccordionContextValue {
  value: string | undefined
  onValueChange: (value: string | undefined) => void
}
const AccordionContext = React.createContext<AccordionContextValue | undefined>(undefined)
const useAccordion = () => {
  const c = React.useContext(AccordionContext)
  if (!c) throw new Error("Accordion components must be used within Accordion")
  return c
}

interface AccordionProps {
  type?: "single" | "multiple"
  defaultValue?: string
  value?: string
  onValueChange?: (v: string | undefined) => void
  className?: string
  children: React.ReactNode
}
const Accordion = ({ defaultValue, value: ctrl, onValueChange, className, children }: AccordionProps) => {
  const [internal, setInternal] = React.useState<string | undefined>(defaultValue)
  const value = ctrl ?? internal
  const setValue = (v: string | undefined) => {
    if (ctrl === undefined) setInternal(v)
    onValueChange?.(v)
  }
  return (
    <AccordionContext.Provider value={{ value, onValueChange: setValue }}>
      <div className={className}>{children}</div>
    </AccordionContext.Provider>
  )
}

const AccordionItem = ({ value, className, children }: { value: string; className?: string; children: React.ReactNode }) => {
  const { value: open, onValueChange } = useAccordion()
  const isOpen = open === value
  return (
    <div className={cn("border-b", className)}>
      {React.Children.map(children, (child) => {
        if (!React.isValidElement(child)) return child
        const el = child as React.ReactElement<{ isOpen?: boolean; onToggle?: () => void; value?: string }>
        if (el.type === AccordionTrigger) {
          return React.cloneElement(el, { isOpen, onToggle: () => onValueChange(isOpen ? undefined : value) })
        }
        if (el.type === AccordionContent) {
          return React.cloneElement(el, { isOpen })
        }
        return child
      })}
    </div>
  )
}

const AccordionTrigger = ({ children, className, isOpen, onToggle }: { children: React.ReactNode; className?: string; isOpen?: boolean; onToggle?: () => void }) => (
  <button
    type="button"
    onClick={onToggle}
    className={cn("flex w-full items-center justify-between py-4 text-left font-medium hover:underline", className)}
  >
    {children}
    <ChevronDown className={cn("h-4 w-4 transition-transform", isOpen && "rotate-180")} />
  </button>
)

const AccordionContent = ({ children, className, isOpen }: { children: React.ReactNode; className?: string; isOpen?: boolean }) => (
  <div className={cn("overflow-hidden text-sm transition-all", isOpen ? "pb-4 pt-0" : "max-h-0", className)}>
    {children}
  </div>
)

export { Accordion, AccordionItem, AccordionTrigger, AccordionContent }
