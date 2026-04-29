const Category    = require("../models/category.model");
const Food        = require("../models/food.model");
const Order       = require("../models/order.model");
const Customer    = require("../models/customer.model");
const Review      = require("../models/review.model");
const Transaction = require("../models/transaction.model");

const daysAgo = (n) => { const d = new Date(); d.setDate(d.getDate() - n); return d; };
const pick = (arr, i) => arr[i % arr.length];

const categories = [
    { name: "Pizza",     description: "Turli xil pitsalar" },
    { name: "Burger",    description: "Burger va sandvichlar" },
    { name: "Pasta",     description: "Italyan pasta taomlar" },
    { name: "Sushi",     description: "Yapon oshxonasi" },
    { name: "Starters",  description: "Salat va kirish taomlar" },
    { name: "Drinks",    description: "Ichimliklar" },
    { name: "Desserts",  description: "Shirinliklar" },
];

const foodsByCategory = {
    Pizza: [
        { name: "Margherita Pizza",     price: 45000, image: "https://images.unsplash.com/photo-1574071318508-1cdbab80d002?w=400&h=400&fit=crop", description: "Klassik italyan margerita pitsa", ingredients: ["xamir", "pomidor sousi", "mozzarella", "rayhon"], nutritionInfo: "Calories: 750kcal | Protein: 28g | Carbs: 90g | Fat: 28g", stockAvailable: true },
        { name: "Pepperoni Pizza",      price: 52000, image: "https://images.unsplash.com/photo-1628840042765-356cda07504e?w=400&h=400&fit=crop", description: "Pepperoni va mozzarella bilan pitsa", ingredients: ["xamir", "pepperoni", "mozzarella", "pomidor sousi"], nutritionInfo: "Calories: 850kcal | Protein: 35g | Carbs: 88g | Fat: 38g", stockAvailable: true },
        { name: "BBQ Chicken Pizza",    price: 55000, image: "https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?w=400&h=400&fit=crop", description: "BBQ sousi va tovuq go'shti bilan", ingredients: ["xamir", "tovuq", "BBQ sousi", "mozzarella", "qo'ng'ir piyoz"], nutritionInfo: "Calories: 900kcal | Protein: 42g | Carbs: 85g | Fat: 32g", stockAvailable: true },
    ],
    Burger: [
        { name: "Classic Beef Burger",  price: 38000, image: "https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=400&h=400&fit=crop", description: "Klassik mol go'shti burger", ingredients: ["mol go'shti", "salat", "pomidor", "achuchuk", "sousi"], nutritionInfo: "Calories: 580kcal | Protein: 35g | Carbs: 42g | Fat: 26g", stockAvailable: true },
        { name: "Double Smash Burger",  price: 55000, image: "https://images.unsplash.com/photo-1553979459-d2229ba7433b?w=400&h=400&fit=crop", description: "Ikki qatlam mol go'shti burger", ingredients: ["mol go'shti x2", "cheddar", "achuchuk", "sousi"], nutritionInfo: "Calories: 820kcal | Protein: 52g | Carbs: 45g | Fat: 48g", stockAvailable: true },
        { name: "Chicken Burger",       price: 35000, image: "https://images.unsplash.com/photo-1572802419224-296b0aeee0d9?w=400&h=400&fit=crop", description: "Qovurilgan tovuq burger", ingredients: ["tovuq filé", "salat", "pomidor", "mayo"], nutritionInfo: "Calories: 520kcal | Protein: 38g | Carbs: 44g | Fat: 20g", stockAvailable: true },
    ],
    Pasta: [
        { name: "Spaghetti Bolognese",  price: 48000, image: "https://images.unsplash.com/photo-1621996346565-e3dbc646d9a9?w=400&h=400&fit=crop", description: "Italyan bolonez pasta", ingredients: ["spaghetti", "mol go'shti", "pomidor sousi", "piyoz", "sarimsoq"], nutritionInfo: "Calories: 620kcal | Protein: 28g | Carbs: 78g | Fat: 18g", stockAvailable: true },
        { name: "Pasta Carbonara",      price: 52000, image: "https://images.unsplash.com/photo-1612874742237-6526221588e3?w=400&h=400&fit=crop", description: "Krem sousi va bekon bilan pasta", ingredients: ["pasta", "bekon", "tuxum", "parmesan", "qora murch"], nutritionInfo: "Calories: 680kcal | Protein: 30g | Carbs: 72g | Fat: 28g", stockAvailable: true },
        { name: "Beef Tacos",           price: 38000, image: "https://images.unsplash.com/photo-1565299585323-38d6b0865b47?w=400&h=400&fit=crop", description: "Mol go'shti bilan taco", ingredients: ["taco qobig'i", "mol go'shti", "avokado", "limon", "salsa"], nutritionInfo: "Calories: 480kcal | Protein: 25g | Carbs: 45g | Fat: 20g", stockAvailable: true },
    ],
    Sushi: [
        { name: "Sushi California Roll", price: 65000, image: "https://images.unsplash.com/photo-1617196034183-421b4040ed20?w=400&h=400&fit=crop", description: "Klassik Kaliforniya roll", ingredients: ["guruch", "dengiz mahsulotlari", "avokado", "nori"], nutritionInfo: "Calories: 320kcal | Protein: 15g | Carbs: 52g | Fat: 8g", stockAvailable: true },
        { name: "Salmon Nigiri",         price: 72000, image: "https://images.unsplash.com/photo-1617196034199-6e9f7e1d8a3c?w=400&h=400&fit=crop", description: "Yangi losos bilan nigiri", ingredients: ["guruch", "losos", "soya sousi", "wasabi"], nutritionInfo: "Calories: 280kcal | Protein: 18g | Carbs: 38g | Fat: 7g", stockAvailable: true },
        { name: "Beef Shawarma",         price: 42000, image: "https://images.unsplash.com/photo-1529006557810-274b9b2fc783?w=400&h=400&fit=crop", description: "Sharqona mol go'shti shovarma", ingredients: ["mol go'shti", "pitabread", "sabzavotlar", "sousi"], nutritionInfo: "Calories: 520kcal | Protein: 30g | Carbs: 55g | Fat: 18g", stockAvailable: true },
    ],
    Starters: [
        { name: "Caesar Salad",         price: 28000, image: "https://images.unsplash.com/photo-1546793665-c74683f339c1?w=400&h=400&fit=crop", description: "Klassik Sezar salati", ingredients: ["romaine salat", "kreker", "parmezan", "sezar sousi"], nutritionInfo: "Calories: 320kcal | Protein: 12g | Carbs: 18g | Fat: 24g", stockAvailable: true },
        { name: "Chicken Wings",         price: 42000, image: "https://images.unsplash.com/photo-1527477396000-e27163b481c2?w=400&h=400&fit=crop", description: "Qovurilgan tovuq qanotlari", ingredients: ["tovuq qanotlari", "BBQ sousi", "asal", "sarimsoq"], nutritionInfo: "Calories: 420kcal | Protein: 32g | Carbs: 12g | Fat: 28g", stockAvailable: true },
        { name: "French Fries",          price: 18000, image: "https://images.unsplash.com/photo-1573080496219-bb080dd4f877?w=400&h=400&fit=crop", description: "Qaynar kartoshka fri", ingredients: ["kartoshka", "tuz", "o'simlik yog'i"], nutritionInfo: "Calories: 365kcal | Protein: 4g | Carbs: 48g | Fat: 18g", stockAvailable: true },
        { name: "Onion Rings",           price: 15000, image: "https://images.unsplash.com/photo-1639024471283-03518883512d?w=400&h=400&fit=crop", description: "Qovurilgan piyoz xalqalari", ingredients: ["piyoz", "un", "tuxum", "sut", "tuz"], nutritionInfo: "Calories: 290kcal | Protein: 5g | Carbs: 38g | Fat: 14g", stockAvailable: true },
        { name: "Mozzarella Sticks",     price: 22000, image: "https://images.unsplash.com/photo-1548340748-6fe1a08b5bb0?w=400&h=400&fit=crop", description: "Mozzarella pishloqli tayoqchalar", ingredients: ["mozzarella", "un", "tuxum", "krakerlar"], nutritionInfo: "Calories: 340kcal | Protein: 14g | Carbs: 28g | Fat: 20g", stockAvailable: true },
    ],
    Drinks: [
        { name: "Classic Cola",          price: 12000, image: "https://images.unsplash.com/photo-1554866585-cd94860890b7?w=400&h=400&fit=crop", description: "Sovuq klassik kola", ingredients: ["kola"], nutritionInfo: "Calories: 140kcal | Sugar: 39g", stockAvailable: true },
        { name: "Fresh Orange Juice",    price: 22000, image: "https://images.unsplash.com/photo-1621506289937-a8e4df240d0b?w=400&h=400&fit=crop", description: "Yangi siqilgan apelsin sharbati", ingredients: ["apelsin"], nutritionInfo: "Calories: 110kcal | Vitamin C: 124mg | Sugar: 21g", stockAvailable: true },
        { name: "Mango Smoothie",        price: 25000, image: "https://images.unsplash.com/photo-1553530666-ba11a7da3888?w=400&h=400&fit=crop", description: "Yangi mango smoothie", ingredients: ["mango", "sut", "asal", "muz"], nutritionInfo: "Calories: 185kcal | Protein: 4g | Sugar: 32g", stockAvailable: true },
        { name: "Cappuccino",            price: 20000, image: "https://images.unsplash.com/photo-1572442388796-11668a67e53d?w=400&h=400&fit=crop", description: "Italyan kapuchino", ingredients: ["espresso", "bug' suti"], nutritionInfo: "Calories: 120kcal | Protein: 6g | Fat: 4g", stockAvailable: true },
        { name: "Matcha Latte",          price: 24000, image: "https://images.unsplash.com/photo-1536256263959-770b48d82b0a?w=400&h=400&fit=crop", description: "Yapon matcha latte", ingredients: ["matcha", "sut", "shakar"], nutritionInfo: "Calories: 160kcal | Protein: 5g | Fat: 5g | Antioxidants: high", stockAvailable: true },
    ],
    Desserts: [
        { name: "Chocolate Cake",        price: 35000, image: "https://images.unsplash.com/photo-1578985545062-69928b1d9587?w=400&h=400&fit=crop", description: "Yumshoq shokolad keki", ingredients: ["un", "shokolad", "tuxum", "sariyog'", "shakar"], nutritionInfo: "Calories: 450kcal | Protein: 6g | Carbs: 58g | Fat: 22g", stockAvailable: true },
        { name: "Cheesecake",            price: 32000, image: "https://images.unsplash.com/photo-1533134242443-d4fd215305ad?w=400&h=400&fit=crop", description: "Kremli pishloq pirog", ingredients: ["krem pishloq", "shakar", "biskvit", "tuxum"], nutritionInfo: "Calories: 400kcal | Protein: 7g | Carbs: 38g | Fat: 24g", stockAvailable: true },
        { name: "Tiramisu",              price: 38000, image: "https://images.unsplash.com/photo-1571877227200-a0d98ea607e9?w=400&h=400&fit=crop", description: "Klassik italyan tiramisu", ingredients: ["mascarpone", "espresso", "ladyfinger biskvit", "kakao"], nutritionInfo: "Calories: 380kcal | Protein: 8g | Carbs: 40g | Fat: 20g", stockAvailable: true },
        { name: "Churros",               price: 25000, image: "https://images.unsplash.com/photo-1624353365286-3f8d62daad51?w=400&h=400&fit=crop", description: "Ispaniyalik churros shokolad sousi bilan", ingredients: ["un", "suv", "tuz", "o'simlik yog'i", "dol", "shakar"], nutritionInfo: "Calories: 280kcal | Protein: 4g | Carbs: 38g | Fat: 12g", stockAvailable: true },
        { name: "Ice Cream Sundae",      price: 28000, image: "https://images.unsplash.com/photo-1563805042-7684c019e1cb?w=400&h=400&fit=crop", description: "Rang-barang muzqaymoq", ingredients: ["muzqaymoq", "sharbat", "krem", "mevalar"], nutritionInfo: "Calories: 320kcal | Protein: 5g | Carbs: 52g | Fat: 14g", stockAvailable: true },
    ],
};

