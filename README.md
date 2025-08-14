# Database Schema Documentation

This document describes the database schema for the system, based on the provided ERD (Entity-Relationship Diagram).  
The database contains three main entities: **Users**, **Contributors**, and **Documents**, with defined relationships between them.

---

## 📌 Entities and Relationships

### 1. Users
Stores information about system users who manage contributors and documents.

**Fields:**
- `id` (INT, PK) – Unique identifier for each user.
- `name` (VARCHAR 255) – Full name of the user.
- `password` (TEXT) – Encrypted user password.
- `email` (VARCHAR 100) – User's email address.
- `role` (INT) – Numeric role identifier for access control.
- `createdIn` (DATETIME) – Creation timestamp.
- `updatedIn` (DATETIME) – Last update timestamp.
- `status` (TINYINT) – Active (1) or inactive (0) status.

**Relationships:**
- **1:N** with **Contributors** – A user can manage multiple contributors.

---

### 2. Contributors
Represents individuals who are registered in the system by users.

**Fields:**
- `id` (INT, PK) – Unique identifier for each contributor.
- `fullName` (VARCHAR 100) – Contributor's full name.
- `gender` (VARCHAR 45) – Gender.
- `biNumber` (VARCHAR 20) – Identification number.
- `dateOfBirth` (DATETIME) – Date of birth.
- `phoneNumber` (VARCHAR 255) – Contact phone number.
- `province` (VARCHAR 45) – Province of residence.
- `municipality` (VARCHAR 45) – Municipality of residence.
- `neighborhood` (VARCHAR 45) – Neighborhood of residence.
- `email` (VARCHAR 100) – Contributor's email.
- `digitalCardLink` (TEXT) – Link to a digital ID card.
- `createdIn` (DATETIME) – Creation timestamp.
- `updatedIn` (DATETIME) – Last update timestamp.
- `idUser` (INT, FK) – References the `Users` table.
- `status` (TINYINT) – Active (1) or inactive (0) status.

**Relationships:**
- **N:1** with **Users** – Each contributor is registered by one user.
- **1:N** with **Documents** – A contributor can have multiple documents.

---

### 3. Documents
Stores documents associated with contributors.

**Fields:**
- `id` (INT, PK) – Unique identifier for each document.
- `description` (VARCHAR 105) – Short description of the document.
- `fileUrl` (TEXT) – URL or path to the document file.
- `typeDocument` (INT) – Document type identifier.
- `name` (VARCHAR 105) – Document name.
- `createdIn` (DATETIME) – Creation timestamp.
- `updatedIn` (DATETIME) – Last update timestamp.
- `idContributor` (INT, FK) – References the `Contributors` table.
- `status` (TINYINT) – Active (1) or inactive (0) status.

**Relationships:**
- **N:1** with **Contributors** – Each document belongs to one contributor.

---

## 🔗 Relationship Summary
- **Users → Contributors**: One user can register multiple contributors.
- **Contributors → Documents**: One contributor can have multiple documents.
- **Foreign Keys**:
  - `Contributors.idUser` → `Users.id`
  - `Documents.idContributor` → `Contributors.id`

---

## 🛠 Possible Use Cases
- User management with role-based access.
- Registration of contributors and their personal details.
- Storage and tracking of contributor documents.
- Status control for users, contributors, and documents.

