# Restaurant Backend — Claude.md

## Loyiha haqida
Node.js + Express + MongoDB asosidagi restoran boshqaruv tizimi.  
Rollar: **admin**, **chef**, **cashier**.

---

## Bajarilgan ishlar

### 1. Profil (GET/PUT /api/auth/me) va Password yangilash (PUT /api/auth/me/password)
**Sana:** 2026-04-24

**Qo'shilgan fieldlar** — Admin, Chef, Cashier modellariga:
- `fullname` — to'liq ism
- `email`
- `phone` (Admin modelida yo'q edi, qo'shildi)
- `location`

**Yangi endpointlar:**

| Method | URL | Tavsif |
|--------|-----|--------|
| `GET` | `/api/auth/me` | Profilni ko'rish |
| `PUT` | `/api/auth/me` | Profilni yangilash |
| `PUT` | `/api/auth/me/password` | Passwordni alohida yangilash |

**Profil yangilash** — `PUT /api/auth/me`
```json
{
  "fullname": "Ali Valiyev",
  "email": "ali@example.com",
  "phone": "+998901234567",
  "location": "Tashkent"
}
```

**Password yangilash** — `PUT /api/auth/me/password`
```json
{
  "currentPassword": "eskiParol123",
  "newPassword": "yangiParol456"
}
```

> Barcha `/me` endpointlar `Authorization: Bearer <token>` talab qiladi.  
> Role tokendan avtomatik aniqlanadi — admin/chef/cashier bitta endpoint ishlatadi.

**O'zgartirilgan fayllar:**
- `src/models/admin.model.js`
- `src/models/chef.model.js`
- `src/models/cashier.model.js`
- `src/controllers/auth.controller.js` — `updateProfile`, `updatePassword` funksiyalari qo'shildi
- `src/routes/auth.routes.js` — `PUT /me`, `PUT /me/password` routelari qo'shildi

---

## API umumiy struktura

```
POST   /api/auth/register         — Admin yaratish
POST   /api/auth/login            — Login (admin/chef/cashier)
GET    /api/auth/me               — Profilni ko'rish
PUT    /api/auth/me               — Profilni yangilash
PUT    /api/auth/me/password      — Passwordni yangilash

/api/admin/*
/api/food/*
/api/orders/*
/api/categories/*
/api/chef/*
/api/reviews/*
/api/customers/*
/api/wallet/*
/api/chat/*
/api/events/*
/api/dashboard/*
```