const customers = [
    { name: "Samantha Williams", email: "samantha@mail.com", phone: "+1 234 567 890", address: "123 Oak St, London",     balance: 1250000 },
    { name: "Daniel Kim",        email: "daniel@mail.com",   phone: "+1 234 567 891", address: "45 Pine Ave, London",    balance: 850000  },
    { name: "Amina Hassan",      email: "amina@mail.com",    phone: "+1 234 567 892", address: "78 Elm Rd, London",      balance: 1100000 },
    { name: "Marcus Lee",        email: "marcus@mail.com",   phone: "+1 234 567 893", address: "12 Maple Dr, London",    balance: 620000  },
    { name: "Priya Sharma",      email: "priya@mail.com",    phone: "+1 234 567 894", address: "34 Cedar Ln, London",    balance: 980000  },
    { name: "James Wilson",      email: "james@mail.com",    phone: "+1 234 567 895", address: "56 Baker St, London",    balance: 730000  },
    { name: "Yuki Tanaka",       email: "yuki@mail.com",     phone: "+1 234 567 896", address: "89 Victoria Rd, London", balance: 450000  },
];

const reviewsData = [
    { name: "Samantha Williams", image: "https://i.pravatar.cc/40?img=1",  text: "Taom ajoyib edi! Pizza juda mazali va tezda yetkazib berildi. Yana buyurtma beraman!", rating: 5.0, foodImage: "https://images.unsplash.com/photo-1574071318508-1cdbab80d002?w=80&h=80&fit=crop" },
    { name: "Daniel Kim",        image: "https://i.pravatar.cc/40?img=3",  text: "Burger juda yaxshi edi, fries esa qaynar edi. Narxi ham qulay. Tavsiya etaman!", rating: 4.5, foodImage: "https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=80&h=80&fit=crop" },
    { name: "Amina Hassan",      image: "https://i.pravatar.cc/40?img=5",  text: "Sezar salati mening yoqimli taoim bo'lib qoldi. Har safar buyurtma beraman!", rating: 4.5, foodImage: "https://images.unsplash.com/photo-1546793665-c74683f339c1?w=80&h=80&fit=crop" },
    { name: "Marcus Lee",        image: "https://i.pravatar.cc/40?img=12", text: "Tiramisu hayotda yegan eng yaxshi tiramisu edi. Restoran sifati to'g'risida gap yo'q!", rating: 5.0, foodImage: "https://images.unsplash.com/photo-1571877227200-a0d98ea607e9?w=80&h=80&fit=crop" },
    { name: "Priya Sharma",      image: "https://i.pravatar.cc/40?img=9",  text: "Sushi California Roll zo'r edi, lekin yetkazib berish biroz kechikdi.", rating: 3.5, foodImage: "https://images.unsplash.com/photo-1617196034183-421b4040ed20?w=80&h=80&fit=crop" },
    { name: "James Wilson",      image: "https://i.pravatar.cc/40?img=7",  text: "Pasta Carbonara mukammal edi! Italiyada yeganday his qildim. Rahmat!", rating: 5.0, foodImage: "https://images.unsplash.com/photo-1612874742237-6526221588e3?w=80&h=80&fit=crop" },
    { name: "Yuki Tanaka",       image: "https://i.pravatar.cc/40?img=15", text: "Matcha Latte juda yoqdi. Tabiiy ta'm, ortiqcha shakar yo'q. Mukammal!", rating: 4.0, foodImage: "https://images.unsplash.com/photo-1536256263959-770b48d82b0a?w=80&h=80&fit=crop" },
];

