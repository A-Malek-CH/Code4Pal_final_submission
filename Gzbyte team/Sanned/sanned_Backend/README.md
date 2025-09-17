## Backend Setup

### Prerequisites
- Python 3.10+
- pip
- Git

### 1) Create and activate a virtual environment
```bash
python -m venv .venv
# Windows
.\.venv\Scripts\activate
```

### 2) Install dependencies
```bash
pip install -r requirements.txt
```

### 3) Environment variables
Create a `.env` file in `backend/`:
```env
FLASK_APP=app
FLASK_ENV=development
SECRET_KEY=change-me
SQLALCHEMY_DATABASE_URI=sqlite:///app.db
JWT_SECRET_KEY=change-me-too
ABSTRACT_API_KEY=
```

### 4) Initialize the database
```bash
flask db init
flask db migrate -m "init"
flask db upgrade
```

### 5) Run the server
```bash
flask run --host 0.0.0.0 --port 5000
```

### Notes
- The app factory is `app.create_app()` in `app/__init__.py`.
- Location lookups use Abstract API if `ABSTRACT_API_KEY` is set; otherwise manual city must be `gaza` to pass the Gaza check.
- If migrations fail, delete `migrations/` and re-init.
