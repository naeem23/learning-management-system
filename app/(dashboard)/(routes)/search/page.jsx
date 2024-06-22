import { auth } from '@clerk/nextjs'
import { redirect } from 'next/navigation'

import Categories from '@/components/categories/categories'
import { SearchInput } from '@/components/search-input'
import prismadb from '@/lib/prismadb'
import { CoursesList } from '@/components/courses/courses-list'
import { getCourses } from '@/actions';


const SearchPage = async ({ searchParams }) => {
    const {userId} = auth()

    if (!userId) {
        return redirect("/")
    }

    const categories = await prismadb.category.findMany({
        orderBy: {
            name: "asc"
        }
    })

    const courses = await getCourses({
        userId,
        ...searchParams
    })

  return (
    <>
        <div className='px-6 pt-6 block md:hidden md:mb-0'>
            <SearchInput />
        </div>
        <div className='p-6 space-y-4'>
            <Categories
                items={categories}
            />

            <CoursesList items={courses} />
        </div>
    </>
  )
}

export default SearchPage