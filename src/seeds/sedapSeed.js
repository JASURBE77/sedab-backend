require("dotenv").config({ path: require("path").join(__dirname, "../../.env") });
const mongoose = require("mongoose");

const Category = require("../models/category.model");
const Food     = require("../models/food.model");
const Order    = require("../models/order.model");
const Customer = require("../models/customer.model");
const Review   = require("../models/review.model");

const categories = [
    { name: "Pasta" },
    { name: "Pizza" },
    { name: "Soup" },
    { name: "Burger" },
    { name: "Drinks" },
    { name: "Desserts" },
];

const foods = [
    {
        name: "Medium Spicy Spaghetti Italiano",
        price: 12.56,
        subcategory: "Italian",
        description: "Classic Italian spaghetti with medium spicy tomato sauce and fresh basil.",
        ingredients: ["spaghetti", "tomato sauce", "chili flakes", "basil", "parmesan"],
        nutritionInfo: "Calories: 520kcal | Protein: 18g | Carbs: 72g | Fat: 14g",
        stockAvailable: true,
        image: "https://images.unsplash.com/photo-1621996346565-e3dbc646d9a9?w=400&h=400&fit=crop",
        categoryName: "Pasta",
    },
    {
        name: "Pizza Meal for Kids (Small size)",
        price: 5.67,
        subcategory: "Kids Menu",
        description: "Small pizza with mild cheese and tomato sauce, perfect for children.",
        ingredients: ["pizza dough", "tomato sauce", "mozzarella", "corn"],
        nutritionInfo: "Calories: 320kcal | Protein: 12g | Carbs: 44g | Fat: 10g",
        stockAvailable: true,
        image: "https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?w=400&h=400&fit=crop",
        categoryName: "Pizza",
    },
    {
        name: "Supreme Pizza with Beef Topping",
        price: 11.21,
        subcategory: "Signature",
        description: "Loaded pizza with premium beef, mushrooms, peppers and extra cheese.",
        ingredients: ["pizza dough", "beef", "mushrooms", "bell pepper", "mozzarella", "olive"],
        nutritionInfo: "Calories: 680kcal | Protein: 32g | Carbs: 58g | Fat: 28g",
        stockAvailable: true,
        image: "https://images.unsplash.com/photo-1528137871618-79d2761e3fd5?w=400&h=400&fit=crop",
        categoryName: "Pizza",
    },
    {
        name: "Margarita Pizza with Random Topping",
        price: 8.15,
        subcategory: "Classic",
        description: "Traditional margarita pizza with fresh mozzarella and basil.",
        ingredients: ["pizza dough", "tomato sauce", "fresh mozzarella", "basil", "olive oil"],
        nutritionInfo: "Calories: 420kcal | Protein: 18g | Carbs: 52g | Fat: 14g",
        stockAvailable: true,
        image: "https://images.unsplash.com/photo-1574071318508-1cdbab80d002?w=400&h=400&fit=crop",
        categoryName: "Pizza",
    },
    {
        name: "Tuna Soup Spinach with Himalayan Salt",
        price: 7.25,
        subcategory: "Healthy",
        description: "Light and healthy tuna soup with fresh spinach and Himalayan pink salt.",
        ingredients: ["tuna", "spinach", "Himalayan salt", "garlic", "olive oil", "vegetable broth"],
        nutritionInfo: "Calories: 210kcal | Protein: 28g | Carbs: 8g | Fat: 6g",
        stockAvailable: true,
        image: "https://images.unsplash.com/photo-1547592166-23ac45744acd?w=400&h=400&fit=crop",
        categoryName: "Soup",
    },
    {
        name: "Classic Beef Burger",
        price: 9.99,
        subcategory: "Classic",
        description: "Juicy beef patty with lettuce, tomato, pickles and special sauce.",
        ingredients: ["beef patty", "burger bun", "lettuce", "tomato", "pickles", "special sauce"],
        nutritionInfo: "Calories: 580kcal | Protein: 35g | Carbs: 42g | Fat: 26g",
        stockAvailable: true,
        image: "https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=400&h=400&fit=crop",
        categoryName: "Burger",
    },
    {
        name: "Fresh Orange Juice",
        price: 3.50,
        subcategory: "Fresh Juice",
        description: "Freshly squeezed orange juice with no added sugar.",
        ingredients: ["orange"],
        nutritionInfo: "Calories: 110kcal | Vitamin C: 124mg | Sugar: 21g",
        stockAvailable: true,
        image: "https://images.unsplash.com/photo-1621506289937-a8e4df240d0b?w=400&h=400&fit=crop",
        categoryName: "Drinks",
    },
    {
        name: "Chocolate Lava Cake",
        price: 6.75,
        subcategory: "Hot Desserts",
        description: "Warm chocolate cake with a gooey molten center, served with vanilla ice cream.",
        ingredients: ["chocolate", "butter", "eggs", "flour", "sugar", "vanilla ice cream"],
        nutritionInfo: "Calories: 480kcal | Protein: 8g | Carbs: 52g | Fat: 26g",
        stockAvailable: false,
        image: "https://images.unsplash.com/photo-1624353365286-3f8d62daad51?w=400&h=400&fit=crop",
        categoryName: "Desserts",
    },
];

