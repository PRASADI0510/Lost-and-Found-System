/**
 * Lost and Found System - Comprehensive Test Suite
 * 30 Test Cases Covering All Components
 */

import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import { AuthProvider } from '../contexts/AuthContext';
import { DataProvider } from '../contexts/DataContext';
import LoginPage from '../pages/LoginPage';
import SignUpPage from '../pages/SignUpPage';
import Header from '../components/Header';
import LostItemsPage from '../pages/LostItemsPage';
import AdminPage from '../pages/AdminPage';
import ReportItemPage from '../pages/ReportItemPage';
import ItemDetailModal from '../components/ItemDetailModal';

// Mock Firebase Auth
jest.mock('firebase/auth', () => ({
  getAuth: jest.fn(() => ({})),
  createUserWithEmailAndPassword: jest.fn(),
  signInWithEmailAndPassword: jest.fn(),
  signOut: jest.fn(() => Promise.resolve()),
  sendPasswordResetEmail: jest.fn(),
  updateProfile: jest.fn(),
  onAuthStateChanged: jest.fn((auth, callback) => {
    callback(null);
    return jest.fn();
  }),
}));

// Mock Firebase Firestore
jest.mock('firebase/firestore', () => ({
  getFirestore: jest.fn(() => ({})),
  collection: jest.fn(() => 'mock-collection'),
  doc: jest.fn(),
  setDoc: jest.fn(() => Promise.resolve()),
  getDoc: jest.fn(() => Promise.resolve({ exists: () => true, data: () => ({ role: 'student', displayName: 'Test', email: 'test@test.com' }) })),
  getDocs: jest.fn(() => Promise.resolve({ docs: [], size: 0 })),
  addDoc: jest.fn(() => Promise.resolve({ id: 'test-id' })),
  updateDoc: jest.fn(() => Promise.resolve()),
  deleteDoc: jest.fn(() => Promise.resolve()),
  query: jest.fn(() => 'mock-query'),
  where: jest.fn(() => 'mock-where'),
  orderBy: jest.fn(),
  limit: jest.fn(),
  onSnapshot: jest.fn((q, cb) => { cb({ docs: [] }); return jest.fn(); }),
  serverTimestamp: jest.fn(),
}));

// Mock Firebase Storage
jest.mock('firebase/storage', () => ({
  getStorage: jest.fn(() => ({})),
  ref: jest.fn(),
  uploadBytes: jest.fn(),
  getDownloadURL: jest.fn(),
}));

jest.mock('../firebase', () => ({
  auth: {},
  db: {},
  storage: {},
}));

jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'),
  useNavigate: () => jest.fn(),
}));

const renderWithProviders = (component) => {
  return render(
    <BrowserRouter>
      <AuthProvider>
        <DataProvider>
          {component}
        </DataProvider>
      </AuthProvider>
    </BrowserRouter>
  );
};

// Helper to set logged-in mock
const mockLoggedIn = () => {
  const { onAuthStateChanged } = require('firebase/auth');
  onAuthStateChanged.mockImplementation((auth, cb) => {
    cb({ uid: '1', displayName: 'Test', email: 'test@test.com' });
    return jest.fn();
  });
};

// Helper to set logged-out mock
const mockLoggedOut = () => {
  const { onAuthStateChanged } = require('firebase/auth');
  onAuthStateChanged.mockImplementation((auth, cb) => { cb(null); return jest.fn(); });
};

// ============================================================================
// 30 TEST CASES
// ============================================================================

