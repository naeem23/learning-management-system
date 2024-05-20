import Categories from '@/components/categories/categories'
import prismadb from '@/lib/prismadb'

const SearchPage = async () => {
    const categories = await prismadb.category.findMany({
        orderBy: {
            name: "asc"
        }
    })
  return (
    <div className='p-6'>
        <Categories
            items={categories}
        />
    </div>
  )
}

export default SearchPage