const customers = [
    { name: "Samantha Williams", email: "samantha@mail.com", phone: "+1 234 567 890", address: "123 Oak St, London", balance: 9425 },
    { name: "Daniel Kim",        email: "daniel@mail.com",   phone: "+1 234 567 891", address: "45 Pine Ave, London",  balance: 3200 },
    { name: "Amina Hassan",      email: "amina@mail.com",    phone: "+1 234 567 892", address: "78 Elm Rd, London",   balance: 5800 },
    { name: "Marcus Lee",        email: "marcus@mail.com",   phone: "+1 234 567 893", address: "12 Maple Dr, London", balance: 1500 },
    { name: "Priya Sharma",      email: "priya@mail.com",    phone: "+1 234 567 894", address: "34 Cedar Ln, London", balance: 7200 },
];

const reviewsData = [
    { name: "Jons Sena",        image: "https://i.pravatar.cc/40?img=11", text: "Amazing food! The spaghetti was perfectly cooked and the sauce was incredible.", rating: 4.5, foodImage: "https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=80&h=80&fit=crop" },
    { name: "Sofia",            image: "https://i.pravatar.cc/40?img=5",  text: "Great pizza, fresh ingredients and fast delivery. Will definitely order again!", rating: 4.0, foodImage: "https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?w=80&h=80&fit=crop" },
    { name: "Anandreansyah",    image: "https://i.pravatar.cc/40?img=8",  text: "The burger was juicy and the fries were crispy. Excellent value for money.", rating: 4.5, foodImage: "https://images.unsplash.com/photo-1555939594-58d7cb561ad1?w=80&h=80&fit=crop" },
    { name: "Marcus Lee",       image: "https://i.pravatar.cc/40?img=12", text: "Best restaurant in town! The chocolate lava cake is absolutely divine.", rating: 5.0, foodImage: "https://images.unsplash.com/photo-1567620905732-2d1ec7ab7445?w=80&h=80&fit=crop" },
    { name: "Priya Sharma",     image: "https://i.pravatar.cc/40?img=9",  text: "Good food overall. The soup was a bit salty but the portion was generous.", rating: 3.5, foodImage: "https://images.unsplash.com/photo-1504674900247-0877df9cc836?w=80&h=80&fit=crop" },
];

async function seed() {
    await mongoose.connect(process.env.MONGO_URI);
    console.log("MongoDB connected");

    // Categories
    await Category.deleteMany({});
    const createdCats = await Category.insertMany(categories);
    const catMap = {};
    createdCats.forEach(c => { catMap[c.name] = c._id; });
    console.log("Categories seeded:", createdCats.length);

    // Foods
    await Food.deleteMany({});
    const foodDocs = foods.map(f => ({
        ...f,
        category: catMap[f.categoryName],
        categoryName: undefined,
    }));
    const createdFoods = await Food.insertMany(foodDocs);
    console.log("Foods seeded:", createdFoods.length);

    // Customers
    await Customer.deleteMany({});
    const createdCustomers = await Customer.insertMany(customers);
    console.log("Customers seeded:", createdCustomers.length);

    // Orders
    await Order.deleteMany({});
    const statuses = ["pending", "cooking", "ready", "delivered", "cancelled"];
    const orderDocs = [];
    for (let i = 0; i < 20; i++) {
        const food1 = createdFoods[i % createdFoods.length];
        const food2 = createdFoods[(i + 2) % createdFoods.length];
        const qty1 = Math.ceil(Math.random() * 3);
        const qty2 = Math.ceil(Math.random() * 2);
        const total = food1.price * qty1 + food2.price * qty2;
        const daysAgo = Math.floor(Math.random() * 30);
        const date = new Date();
        date.setDate(date.getDate() - daysAgo);

        orderDocs.push({
            customerName: createdCustomers[i % createdCustomers.length].name,
            foods: [
                { foodId: food1._id, quantity: qty1 },
                { foodId: food2._id, quantity: qty2 },
            ],
            totalPrice: parseFloat(total.toFixed(2)),
            orderNumber: i + 1,
            status: statuses[i % statuses.length],
            createdAt: date,
        });
    }
    await Order.insertMany(orderDocs);
    console.log("Orders seeded:", orderDocs.length);

    // Reviews
    await Review.deleteMany({});
    await Review.insertMany(reviewsData);
    console.log("Reviews seeded:", reviewsData.length);

    console.log("\nSeed completed!");
    process.exit(0);
}

seed().catch(err => {
    console.error(err);
    process.exit(1);
});
