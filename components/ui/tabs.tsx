import * as React from "react";
import { cn } from "@/lib/utils";

/* Simple Tabs implementation */

const TabsContext = React.createContext<{
  value: string;
  onValueChange: (value: string) => void; 
}>({ value: "", onValueChange: () => {} });

export const Tabs = ({ defaultValue, value, onValueChange, children, className }: { defaultValue?: string, value?: string, onValueChange?: (v: string) => void, children: React.ReactNode, className?: string }) => {
  const [activeTab, setActiveTab] = React.useState(defaultValue || "");
  
  const current = value !== undefined ? value : activeTab;
  const onChange = onValueChange || setActiveTab;

  return (
    <TabsContext.Provider value={{ value: current, onValueChange: onChange }}>
      <div className={className}>{children}</div>
    </TabsContext.Provider>
  );
};

export const TabsList = ({ className, children }: { className?: string, children: React.ReactNode }) => (
  <div className={cn("inline-flex h-10 items-center justify-center rounded-md bg-gray-100 p-1 text-gray-500", className)}>
    {children}
  </div>
);

export const TabsTrigger = ({ value, children, className }: { value: string, children: React.ReactNode, className?: string }) => {
  const { value: activeValue, onValueChange } = React.useContext(TabsContext);
  const isActive = activeValue === value;
  
  return (
    <button
      className={cn(
        "inline-flex items-center justify-center whitespace-nowrap rounded-sm px-3 py-1.5 text-sm font-medium ring-offset-background transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50",
        isActive && "bg-white text-black shadow-sm",
        className
      )}
      onClick={() => onValueChange(value)}
    >
      {children}
    </button>
  );
};

export const TabsContent = ({ value, children, className }: { value: string, children: React.ReactNode, className?: string }) => {
  const { value: activeValue } = React.useContext(TabsContext);
  if (activeValue !== value) return null;
  return <div className={cn("mt-2 ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2", className)}>{children}</div>;
};
