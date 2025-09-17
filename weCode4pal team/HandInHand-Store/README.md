# HandInHand Store

**Where Every Purchase Makes a Difference**  

HandInHand Store is a web-based platform that allows users to explore, buy, and donate new and used products. It combines e-commerce with social impact by dedicating a donation percentage from every purchase to charitable causes.  

---

## 🚀 Features  

- **User Accounts & Authentication**  
  - Sign Up & Login  
  - Email / Code Verification  
  - Password Recovery  
  - Profile Management  

- **Product Management**  
  - Browse new & used products  
  - Search & filter by categories  
  - Product images & details  

- **Donation Integration**  
  - Each product shows donation percentage  
  - Purchases contribute to real causes  

---

## 🛠️ Tech Stack  

- **Frontend:** React.js  
- **Backend:** Spring Boot (Java)  
- **Database:** MySQL   
- **Other Tools:** Figma (UI/UX design), OBS (demo recording)  

---

## ⚙️ Setup & Installation  

### 1. Clone the Repository  
```bash
git clone https://github.com/your-username/HandInHand-Store.git
cd HandInHand-Store
```

### 2. Backend (Spring Boot)  
1. Navigate to the backend folder:  
   ```bash
   cd backend
   ```
2. Configure `application.properties`:  
   ```properties
   spring.datasource.url=jdbc:mysql://localhost:3306/handinhand_db
   spring.datasource.username=your_username
   spring.datasource.password=your_password
   spring.jpa.hibernate.ddl-auto=update
   spring.jpa.show-sql=true

   ```
3. Run the Spring Boot app:  
   ```bash
   mvn spring-boot:run
   ```

### 3. Database (MySQL)  
- Import the SQL script from `/database/handinhand.sql` into your MySQL server.  
- Make sure the database name matches `handinhand_db` or update it in `application.properties`.  

### 4. Frontend (React)  
1. Navigate to the frontend folder:  
   ```bash
   cd frontend
   ```
2. Install dependencies:  
   ```bash
   npm install
   ```
3. Run the development server:  
   ```bash
   npm start
   ```
4. The frontend will be available at:  
   [http://localhost:3000](http://localhost:3000)  

---

### 5. Design (Figma)

You can view the project design here:  
👉 [HandInHand Store – Figma Design]([https://www.figma.com/file/xxxx/HandInHand-Store](https://www.figma.com/design/BBMlDiyXBKqTJdsMWF8ZMI/HandInHand-Store?node-id=0-1&t=S44iWXMB6GQ4LmJk-1))


---


### 📂 Project Structure  

HandInHand-Store/
│── frontend/       # React.js code  
│── backend/        # Spring Boot code  
│── database/       # SQL scripts  
│── README.md       # Project documentation  


---

### 👩‍💻 Contributors  

- **Chaima** – Back-end development, design.
- **Rana** - Front-end development

---

👉 *Hand in Hand, We Change Lives.*  
