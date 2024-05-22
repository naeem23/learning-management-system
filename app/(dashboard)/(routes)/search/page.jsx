import Categories from '@/components/categories/categories'
import { SearchInput } from '@/components/search-input'
import prismadb from '@/lib/prismadb'

const SearchPage = async () => {
    const categories = await prismadb.category.findMany({
        orderBy: {
            name: "asc"
        }
    })
  return (
    <>
        <div className='px-6 pt-6 block md:hidden md:mb-0'>
            <SearchInput />
        </div>
        <div className='p-6'>
            <Categories
                items={categories}
            />
        </div>
    </>
  )
}

export default SearchPage