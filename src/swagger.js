const swaggerJsdoc = require("swagger-jsdoc");

const options = {
    definition: {
        openapi: "3.0.0",
        info: {
            title: "Restaurant Backend API",
            version: "2.0.0",
            description: "Restaurant boshqaruv tizimi uchun API dokumentatsiya",
        },
        servers: [{ url: "http://localhost:8001" }],
        components: {
            securitySchemes: {
                bearerAuth: {
                    type: "http",
                    scheme: "bearer",
                    bearerFormat: "JWT",
                },
            },
            schemas: {
                LoginBody: {
                    type: "object",
                    required: ["login", "password"],
                    properties: {
                        login: { type: "string", example: "admin" },
                        password: { type: "string", example: "123456" },
                    },
                },
                RegisterBody: {
                    type: "object",
                    required: ["name", "surname", "login", "password"],
                    properties: {
                        name:     { type: "string", example: "Ali" },
                        surname:  { type: "string", example: "Valiyev" },
                        login:    { type: "string", example: "admin" },
                        password: { type: "string", example: "123456" },
                    },
                },
                UpdateProfileBody: {
                    type: "object",
                    properties: {
                        fullname: { type: "string", example: "Ali Valiyev" },
                        email:    { type: "string", example: "ali@example.com" },
                        phone:    { type: "string", example: "+998901234567" },
                        location: { type: "string", example: "Tashkent" },
                    },
                },
                UpdatePasswordBody: {
                    type: "object",
                    required: ["currentPassword", "newPassword"],
                    properties: {
                        currentPassword: { type: "string", example: "eskiParol123" },
                        newPassword:     { type: "string", example: "yangiParol456" },
                    },
                },
            },
        },
        tags: [
            { name: "Auth",       description: "Autentifikatsiya va profil" },
            { name: "Admin",      description: "Admin boshqaruvi" },
            { name: "Chef",       description: "Oshpaz boshqaruvi" },
            { name: "Food",       description: "Taomlar" },
            { name: "Categories", description: "Kategoriyalar" },
            { name: "Orders",     description: "Buyurtmalar" },
            { name: "Reviews",    description: "Sharhlar" },
            { name: "Customers",  description: "Mijozlar" },
            { name: "Wallet",     description: "Hamyon" },
            { name: "Chat",       description: "Chat" },
            { name: "Events",     description: "Tadbirlar" },
            { name: "Dashboard",  description: "Dashboard statistika" },
        ],
        paths: {
            /* ── AUTH ──────────────────────────────────────────────── */
            "/api/auth/register": {
                post: {
                    tags: ["Auth"],
                    summary: "Admin yaratish",
                    requestBody: {
                        required: true,
                        content: { "application/json": { schema: { $ref: "#/components/schemas/RegisterBody" } } },
                    },
                    responses: {
                        201: { description: "Admin muvaffaqiyatli yaratildi" },
                        400: { description: "Login allaqachon mavjud yoki maydonlar to'ldirilmagan" },
                    },
                },
            },
            "/api/auth/login": {
                post: {
                    tags: ["Auth"],
                    summary: "Login (admin / chef / cashier)",
                    requestBody: {
                        required: true,
                        content: { "application/json": { schema: { $ref: "#/components/schemas/LoginBody" } } },
                    },
                    responses: {
                        200: { description: "Token qaytariladi" },
                        400: { description: "Noto'g'ri parol" },
                        404: { description: "Foydalanuvchi topilmadi" },
                    },
                },
            },
            "/api/auth/me": {
                get: {
                    tags: ["Auth"],
                    summary: "Profilni ko'rish",
                    security: [{ bearerAuth: [] }],
                    responses: {
                        200: { description: "Foydalanuvchi ma'lumotlari" },
                        401: { description: "Token yo'q yoki noto'g'ri" },
                    },
                },
                put: {
                    tags: ["Auth"],
                    summary: "Profilni yangilash (fullname, email, phone, location)",
                    security: [{ bearerAuth: [] }],
                    requestBody: {
                        required: true,
                        content: { "application/json": { schema: { $ref: "#/components/schemas/UpdateProfileBody" } } },
                    },
                    responses: {
                        200: { description: "Profil yangilandi" },
                        401: { description: "Token yo'q yoki noto'g'ri" },
                    },
                },
            },
            "/api/auth/me/password": {
                put: {
                    tags: ["Auth"],
                    summary: "Passwordni yangilash",
                    security: [{ bearerAuth: [] }],
                    requestBody: {
                        required: true,
                        content: { "application/json": { schema: { $ref: "#/components/schemas/UpdatePasswordBody" } } },
                    },
                    responses: {
                        200: { description: "Parol yangilandi" },
                        400: { description: "Joriy parol noto'g'ri yoki yangi parol juda qisqa" },
                        401: { description: "Token yo'q yoki noto'g'ri" },
                    },
                },
            },

            /* ── ADMIN ─────────────────────────────────────────────── */
            "/api/admin": {
                get: {
                    tags: ["Admin"],
                    summary: "Barcha adminlarni olish",
                    security: [{ bearerAuth: [] }],
                    responses: { 200: { description: "Adminlar ro'yxati" } },
                },
            },
            "/api/admin/{id}": {
                get: {
                    tags: ["Admin"],
                    summary: "Admin ma'lumotlari",
                    security: [{ bearerAuth: [] }],
                    parameters: [{ name: "id", in: "path", required: true, schema: { type: "string" } }],
                    responses: { 200: { description: "Admin topildi" }, 404: { description: "Topilmadi" } },
                },
                put: {
                    tags: ["Admin"],
                    summary: "Admin yangilash",
                    security: [{ bearerAuth: [] }],
                    parameters: [{ name: "id", in: "path", required: true, schema: { type: "string" } }],
                    requestBody: { content: { "application/json": { schema: { type: "object" } } } },
                    responses: { 200: { description: "Yangilandi" } },
                },
                delete: {
                    tags: ["Admin"],
                    summary: "Admin o'chirish",
                    security: [{ bearerAuth: [] }],
                    parameters: [{ name: "id", in: "path", required: true, schema: { type: "string" } }],
                    responses: { 200: { description: "O'chirildi" } },
                },
            },

            /* ── CHEF ──────────────────────────────────────────────── */
            "/api/chef": {
                get: {
                    tags: ["Chef"],
                    summary: "Barcha oshpazlarni olish",
                    security: [{ bearerAuth: [] }],
                    responses: { 200: { description: "Oshpazlar ro'yxati" } },
                },
                post: {
                    tags: ["Chef"],
                    summary: "Oshpaz qo'shish",
                    security: [{ bearerAuth: [] }],
                    requestBody: { content: { "application/json": { schema: { type: "object" } } } },
                    responses: { 201: { description: "Oshpaz yaratildi" } },
                },
            },
            "/api/chef/{id}": {
                get: {
                    tags: ["Chef"],
                    summary: "Oshpaz ma'lumotlari",
                    security: [{ bearerAuth: [] }],
                    parameters: [{ name: "id", in: "path", required: true, schema: { type: "string" } }],
                    responses: { 200: { description: "Oshpaz topildi" } },
                },
                put: {
                    tags: ["Chef"],
                    summary: "Oshpaz yangilash",
                    security: [{ bearerAuth: [] }],
                    parameters: [{ name: "id", in: "path", required: true, schema: { type: "string" } }],
                    requestBody: { content: { "application/json": { schema: { type: "object" } } } },
                    responses: { 200: { description: "Yangilandi" } },
                },
                delete: {
                    tags: ["Chef"],
                    summary: "Oshpaz o'chirish",
                    security: [{ bearerAuth: [] }],
                    parameters: [{ name: "id", in: "path", required: true, schema: { type: "string" } }],
                    responses: { 200: { description: "O'chirildi" } },
                },
            },

            /* ── FOOD ──────────────────────────────────────────────── */
            "/api/food": {
                get: {
                    tags: ["Food"],
                    summary: "Barcha taomlar",
                    responses: { 200: { description: "Taomlar ro'yxati" } },
                },
                post: {
                    tags: ["Food"],
                    summary: "Taom qo'shish",
                    security: [{ bearerAuth: [] }],
                    requestBody: { content: { "multipart/form-data": { schema: { type: "object" } } } },
                    responses: { 201: { description: "Taom yaratildi" } },
                },
            },
            "/api/food/{id}": {
                get: {
                    tags: ["Food"],
                    summary: "Taom ma'lumotlari",
                    parameters: [{ name: "id", in: "path", required: true, schema: { type: "string" } }],
                    responses: { 200: { description: "Taom topildi" } },
                },
                put: {
                    tags: ["Food"],
                    summary: "Taom yangilash",
                    security: [{ bearerAuth: [] }],
                    parameters: [{ name: "id", in: "path", required: true, schema: { type: "string" } }],
                    requestBody: { content: { "multipart/form-data": { schema: { type: "object" } } } },
                    responses: { 200: { description: "Yangilandi" } },
                },
                delete: {
                    tags: ["Food"],
                    summary: "Taom o'chirish",
                    security: [{ bearerAuth: [] }],
                    parameters: [{ name: "id", in: "path", required: true, schema: { type: "string" } }],
                    responses: { 200: { description: "O'chirildi" } },
                },
            },

            /* ── CATEGORIES ────────────────────────────────────────── */
            "/api/categories": {
                get: {
                    tags: ["Categories"],
                    summary: "Barcha kategoriyalar",
                    responses: { 200: { description: "Kategoriyalar ro'yxati" } },
                },
                post: {
                    tags: ["Categories"],
                    summary: "Kategoriya qo'shish",
                    security: [{ bearerAuth: [] }],
                    requestBody: { content: { "application/json": { schema: { type: "object", properties: { name: { type: "string" } } } } } },
                    responses: { 201: { description: "Kategoriya yaratildi" } },
                },
            },
            "/api/categories/{id}": {
                put: {
                    tags: ["Categories"],
                    summary: "Kategoriya yangilash",
                    security: [{ bearerAuth: [] }],
                    parameters: [{ name: "id", in: "path", required: true, schema: { type: "string" } }],
                    requestBody: { content: { "application/json": { schema: { type: "object" } } } },
                    responses: { 200: { description: "Yangilandi" } },
                },
                delete: {
                    tags: ["Categories"],
                    summary: "Kategoriya o'chirish",
                    security: [{ bearerAuth: [] }],
                    parameters: [{ name: "id", in: "path", required: true, schema: { type: "string" } }],
                    responses: { 200: { description: "O'chirildi" } },
                },
            },

            /* ── ORDERS ────────────────────────────────────────────── */
            "/api/orders": {
                get: {
                    tags: ["Orders"],
                    summary: "Barcha buyurtmalar",
                    security: [{ bearerAuth: [] }],
                    responses: { 200: { description: "Buyurtmalar ro'yxati" } },
                },
                post: {
                    tags: ["Orders"],
                    summary: "Buyurtma yaratish",
                    security: [{ bearerAuth: [] }],
                    requestBody: { content: { "application/json": { schema: { type: "object" } } } },
                    responses: { 201: { description: "Buyurtma yaratildi" } },
                },
            },
            "/api/orders/{id}": {
                get: {
                    tags: ["Orders"],
                    summary: "Buyurtma ma'lumotlari",
                    security: [{ bearerAuth: [] }],
                    parameters: [{ name: "id", in: "path", required: true, schema: { type: "string" } }],
                    responses: { 200: { description: "Buyurtma topildi" } },
                },
                put: {
                    tags: ["Orders"],
                    summary: "Buyurtma holatini yangilash",
                    security: [{ bearerAuth: [] }],
                    parameters: [{ name: "id", in: "path", required: true, schema: { type: "string" } }],
                    requestBody: { content: { "application/json": { schema: { type: "object" } } } },
                    responses: { 200: { description: "Yangilandi" } },
                },
                delete: {
                    tags: ["Orders"],
                    summary: "Buyurtma o'chirish",
                    security: [{ bearerAuth: [] }],
                    parameters: [{ name: "id", in: "path", required: true, schema: { type: "string" } }],
                    responses: { 200: { description: "O'chirildi" } },
                },
            },

            /* ── REVIEWS ───────────────────────────────────────────── */
            "/api/reviews": {
                get: {
                    tags: ["Reviews"],
                    summary: "Barcha sharhlar",
                    responses: { 200: { description: "Sharhlar ro'yxati" } },
                },
                post: {
                    tags: ["Reviews"],
                    summary: "Sharh qo'shish",
                    security: [{ bearerAuth: [] }],
                    requestBody: { content: { "application/json": { schema: { type: "object" } } } },
                    responses: { 201: { description: "Sharh yaratildi" } },
                },
            },
            "/api/reviews/{id}": {
                delete: {
                    tags: ["Reviews"],
                    summary: "Sharh o'chirish",
                    security: [{ bearerAuth: [] }],
                    parameters: [{ name: "id", in: "path", required: true, schema: { type: "string" } }],
                    responses: { 200: { description: "O'chirildi" } },
                },
            },

            /* ── CUSTOMERS ─────────────────────────────────────────── */
            "/api/customers": {
                get: {
                    tags: ["Customers"],
                    summary: "Barcha mijozlar",
                    security: [{ bearerAuth: [] }],
                    responses: { 200: { description: "Mijozlar ro'yxati" } },
                },
            },
            "/api/customers/{id}": {
                get: {
                    tags: ["Customers"],
                    summary: "Mijoz ma'lumotlari",
                    security: [{ bearerAuth: [] }],
                    parameters: [{ name: "id", in: "path", required: true, schema: { type: "string" } }],
                    responses: { 200: { description: "Mijoz topildi" } },
                },
                delete: {
                    tags: ["Customers"],
                    summary: "Mijoz o'chirish",
                    security: [{ bearerAuth: [] }],
                    parameters: [{ name: "id", in: "path", required: true, schema: { type: "string" } }],
                    responses: { 200: { description: "O'chirildi" } },
                },
            },

            /* ── WALLET ────────────────────────────────────────────── */
            "/api/wallet": {
                get: {
                    tags: ["Wallet"],
                    summary: "Hamyon ma'lumotlari",
                    security: [{ bearerAuth: [] }],
                    responses: { 200: { description: "Hamyon" } },
                },
            },

            /* ── CHAT ──────────────────────────────────────────────── */
            "/api/chat/{room}": {
                get: {
                    tags: ["Chat"],
                    summary: "Xona xabarlarini olish",
                    security: [{ bearerAuth: [] }],
                    parameters: [{ name: "room", in: "path", required: true, schema: { type: "string", example: "general" } }],
                    responses: { 200: { description: "Xabarlar ro'yxati" } },
                },
            },

            /* ── EVENTS ────────────────────────────────────────────── */
            "/api/events": {
                get: {
                    tags: ["Events"],
                    summary: "Barcha tadbirlar",
                    responses: { 200: { description: "Tadbirlar ro'yxati" } },
                },
                post: {
                    tags: ["Events"],
                    summary: "Tadbir qo'shish",
                    security: [{ bearerAuth: [] }],
                    requestBody: { content: { "application/json": { schema: { type: "object" } } } },
                    responses: { 201: { description: "Tadbir yaratildi" } },
                },
            },
            "/api/events/{id}": {
                put: {
                    tags: ["Events"],
                    summary: "Tadbir yangilash",
                    security: [{ bearerAuth: [] }],
                    parameters: [{ name: "id", in: "path", required: true, schema: { type: "string" } }],
                    requestBody: { content: { "application/json": { schema: { type: "object" } } } },
                    responses: { 200: { description: "Yangilandi" } },
                },
                delete: {
                    tags: ["Events"],
                    summary: "Tadbir o'chirish",
                    security: [{ bearerAuth: [] }],
                    parameters: [{ name: "id", in: "path", required: true, schema: { type: "string" } }],
                    responses: { 200: { description: "O'chirildi" } },
                },
            },

            /* ── DASHBOARD ─────────────────────────────────────────── */
            "/api/dashboard": {
                get: {
                    tags: ["Dashboard"],
                    summary: "Dashboard statistika",
                    security: [{ bearerAuth: [] }],
                    responses: { 200: { description: "Statistika ma'lumotlari" } },
                },
            },
        },
    },
    apis: [],
};

module.exports = swaggerJsdoc(options);
