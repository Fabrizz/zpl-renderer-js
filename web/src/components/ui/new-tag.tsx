import * as React from "react"
import { cva, type VariantProps } from "class-variance-authority"
import { Sparkle } from "lucide-react"

import { cn } from "@/lib/utils"
import { TextAnimatedShiny } from "./animated-textshiny"

const newTagVariants = cva(
  "group/new-tag inline-flex shrink-0 items-center justify-center rounded-full border border-amber-400/30 bg-amber-400/10 font-heading font-extrabold uppercase whitespace-nowrap select-none",
  {
    variants: {
      size: {
        xs: "h-4 gap-0.5 px-1 text-[0.6rem] tracking-wide [&_svg]:size-2.5",
        sm: "h-5 gap-1 px-2 text-[0.65rem] tracking-wide [&_svg]:size-3",
        md: "h-6 gap-1 px-2.5 text-xs tracking-wider [&_svg]:size-3.5",
      },
    },
    defaultVariants: {
      size: "sm",
    },
  }
)

export interface NewTagProps
  extends React.ComponentProps<"span">,
    VariantProps<typeof newTagVariants> {
  icon?: boolean
  shimmerWidth?: number
}

function NewTag({
  className,
  size = "sm",
  icon = true,
  shimmerWidth = 60,
  children = "New",
  ...props
}: NewTagProps) {
  return (
    <span
      data-slot="new-tag"
      data-size={size}
      className={cn(newTagVariants({ size, className }))}
      {...props}
    >
      {icon && <Sparkle className="fill-amber-300 text-amber-300" />}
      <TextAnimatedShiny
        shimmerWidth={shimmerWidth}
        className="mx-0 max-w-none text-amber-300/80 from-transparent via-white via-50% to-transparent dark:text-amber-300/80 dark:via-white"
      >
        {children}
      </TextAnimatedShiny>
    </span>
  )
}

export { NewTag, newTagVariants }
