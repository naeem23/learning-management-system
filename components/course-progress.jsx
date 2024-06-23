import { cn } from "@/lib/utils"
import { Progress } from "./ui/progress"

const colorByVariant = {
    default: "text-sky-700",
    success: "text-emerald-700"
}

const sizeByVariant = {
    default: "text-sm",
    sm: "text-xs",
}

export const CourseProgress = ({variant, value, size}) => {
  return (
    <div>
        <Progress
            className="h-2"
            value={value}
            variant={variant}
        />
        <p className={cn("font-medium mt-2 text-sky-700", colorByVariant[variant || "default"], sizeByVariant[size || "default"])}>
          {Math.round(value)}% Complete
        </p>
    </div>
  )
}