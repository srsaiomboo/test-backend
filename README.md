# Class Diagram Documentation

This document describes the class diagram for the system, detailing its attributes, methods, and relationships.

---

## 📌 Classes and Responsibilities

### 1. Users
Represents the system users who manage contributors and their documents.

**Attributes:**
- `name` (string) – Full name of the user.
- `email` (string) – User’s email address.
- `password` (string) – Encrypted password.
- `role` (number) – User role for access control.
- `createdIn` (string) – Date and time of creation.
- `updatedIn` (string) – Date and time of last update.
- `status` (boolean) – Active (true) or inactive (false) status.

**Methods:**
- `add()` – Creates a new user.
- `delete()` – Removes an existing user.
- `update()` – Updates user details.
- `view()` – Displays user details.
- `viewAll()` – Displays all users.

**Relationships:**
- **1:N** with **Contributors** – A user can register multiple contributors.

---

### 2. Contributors
Represents individuals registered in the system by users.

**Attributes:**
- `fullName` (string) – Contributor’s full name.
- `gender` (string) – Gender.
- `biNumber` (string) – Identification number.
- `dateOfBirth` (string) – Date of birth.
- `phoneNumber` (string) – Contact phone number.
- `province` (string) – Province of residence.
- `municipality` (string) – Municipality of residence.
- `neighbohood` (string) – Neighborhood of residence.
- `email` (string) – Contributor’s email address.
- `digitalCardLink` (string) – Link to the contributor’s virtual ID card.
- `createdIn` (string) – Date and time of creation.
- `updatedIn` (string) – Date and time of last update.
- `idUser` (int) – ID of the user who registered the contributor.
- `status` (boolean) – Active (true) or inactive (false) status.

**Methods:**
- `add()` – Adds a new contributor.
- `delete()` – Removes a contributor.
- `update()` – Updates contributor details.
- `view()` – Displays contributor details.
- `viewAll()` – Displays all contributors.
- `viewVirtualCard()` – Displays the contributor’s virtual ID card.

**Relationships:**
- **N:1** with **Users** – Each contributor is registered by one user.
- **1:N** with **Documents** – A contributor can have multiple documents.

---

### 3. Documents
Represents documents associated with contributors.

**Attributes:**
- `description` (string) – Short description of the document.
- `fileUrl` (string) – File path or URL to the document.
- `typeDocuments` (string) – Type of document.
- `name` (string) – Name of the document.
- `createdIn` (string) – Date and time of creation.
- `updatedIn` (string) – Date and time of last update.
- `status` (boolean) – Active (true) or inactive (false) status.
- `idContributors` (int) – ID of the contributor who owns the document.

**Methods:**
- `add()` – Adds a new document.
- `delete()` – Removes a document.
- `view()` – Displays document details.
- `viewAll()` – Displays all documents.

**Relationships:**
- **N:1** with **Contributors** – Each document belongs to one contributor.

---

## 🔗 Relationship Summary
- **Users → Contributors**: One user can manage multiple contributors.
- **Contributors → Documents**: One contributor can have multiple documents.
- **Foreign Key Mapping:**
  - `Contributors.idUser` → `Users`
  - `Documents.idContributors` → `Contributors`

---

## 🛠 Possible Use Cases
- Manage user accounts with roles and status.
- Register contributors with complete personal information.
- Attach and manage documents for each contributor.
- View and update contributor virtual ID cards.

