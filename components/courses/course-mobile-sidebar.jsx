import { Menu } from "lucide-react"
import { Sheet, SheetContent, SheetTrigger } from "../ui/sheet"
import { CourseSidebar } from "./course-sidebar"

export const CourseMobileSidebar = ({course, progressCount}) => {
  return (
    <Sheet>
        <SheetTrigger className="md:hidden pr-4 hover:opacity-75 transition">
            <Menu />
        </SheetTrigger>
        <SheetContent className="p-0 bg-white w-72" side="left">
            <CourseSidebar
                course={course}
                progressCount={progressCount}
            />
        </SheetContent>
    </Sheet>
  )
}