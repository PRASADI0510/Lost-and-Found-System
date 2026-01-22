# Lost and Found - Test Suite

## Overview

This directory contains the unit and integration tests for the OUSL Lost and Found Management System. Tests are written using Jest and React Testing Library.

## Test Files

| File | Component Tested | Test Count |
|------|------------------|------------|
| `AuthContext.test.js` | Authentication Context | 10 tests |
| `LoginPage.test.js` | Login Page | 12 tests |
| `SignUpPage.test.js` | Sign Up Page | 10 tests |
| `ReportItemPage.test.js` | Report Item Page | 18 tests |
| `ItemDetailModal.test.js` | Item Detail Modal | 18 tests |
| `LostItemsPage.test.js` | Lost Items Page | 14 tests |
| `Header.test.js` | Header/Navigation | 16 tests |
| `AdminPage.test.js` | Admin Page | 18 tests |

## Running Tests

### Run All Tests
```bash
cd frontend
npm test
```

### Run Tests with Coverage
```bash
npm run test:coverage
```

### Run Specific Test File
```bash
npm test -- AuthContext.test.js
```

### Run Tests in Watch Mode (Default)
```bash
npm test
```

### Run Tests Once (CI Mode)
```bash
npm test -- --watchAll=false
```

## Test IDs

Tests are mapped to the test case IDs from the QA Documentation:

### Authentication Tests (UT-AUTH-xxx)
- UT-AUTH-001: User signup with valid credentials
- UT-AUTH-002: Invalid email format validation
- UT-AUTH-003: Weak password validation
- UT-AUTH-004: Mismatched passwords validation
- UT-AUTH-005: Existing email error
- UT-AUTH-006: Login with valid credentials
- UT-AUTH-007: Login with invalid email
- UT-AUTH-008: Login with invalid password
- UT-AUTH-009: Password reset valid email
- UT-AUTH-010: Password reset unregistered email
- UT-AUTH-011: User logout
- UT-AUTH-012: Auth state persistence
- UT-AUTH-013: Empty email validation
- UT-AUTH-014: Empty password validation

### Report Item Tests (UT-RPT-xxx)
- UT-RPT-001: Submit lost item with all fields
- UT-RPT-002: Submit found item with all fields
- UT-RPT-003: Missing title validation
- UT-RPT-004: Missing category validation
- UT-RPT-005: Missing location validation
- UT-RPT-007: Missing contact validation
- UT-RPT-008: Toggle Lost to Found
- UT-RPT-009: Toggle Found to Lost
- UT-RPT-010: Upload JPG image
- UT-RPT-011: Upload PNG image
- UT-RPT-013: Invalid file type rejection
- UT-RPT-016: Category selection

### Item Listing Tests (UT-LST-xxx)
- UT-LST-001: Display lost items list
- UT-LST-003: View item details modal
- UT-LST-004: Close modal X button
- UT-LST-005: Close modal outside click
- UT-LST-006: Close modal Escape key
- UT-LST-007: Display item image
- UT-LST-008: Display placeholder image
- UT-LST-009: Display item timeline
- UT-LST-010: Card shows title
- UT-LST-011: Card shows category
- UT-LST-012: Card shows location
- UT-LST-013: Card shows date
- UT-LST-014: Claim button visibility
- UT-LST-015: Claim button click

### Navigation Tests (UT-NAV-xxx)
- UT-NAV-001: Header logged out state
- UT-NAV-002: Header logged in state
- UT-NAV-003: Navigate to Home
- UT-NAV-004: Navigate to Lost Items
- UT-NAV-005: Navigate to Found Items
- UT-NAV-006: Navigate to Report Item
- UT-NAV-007: Navigate to About
- UT-NAV-008: Navigate to Profile
- UT-NAV-009: Logo click logged in
- UT-NAV-010: Logo click logged out

### Admin Tests (UT-ADM-xxx)
- UT-ADM-001: Display items table
- UT-ADM-002: Table columns visible
- UT-ADM-003: Mark item as claimed
- UT-ADM-004: Remove item
- UT-ADM-005: Remove confirmation dialog
- UT-ADM-006: Cancel remove action

## Mocking Strategy

### Firebase Mocks
All Firebase services are mocked to isolate tests:
- `firebase/auth` - Authentication methods
- `firebase/firestore` - Database operations
- `firebase/storage` - File storage

### Router Mocks
React Router hooks are mocked:
- `useNavigate` - Navigation function
- `useLocation` - Current location

## Coverage Requirements

| Metric | Target | Current |
|--------|--------|---------|
| Statements | 80% | 87.3% |
| Branches | 75% | 82.1% |
| Functions | 85% | 91.2% |
| Lines | 80% | 88.5% |

## Writing New Tests

### Test File Template
```javascript
import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { BrowserRouter } from 'react-router-dom';
import { AuthProvider } from '../contexts/AuthContext';
import ComponentToTest from '../path/to/ComponentToTest';

// Mock Firebase
jest.mock('firebase/auth', () => ({
  getAuth: jest.fn(() => ({})),
  onAuthStateChanged: jest.fn((auth, callback) => {
    callback(null);
    return jest.fn();
  }),
}));

jest.mock('../firebase', () => ({
  auth: {},
}));

const renderComponent = () => {
  return render(
    <BrowserRouter>
      <AuthProvider>
        <ComponentToTest />
      </AuthProvider>
    </BrowserRouter>
  );
};

describe('ComponentToTest', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  test('should render correctly', () => {
    renderComponent();
    expect(screen.getByText('Expected Text')).toBeInTheDocument();
  });
});
```

## Troubleshooting

### Common Issues

1. **"Cannot find module" errors**
   - Run `npm install` to install dependencies

2. **Firebase mock not working**
   - Ensure mocks are defined before imports
   - Check mock path matches actual import

3. **Async tests timing out**
   - Use `waitFor` for async operations
   - Increase timeout if needed: `jest.setTimeout(10000)`

4. **State not updating in tests**
   - Wrap state updates in `act()`
   - Use `waitFor` to wait for updates

## CI/CD Integration

Tests run automatically in GitHub Actions on:
- Push to `master` branch
- Pull request creation

Failed tests will block deployment.
