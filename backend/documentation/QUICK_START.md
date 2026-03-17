# Quick Start Guide - Testing

## 30-Second Setup

### 1. Install Dependencies (1 minute)
```bash
cd backend
pip install -r requirements.txt
```

### 2. Start MongoDB (1 minute)
```bash
docker-compose -f docker-compose.test.yml up -d
```

### 3. Run Tests (< 1 second)
```bash
cd backend
pytest
```

**Expected Result:**
```
14 passed in ~0.4s
Coverage: 53% overall
```

## Common Commands

| Command | Purpose |
|---------|---------|
| `pytest` | Run all tests |
| `pytest -v` | Verbose output |
| `pytest --cov` | With coverage report |
| `pytest tests/test_auth.py` | Run specific file |
| `pytest tests/test_auth.py::TestPasswordValidation` | Run specific class |

## Stop MongoDB
```bash
docker-compose -f docker-compose.test.yml down
```

## View Coverage Report
```bash
# Generate HTML report
pytest --cov

# Open in browser
open htmlcov/index.html  # macOS
xdg-open htmlcov/index.html  # Linux
start htmlcov/index.html  # Windows
```

## Troubleshooting

**MongoDB not running?**
```bash
docker-compose -f docker-compose.test.yml ps
docker-compose -f docker-compose.test.yml logs
```

**Tests fail with import error?**
```bash
# Must be in backend directory
cd backend
pytest
```

**Need to reset MongoDB?**
```bash
docker-compose -f docker-compose.test.yml down -v
docker-compose -f docker-compose.test.yml up -d
```

## Learn More
See `TESTING.md` for comprehensive documentation