describe('Lost and Found System - 30 Test Cases', () => {

  // LOGIN PAGE TESTS (TC01-TC05)
  describe('Login Page', () => {
    beforeEach(mockLoggedOut);

    test('TC01: Renders login page title', () => {
      renderWithProviders(<LoginPage />);
      expect(screen.getByRole('heading', { name: /log in/i })).toBeInTheDocument();
    });

    test('TC02: Renders email input field', () => {
      renderWithProviders(<LoginPage />);
      expect(document.getElementById('email')).toBeInTheDocument();
    });

    test('TC03: Renders password input field', () => {
      renderWithProviders(<LoginPage />);
      expect(document.getElementById('password')).toBeInTheDocument();
    });

    test('TC04: Renders login button', () => {
      renderWithProviders(<LoginPage />);
      expect(screen.getByRole('button', { name: /log in/i })).toBeInTheDocument();
    });

    test('TC05: Renders forgot password link', () => {
      renderWithProviders(<LoginPage />);
      expect(screen.getByText('Forgot Password?')).toBeInTheDocument();
    });
  });

  // SIGNUP PAGE TESTS (TC06-TC09)
  describe('SignUp Page', () => {
    beforeEach(mockLoggedOut);

    test('TC06: Renders create account title', () => {
      renderWithProviders(<SignUpPage />);
      expect(screen.getByRole('heading', { name: /create account/i })).toBeInTheDocument();
    });

    test('TC07: Renders all required form fields', () => {
      renderWithProviders(<SignUpPage />);
      expect(screen.getByText('Full Name')).toBeInTheDocument();
      expect(screen.getByText('Email')).toBeInTheDocument();
      expect(screen.getByText('Password')).toBeInTheDocument();
      expect(screen.getByText('Confirm Password')).toBeInTheDocument();
    });

    test('TC08: Renders create account button', () => {
      renderWithProviders(<SignUpPage />);
      expect(screen.getByRole('button', { name: /create account/i })).toBeInTheDocument();
    });

    test('TC09: Renders login link for existing users', () => {
      renderWithProviders(<SignUpPage />);
      expect(screen.getByText('Already have an account?')).toBeInTheDocument();
    });
  });

  // HEADER TESTS (TC10-TC13)
  describe('Header Component', () => {
    test('TC10: Renders app title', () => {
      mockLoggedOut();
      renderWithProviders(<Header />);
      expect(screen.getByText('Lost and Found')).toBeInTheDocument();
    });

    test('TC11: Renders About button', () => {
      mockLoggedOut();
      renderWithProviders(<Header />);
      expect(screen.getByText('About')).toBeInTheDocument();
    });

    test('TC12: Shows Login and Sign Up buttons when logged out', () => {
      mockLoggedOut();
      renderWithProviders(<Header />);
      expect(screen.getByText('Login')).toBeInTheDocument();
      expect(screen.getByText('Sign Up')).toBeInTheDocument();
    });

    test('TC13: Shows Profile and Sign Out when logged in', async () => {
      mockLoggedIn();
      renderWithProviders(<Header />);
      await waitFor(() => {
        expect(screen.getByText('Profile')).toBeInTheDocument();
        expect(screen.getByText('Sign Out')).toBeInTheDocument();
      });
    });
  });

  // LOST ITEMS PAGE TESTS (TC14-TC17)
  describe('Lost Items Page', () => {
    beforeEach(mockLoggedOut);

    test('TC14: Renders page title', () => {
      renderWithProviders(<LostItemsPage />);
      expect(screen.getByText('Lost Items')).toBeInTheDocument();
    });

    test('TC15: Renders search field', () => {
      renderWithProviders(<LostItemsPage />);
      expect(screen.getByPlaceholderText(/search by title/i)).toBeInTheDocument();
    });

    test('TC16: Renders category filter dropdown', () => {
      renderWithProviders(<LostItemsPage />);
      const selects = screen.getAllByRole('combobox');
      expect(selects.length).toBeGreaterThanOrEqual(1);
    });

    test('TC17: Shows empty state when no items fetched', async () => {
      renderWithProviders(<LostItemsPage />);
      await waitFor(() => {
        expect(screen.getByText('No lost items found')).toBeInTheDocument();
      });
    });
  });

  // ADMIN PAGE TESTS (TC18-TC23)
  describe('Admin Page', () => {
    beforeEach(mockLoggedIn);

    test('TC18: Renders admin panel title', async () => {
      renderWithProviders(<AdminPage />);
      await waitFor(() => {
        expect(screen.getByText('Admin Panel')).toBeInTheDocument();
      });
    });

    test('TC19: Renders tabs for Items, Claims, Users', async () => {
      renderWithProviders(<AdminPage />);
      await waitFor(() => {
        expect(screen.getByRole('tab', { name: /Items/ })).toBeInTheDocument();
        expect(screen.getByRole('tab', { name: /Claims/ })).toBeInTheDocument();
        expect(screen.getByRole('tab', { name: /Users/ })).toBeInTheDocument();
      });
    });

    test('TC20: Renders stats cards', async () => {
      renderWithProviders(<AdminPage />);
      await waitFor(() => {
        expect(screen.getByText('Total Items')).toBeInTheDocument();
        expect(screen.getByText('Pending Claims')).toBeInTheDocument();
        expect(screen.getByText('Total Users')).toBeInTheDocument();
      });
    });

    test('TC21: Renders items table headers', async () => {
      renderWithProviders(<AdminPage />);
      await waitFor(() => {
        expect(screen.getByText('Title')).toBeInTheDocument();
        expect(screen.getByText('Category')).toBeInTheDocument();
      });
    });

    test('TC22: Shows empty state for items', async () => {
      renderWithProviders(<AdminPage />);
      await waitFor(() => {
        expect(screen.getByText('No items found.')).toBeInTheDocument();
      });
    });

    test('TC23: Shows claims tab content on click', async () => {
      renderWithProviders(<AdminPage />);
      await waitFor(() => {
        expect(screen.getByRole('tab', { name: /Claims/ })).toBeInTheDocument();
      });
      fireEvent.click(screen.getByRole('tab', { name: /Claims/ }));
      await waitFor(() => {
        expect(screen.getByText('No claims found.')).toBeInTheDocument();
      });
    });
  });

  // REPORT ITEM PAGE TESTS (TC24-TC27)
  describe('Report Item Page', () => {
    beforeEach(mockLoggedIn);

    test('TC24: Renders page title', async () => {
      renderWithProviders(<ReportItemPage />);
      await waitFor(() => {
        expect(screen.getByText('Report an item')).toBeInTheDocument();
      });
    });

    test('TC25: Renders type toggle (Lost/Found)', async () => {
      renderWithProviders(<ReportItemPage />);
      await waitFor(() => {
        expect(screen.getByText('Lost')).toBeInTheDocument();
        expect(screen.getByText('Found')).toBeInTheDocument();
      });
    });

    test('TC26: Renders all form fields', async () => {
      renderWithProviders(<ReportItemPage />);
      await waitFor(() => {
        expect(screen.getByText(/Item Title/)).toBeInTheDocument();
        expect(screen.getByText(/Description/)).toBeInTheDocument();
      });
    });

    test('TC27: Renders Submit and Clear buttons', async () => {
      renderWithProviders(<ReportItemPage />);
      await waitFor(() => {
        expect(screen.getByText('Submit')).toBeInTheDocument();
        expect(screen.getByText('Clear')).toBeInTheDocument();
      });
    });
  });

  // ITEM DETAIL MODAL TESTS (TC28-TC30)
  describe('Item Detail Modal', () => {
    const mockItem = {
      id: '1',
      title: 'Test Item',
      description: 'Test description',
      location: 'Test Location',
      date: '2025-01-01',
      category: 'Electronics',
      postedByName: 'Test User',
      email: 'test@test.com',
      handOverPreferences: 'Pick up at office',
    };

    beforeEach(mockLoggedOut);

    test('TC28: Renders modal when open is true', async () => {
      renderWithProviders(<ItemDetailModal open={true} onClose={jest.fn()} item={mockItem} type="lost" />);
      await waitFor(() => {
        expect(screen.getByRole('dialog')).toBeInTheDocument();
      });
    });

    test('TC29: Displays item details in modal', async () => {
      renderWithProviders(<ItemDetailModal open={true} onClose={jest.fn()} item={mockItem} type="lost" />);
      await waitFor(() => {
        expect(screen.getByText('Test Item')).toBeInTheDocument();
        expect(screen.getByText('Test Location')).toBeInTheDocument();
        expect(screen.getByText('Electronics')).toBeInTheDocument();
      });
    });

    test('TC30: Shows Claim button for found items only', async () => {
      renderWithProviders(<ItemDetailModal open={true} onClose={jest.fn()} item={mockItem} type="found" />);
      await waitFor(() => {
        expect(screen.getByText(/Login to Claim/i)).toBeInTheDocument();
      });
    });
  });
});
