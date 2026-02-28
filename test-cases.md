# Test Cases - Campus market 

## Users
- Admin: Responsible for adding/editing/deleting books  
- User: Regular customer  

---

### 1. Successful Login
Steps:  
1. Open Login page  
2. Enter correct email and password  
3. Click Login  

Expected Result:  
- Redirect to homepage  
- appeared message " مرحبا بك في campus market"

---

### 2. Register New User
Steps:  
1. Open registration page  
2. Enter name, new email, password  
3. Click Register now 

Expected Result:  
- Message "Account created successfully" appears  
- User is added to Firebase Auth  

---

### 3. complete personal data
Steps:  
1. write full name
2. choose university
3. choose faculty
4. faculty id
5. phone number
6. whatsapp number(optional)
7. bio (optional)
8. select cv as a file
9. click save data 

Expected Result:  enter to home page 
  
---

### 4. Register Existing User
Steps:  
1. Open registration page  
2. Enter an email that already exists, name, password
3. Click enter   

Expected Result:  
- Error message "error(auth/email-already-in-use)" appears  

---

### 5. Failed Login
Steps:  
1. Open Login page  
2. Enter incorrect email/password  
3. Click Login  

Expected Result:  
- Error message "Email or password incorrect" appears  


---