const transactionsData = [
    { type: "income",  amount: 2500000, description: "Catering xizmati — Abdullayev to'yi",       category: "Catering"  },
    { type: "income",  amount: 1800000, description: "Korporativ tushlik — IT kompaniya",          category: "Corporate" },
    { type: "expense", amount: 850000,  description: "Oshxona uchun oziq-ovqat xarid",             category: "Supplies"  },
    { type: "income",  amount: 3200000, description: "Haftalik naqd tushum (24–30 Aprel)",         category: "Cash"      },
    { type: "expense", amount: 1200000, description: "Xodimlar ish haqi — Aprel",                  category: "Salary"    },
    { type: "income",  amount: 950000,  description: "Online buyurtmalar tushumi",                 category: "Online"    },
    { type: "expense", amount: 420000,  description: "Kommunal to'lovlar (gaz, elektr)",           category: "Utilities" },
    { type: "income",  amount: 1450000, description: "Catering xizmati — Hasanov bazmi",          category: "Catering"  },
    { type: "expense", amount: 680000,  description: "Yangi oshxona jihozlari",                   category: "Equipment" },
    { type: "income",  amount: 2100000, description: "Haftalik naqd tushum (17–23 Aprel)",        category: "Cash"      },
    { type: "expense", amount: 390000,  description: "Reklama va marketing xarajatlari",          category: "Marketing" },
    { type: "income",  amount: 760000,  description: "Kechki ziyofat buyurtmasi",                 category: "Events"    },
    { type: "expense", amount: 520000,  description: "Oziq-ovqat xom ashyo xaridi",               category: "Supplies"  },
    { type: "income",  amount: 1900000, description: "Haftalik naqd tushum (10–16 Aprel)",        category: "Cash"      },
    { type: "expense", amount: 310000,  description: "Idish-tovoq yangilash",                     category: "Equipment" },
    { type: "income",  amount: 1100000, description: "Korporativ kechki ziyofat",                 category: "Corporate" },
    { type: "expense", amount: 750000,  description: "Xodimlar ish haqi — Mart",                  category: "Salary"    },
    { type: "income",  amount: 2800000, description: "Haftalik naqd tushum (3–9 Aprel)",          category: "Cash"      },
    { type: "expense", amount: 440000,  description: "Kommunal to'lovlar — Mart",                 category: "Utilities" },
    { type: "income",  amount: 1650000, description: "Catering — Xasan to'yi",                   category: "Catering"  },
    { type: "income",  amount: 2200000, description: "Haftalik naqd tushum (27 Mart – 2 Aprel)",  category: "Cash"      },
    { type: "expense", amount: 870000,  description: "Oziq-ovqat xom ashyo xaridi — Mart",       category: "Supplies"  },
    { type: "income",  amount: 980000,  description: "Kechki ziyofat buyurtmalari",              category: "Events"    },
    { type: "income",  amount: 1750000, description: "Haftalik naqd tushum (20–26 Mart)",        category: "Cash"      },
];

