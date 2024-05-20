"use client"

import {FcMultipleDevices, FcMusic, FcOldTimeCamera, FcSportsMode, FcSalesPerformance, FcFilmReel, FcEngineering} from 'react-icons/fc'

import CategoryItem from "./category-item"

const iconMap = {
    "MongoDB": FcMusic,
    "MySQL": FcOldTimeCamera,
    "Next.js": FcSportsMode,
    "Node.js": FcSalesPerformance,
    "Prisma": FcMultipleDevices,
    "React.js": FcFilmReel,
    "Tailwind": FcEngineering
}

const Categories = ({ items }) => {
  return (
    <div className="flex items-center gap-x-2 overflow-x-auto pb-2">
        {items.map((item) => (
            <CategoryItem
                key={item.id}
                label={item.name}
                icon={iconMap[item.name]}
                value={item.id}
            />
        ))}
    </div>
  )
}

export default Categories