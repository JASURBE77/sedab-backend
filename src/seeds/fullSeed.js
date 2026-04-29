require("dotenv").config({ path: require("path").join(__dirname, "../../.env") });
const mongoose = require("mongoose");
const runSeed  = require("./fullSeed_fn");

async function main() {
    await mongoose.connect(process.env.MONGO_URI);
    console.log("✅ MongoDB connected");

    const result = await runSeed();

    console.log(`✅ Categories:    ${result.categories}`);
    console.log(`✅ Foods:         ${result.foods}`);
    console.log(`✅ Customers:     ${result.customers}`);
    console.log(`✅ Orders:        ${result.orders}`);
    console.log(`✅ Transactions:  ${result.transactions}`);
    console.log(`✅ Reviews:       ${result.reviews}`);
    console.log("\n📊 Kutilayotgan natijalar:");
    console.log(`   Order Revenue:   ${result.stats.orderRevenue.toLocaleString()} so'm`);
    console.log(`   Manual Income:   ${result.stats.manualIncome.toLocaleString()} so'm`);
    console.log(`   Manual Expense:  ${result.stats.manualExpense.toLocaleString()} so'm`);
    console.log(`   Balance:         ${result.stats.balance.toLocaleString()} so'm`);

    await mongoose.disconnect();
    console.log("\n✅ Full seed completed!");
    process.exit(0);
}

main().catch(err => {
    console.error("❌ Seed error:", err);
    process.exit(1);
});
