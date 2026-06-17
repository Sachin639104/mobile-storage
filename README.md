#  Mobile Store Management System

A full-stack web application to manage mobile phone inventory, sales, and customer records.

---

##  Tech Stack

**Frontend:** React.js, Bootstrap 5, GSAP, Lucide Icons  
**Backend:** Node.js, Express.js  
**Database:** MongoDB (Mongoose)  
**SMS Service:** Twilio (OTP)

---

## Features

###  Authentication
- Register with email, password, phone and role
- Login with username & password
- Forgot password via OTP (SMS)
- Role-based access — Admin & Staff

### Inventory Management
- Add new mobile models
- Update stock quantity and price
- Delete mobile (Admin only)
- Search mobiles by name or brand
- Low stock indicator

### Sales
- Buy mobile — customer details form
- Discount % and GST % calculation
- Payment mode — Cash, Online, Card
- Auto-generated Receipt ID
- 1 year guarantee auto-set

### 📊 Sales History
- View all transactions
- Search by customer name or phone
- Revenue and today's sales summary
- Status — Sold, Returned, Exchanged

### 🔄 Return & Exchange
- Return mobile — stock auto-restored
- Exchange mobile — select new model from inventory
- Price difference auto-calculated
- Print receipt for return and exchange

### 👥 Role Based Access
| Feature | Admin | Staff |
|---------|-------|-------|
| View Inventory | ✅ | ✅ |
| Buy Mobile | ✅ | ✅ |
| Add Stock | ✅ | ❌ |
| Delete Mobile | ✅ | ❌ |
| Restock | ✅ | ❌ |
| Sales History | ✅ | ✅ |

---

## 📁 Project Structure
