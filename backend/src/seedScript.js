import mongoose from "mongoose";
import { Category, Product } from "./models/index.js";
import { categories, products } from "./seedData.js";

async function getDataSeed() {
    try {
        await mongoose.connect(`mongodb://localhost:27017/nectar`);
        await Product.deleteMany({});
        await Category.deleteMany({});

        const categoryDocs = await Category.insertMany(categories)
        const categoryMap = categoryDocs.reduce((map, category) => {
            map[category.name] = category._id;
            return map
        }, {})
        
        const productWithCate = products.map((product)=> ({
            ...product,
            category: categoryMap[product.category]
        }))

        await Product.insertMany(productWithCate)
        console.log("Database seeding successfully")
    } catch (error) {
        console.log("Data seed failed", error)
    } finally {
        mongoose.connection.close()
    }
}

getDataSeed()