import categories from "../../data/categories.js"
import CategoryItem from "./CategoryItem";

function Categories(){
    return (
        <div className="flex justify-start md:justify-center gap-6 md:gap-8 py-4 md:py-6 px-2 overflow-x-auto scrollbar-hide">
            {
                categories.map((category) => (
                    <CategoryItem
                        key={category.id}
                        category={category}
                    />
                ))
            }
        </div>
    )
}

export default Categories;