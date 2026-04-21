const mongoose = require("mongoose");
const Food = require("../models/food.model");
const Category = require("../models/category.model");
require("dotenv").config({ path: require("path").join(__dirname, "../../.env") });

const seedFoods = async () => {
    try {
        await mon
        goose.connect(process.env.MONGO_URI);
        console.log("✅ MongoDB connected");

        // Delete all existing foods
        const deletedCount = await Food.deleteMany({});
        console.log(`🗑️ Deleted ${deletedCount.deletedCount} existing foods`);

        // Get or create categories
        let categories = await Category.find();
        if (categories.length === 0) {
            console.log("⚠️  Kategoriyalar topilmadi. Seed qilish kerak...");
            const defaultCategories = [
                { name: "Lavash", description: "Qo'shni lavashlar" },
                { name: "Osh", description: "O'zbek oshi" },
                { name: "Chop", description: "Chop va go'shtlar" },
                { name: "Ichimlik", description: "Turli ichimliklar" },
                { name: "Shirinlik", description: "Desert va shirinliklar" }
            ];



            
            categories = await Category.insertMany(defaultCategories);
            console.log(`✅ Yangi ${categories.length} ta kategoriya yaratildi`);
        }

        // Mock foods data with image URLs (string)
        const foodsData = [
            {
                name: "Klassik Lavash",
                price: 15000,
                category: categories[0]._id,
                image: "https://via.placeholder.com/300x200?text=Klassik+Lavash",
                description: "An'anaviy o'zbek lavashi, go'sht va sabzavotlar bilan",
                ingredients: ["go'sht", "yog'", "sabzavot", "adoblar"]
            },
            {
                name: "Piyozli Lavash",
                price: 12000,
                category: categories[0]._id,
                image: "https://via.placeholder.com/300x200?text=Piyozli+Lavash",
                description: "Toza piyoz bilan qo'shni lavash",
                ingredients: ["piyoz", "yog'", "tuz", "qora qali"]
            },
            {
                name: "Palov",
                price: 25000,
                category: categories[1]._id,
                image: "https://via.placeholder.com/300x200?text=Palov",
                description: "Klassik o'zbek palovi, go'sht va osh bilan",
                ingredients: ["guruch", "go'sht", "sabzi", "murchon", "tuz"]
            },
            {
                name: "Qazon Plov",
                price: 30000,
                category: categories[1]._id,
                image: "https://via.placeholder.com/300x200?text=Qazon+Plov",
                description: "Qazonni plov, juda mazali va yumshoq",
                ingredients: ["guruch", "go'sht", "sabzi", "murchon", "yog'"]
            },
            {
                name: "Lula Kababu",
                price: 18000,
                category: categories[2]._id,
                image: "https://via.placeholder.com/300x200?text=Lula+Kababu",
                description: "Marinatlangan go'shtdan tayyorlangan kababu",
                ingredients: ["go'sht", "sabzavot", "tuz", "murchon", "yog'"]
            },
            {
                name: "Shashlik",
                price: 20000,
                category: categories[2]._id,
                image: "https://via.placeholder.com/300x200?text=Shashlik",
                description: "Qizil olovda pishirilgan shamlar",
                ingredients: ["go'sht", "piyoz", "tuz", "murchon"]
            },
            {
                name: "Choy",
                price: 3000,
                category: categories[3]._id,
                image: "https://via.placeholder.com/300x200?text=Choy",
                description: "Issiq qora choy",
                ingredients: ["choy", "suv"]
            },
            {
                name: "Qahva",
                price: 5000,
                category: categories[3]._id,
                image: "https://via.placeholder.com/300x200?text=Qahva",
                description: "Aroma qahva",
                ingredients: ["qahva", "suv", "shakar"]
            },
            {
                name: "Kovvali",
                price: 8000,
                category: categories[3]._id,
                image: "https://via.placeholder.com/300x200?text=Kovvali",
                description: "Sut bilan qo'shilgan qahva",
                ingredients: ["qahva", "sut", "suv", "shakar"]
            },
            {
                name: "Tkemali",
                price: 6000,
                category: categories[4]._id,
                image: "https://via.placeholder.com/300x200?text=Tkemali",
                description: "Mazali qush sharob",
                ingredients: ["qush mevarlar", "shakar", "spichlar"]
            },
            {
                name: "Halva",
                price: 10000,
                category: categories[4]._id,
                image: "https://via.placeholder.com/300x200?text=Halva",
                description: "Tabiiy halva, susli va mazali",
                ingredients: ["una", "mol yog'", "shakar", "mol suti"]
            },
            {
                name: "Norin",
                price: 16000,
                category: categories[1]._id,
                image: "https://via.placeholder.com/300x200?text=Norin",
                description: "Norin - an'anaviy o'zbek taomi",
                ingredients: ["hamkorxona", "go'sht", "sabzavot", "yogurt", "tuz"]
            }
        ];

        // Insert new foods
        const insertedFoods = await Food.insertMany(foodsData);
        console.log(`✅ Successfully inserted ${insertedFoods.length} foods`);

        // Show what we inserted
        console.log("\n🍽️ Inserted Foods:");
        insertedFoods.forEach(food => {
            console.log(`   ${food.name} - ${food.price} so'm`);
        });

        await mongoose.disconnect();
        console.log("\n✅ Seed completed successfully!");
        process.exit(0);
    } catch (err) {
        console.error("❌ Seed error:", err.message);
        process.exit(1);
    }
};

seedFoods();
