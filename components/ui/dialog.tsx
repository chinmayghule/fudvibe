import * as React from "react";
import { cn } from "@/lib/utils";

// Simplified Dialog implementation since Radix UI was causing issues/complexity
// This relies on a simple state-based conditional rendering in the parent or
// we can implement a basic modal here.

interface DialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  children: React.ReactNode;
}

export const Dialog = ({ open, onOpenChange, children }: DialogProps) => {
  if (!open) return null;
  
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
      <div className="bg-white rounded-lg shadow-lg w-full max-w-md mx-4 relative">
        {React.Children.map(children, child => {
          // Pass onClose to children if needed
          if (React.isValidElement(child)) {
             // @ts-expect-error - passed prop
             return React.cloneElement(child, { onClose: () => onOpenChange(false) });
          }
          return child;
        })}
      </div>
    </div>
  );
};

export const DialogTrigger = ({ asChild, children, onClick }: { asChild?: boolean, children: React.ReactNode, onClick?: () => void }) => {
  // Logic handled by parent state mostly
  return children;
};

export const DialogContent = ({ children, className, onClose }: { children: React.ReactNode, className?: string, onClose?: () => void }) => (
  <div className={cn("p-6", className)}>
     <button onClick={onClose} className="absolute right-4 top-4 rounded-sm opacity-70 ring-offset-background transition-opacity hover:opacity-100 focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:pointer-events-none data-[state=open]:bg-accent data-[state=open]:text-muted-foreground">
        <span className="sr-only">Close</span>
        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-4 w-4"><path d="M18 6 6 18"/><path d="m6 6 12 12"/></svg>
     </button>
     {children}
  </div>
);

export const DialogHeader = ({ className, ...props }: React.HTMLAttributes<HTMLDivElement>) => (
  <div className={cn("flex flex-col space-y-1.5 text-center sm:text-left mb-4", className)} {...props} />
);

export const DialogTitle = ({ className, ...props }: React.HTMLAttributes<HTMLHeadingElement>) => (
  <h2 className={cn("text-lg font-semibold leading-none tracking-tight", className)} {...props} />
);

export const DialogDescription = ({ className, ...props }: React.HTMLAttributes<HTMLParagraphElement>) => (
  <p className={cn("text-sm text-gray-500", className)} {...props} />
);

export const DialogFooter = ({ className, ...props }: React.HTMLAttributes<HTMLDivElement>) => (
  <div className={cn("flex flex-col-reverse sm:flex-row sm:justify-end sm:space-x-2 mt-4", className)} {...props} />
);