module.exports = async function runSeed() {
    // 1. Categories
    await Category.deleteMany({});
    const createdCats = await Category.insertMany(categories);
    const catMap = {};
    createdCats.forEach(c => { catMap[c.name] = c._id; });

    // 2. Foods
    await Food.deleteMany({});
    const foodDocs = [];
    for (const [catName, items] of Object.entries(foodsByCategory)) {
        items.forEach(f => foodDocs.push({ ...f, category: catMap[catName] }));
    }
    const createdFoods = await Food.insertMany(foodDocs);

    // 3. Customers
    await Customer.deleteMany({});
    const createdCustomers = await Customer.insertMany(customers);

    // 4. Orders — 40 ta, har xil status va sana
    await Order.deleteMany({});
    const statuses  = ["pending", "cooking", "ready", "delivered", "delivered", "delivered", "cancelled"];
    const locations = [
        "Corner Street 5th, London", "Baker Street 221B, London",
        "King's Road 45, London",    "Oxford Street 78, London",
        "Victoria Road 12, London",  "Bond Street 34, London",
        "Regent Street 56, London",
    ];
    const orderDocs = [];
    for (let i = 0; i < 40; i++) {
        const food1 = pick(createdFoods, i);
        const food2 = pick(createdFoods, i + 3);
        const food3 = pick(createdFoods, i + 7);
        const qty1  = (i % 3) + 1;
        const qty2  = (i % 2) + 1;
        const total = food1.price * qty1 + food2.price * qty2 + food3.price;
        orderDocs.push({
            customerName: pick(createdCustomers, i).name,
            location:     pick(locations, i),
            foods: [
                { foodId: food1._id, quantity: qty1 },
                { foodId: food2._id, quantity: qty2 },
                { foodId: food3._id, quantity: 1    },
            ],
            totalPrice:  parseFloat(total.toFixed(0)),
            orderNumber: i + 1,
            status:      pick(statuses, i),
            createdAt:   daysAgo(Math.floor(i * 4.5)),
        });
    }
    await Order.insertMany(orderDocs);

    // 5. Transactions
    await Transaction.deleteMany({});
    await Transaction.insertMany(transactionsData);

    // 6. Reviews
    await Review.deleteMany({});
    await Review.insertMany(reviewsData);

    const deliveredOrders = orderDocs.filter(o => ["delivered", "ready"].includes(o.status));
    const orderRevenue    = deliveredOrders.reduce((s, o) => s + o.totalPrice, 0);
    const manualIncome    = transactionsData.filter(t => t.type === "income").reduce((s, t) => s + t.amount, 0);
    const manualExpense   = transactionsData.filter(t => t.type === "expense").reduce((s, t) => s + t.amount, 0);

    return {
        categories: createdCats.length,
        foods:      createdFoods.length,
        customers:  createdCustomers.length,
        orders:     orderDocs.length,
        transactions: transactionsData.length,
        reviews:    reviewsData.length,
        stats: {
            orderRevenue,
            manualIncome,
            manualExpense,
            balance: orderRevenue + manualIncome - manualExpense,
        },
    };
};
