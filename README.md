# Person Management API

A **Django REST Framework** API for managing person records with full CRUD operations and search functionality.

---

## 🚀 Features

- **CRUD Operations:** Create, retrieve, update, and delete person records  
- **Search Functionality:** Search persons by first name, last name, or middle name  
- **RESTful API:** Built using Django REST Framework ViewSets  
- **Ordered Results:** Persons are returned ordered by creation date (newest first)

---

## 📚 API Endpoints

| Method | Endpoint                | Description                  | Parameters |
|--------|-------------------------|------------------------------|------------|
| GET    | `/api/persons/`         | List all persons             | None       |
| POST   | `/api/persons/`         | Create a new person          | Person data in body |
| GET    | `/api/persons/{id}/`    | Get specific person          | Person ID in URL |
| PUT    | `/api/persons/{id}/`    | Update entire person record  | Person ID in URL, data in body |
| PATCH  | `/api/persons/{id}/`    | Partially update person record | Person ID in URL, data in body |
| DELETE | `/api/persons/{id}/`    | Delete person record         | Person ID in URL |
| GET    | `/api/persons/search/`  | Search persons by name       | Query parameter `q` |

---

## 📝 Example API Requests and Responses

### 1. **GET** `/api/persons/`
**Request:**
```http
GET /api/persons/

[
  {
    "id": 1,
    "first_name": "John",
    "last_name": "Doe",
    "middle_name": "William",
    "created_at": "2025-10-21T12:34:56Z"
  },
  {
    "id": 2,
    "first_name": "Jane",
    "last_name": "Smith",
    "middle_name": "Marie",
    "created_at": "2025-10-20T10:20:30Z"
  }
]
