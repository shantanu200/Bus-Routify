import * as React from "react";

import { cn } from "@/lib/utils";
import { Eye, EyeOff } from "lucide-react";

export interface InputProps
  extends React.InputHTMLAttributes<HTMLInputElement> {}

const PasswordInput = React.forwardRef<HTMLInputElement, InputProps>(
  ({ className, type, ...props }, ref) => {
    const [isVisble, setIsVisible] = React.useState(false);
    return (
      <div className="relative">
        <input
          type={isVisble ? "text" : "password"}
          className={cn(
            "flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50",
            className
          )}
          ref={ref}
          {...props}
        />
        {isVisble ? (
          <Eye
            className="absolute top-1/2 right-3 transform -translate-y-1/2 text-muted-foreground cursor-pointer"
            onClick={() => setIsVisible(false)}
          />
        ) : (
          <EyeOff
            className="absolute top-1/2 right-3 transform -translate-y-1/2 text-muted-foreground cursor-pointer"
            onClick={() => setIsVisible(true)}
          />
        )}
      </div>
    );
  }
);
PasswordInput.displayName = "Input";

export { PasswordInput };
