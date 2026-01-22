/**
 * Lost and Found System - Comprehensive Test Suite
 * 30 Test Cases Covering All Components
 */

import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import { AuthProvider } from '../contexts/AuthContext';
import LoginPage from '../pages/LoginPage';
import SignUpPage from '../pages/SignUpPage';
import Header from '../components/Header';
import LostItemsPage from '../pages/LostItemsPage';
import AdminPage from '../pages/AdminPage';
import ReportItemPage from '../pages/ReportItemPage';
import ItemDetailModal from '../components/ItemDetailModal';

// Mock Firebase
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

jest.mock('../firebase', () => ({ auth: {} }));
jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'),
  useNavigate: () => jest.fn(),
}));

// Helper render functions
const renderWithProviders = (component) => {
  return render(
    <BrowserRouter>
      <AuthProvider>
        {component}
      </AuthProvider>
    </BrowserRouter>
  );
};

// ============================================================================
// TEST CASES TABLE
// ============================================================================
// | TC# | Module          | Test Description                    | Expected Result |
// |-----|-----------------|-------------------------------------|-----------------|
// | 01  | Login           | Renders login page title            | "Log In" shown  |
// | 02  | Login           | Renders email input field           | Field exists    |
// | 03  | Login           | Renders password input field        | Field exists    |
// | 04  | Login           | Renders login button                | Button exists   |
// | 05  | Login           | Renders forgot password link        | Link exists     |
// | 06  | SignUp          | Renders create account title        | Title shown     |
// | 07  | SignUp          | Renders all required form fields    | Fields exist    |
// | 08  | SignUp          | Renders create account button       | Button exists   |
// | 09  | SignUp          | Renders login link                  | Link exists     |
// | 10  | Header          | Renders app title                   | Title shown     |
// | 11  | Header          | Renders About button                | Button exists   |
// | 12  | Header          | Shows Login/SignUp when logged out  | Buttons shown   |
// | 13  | Header          | Shows Profile/SignOut when logged in| Buttons shown   |
// | 14  | LostItems       | Renders page title                  | Title shown     |
// | 15  | LostItems       | Renders item cards                  | Cards displayed |
// | 16  | LostItems       | Shows item locations                | Locations shown |
// | 17  | LostItems       | Shows item dates                    | Dates shown     |
// | 18  | Admin           | Renders admin panel title           | Title shown     |
// | 19  | Admin           | Renders data table                  | Table exists    |
// | 20  | Admin           | Renders table headers               | Headers shown   |
// | 21  | Admin           | Renders item data                   | Data displayed  |
// | 22  | Admin           | Renders action buttons              | Buttons exist   |
// | 23  | Admin           | Remove button removes item          | Item removed    |
// | 24  | ReportItem      | Renders page title                  | Title shown     |
// | 25  | ReportItem      | Renders type toggle (Lost/Found)    | Toggle exists   |
// | 26  | ReportItem      | Renders all form fields             | Fields exist    |
// | 27  | ReportItem      | Renders Submit and Clear buttons    | Buttons exist   |
// | 28  | ItemModal       | Renders modal when open             | Modal shown     |
// | 29  | ItemModal       | Displays item details               | Details shown   |
// | 30  | ItemModal       | Shows Claim button for found items  | Button shown    |
// ============================================================================

describe('Lost and Found System - 30 Test Cases', () => {

  // LOGIN PAGE TESTS (TC01-TC05)
  describe('Login Page', () => {
    test('TC01: Renders login page title', () => {
      renderWithProviders(<LoginPage />);
      expect(screen.getByText('Log In')).toBeInTheDocument();
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
    test('TC06: Renders create account title', () => {
      renderWithProviders(<SignUpPage />);
      expect(screen.getByText('Create Account')).toBeInTheDocument();
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
      renderWithProviders(<Header />);
      expect(screen.getByText('Lost and Found')).toBeInTheDocument();
    });

    test('TC11: Renders About button', () => {
      renderWithProviders(<Header />);
      expect(screen.getByText('About')).toBeInTheDocument();
    });

    test('TC12: Shows Login and Sign Up buttons when logged out', () => {
      renderWithProviders(<Header />);
      expect(screen.getByText('Login')).toBeInTheDocument();
      expect(screen.getByText('Sign Up')).toBeInTheDocument();
    });

    test('TC13: Shows Profile and Sign Out when logged in', () => {
      const { onAuthStateChanged } = require('firebase/auth');
      onAuthStateChanged.mockImplementation((auth, cb) => { cb({ uid: '1' }); return jest.fn(); });
      renderWithProviders(<Header />);
      expect(screen.getByText('Profile')).toBeInTheDocument();
      expect(screen.getByText('Sign Out')).toBeInTheDocument();
    });
  });

  // LOST ITEMS PAGE TESTS (TC14-TC17)
  describe('Lost Items Page', () => {
    beforeEach(() => {
      const { onAuthStateChanged } = require('firebase/auth');
      onAuthStateChanged.mockImplementation((auth, cb) => { cb({ uid: '1' }); return jest.fn(); });
    });

    test('TC14: Renders page title', () => {
      renderWithProviders(<LostItemsPage />);
      expect(screen.getByText('Lost Items')).toBeInTheDocument();
    });

    test('TC15: Renders item cards', () => {
      renderWithProviders(<LostItemsPage />);
      expect(screen.getAllByText('Black wallet').length).toBeGreaterThan(0);
    });

    test('TC16: Shows item locations', () => {
      renderWithProviders(<LostItemsPage />);
      expect(screen.getAllByText('Library 1st floor').length).toBeGreaterThan(0);
    });

    test('TC17: Shows item dates', () => {
      renderWithProviders(<LostItemsPage />);
      expect(screen.getAllByText('2025-03-25').length).toBeGreaterThan(0);
    });
  });

  // ADMIN PAGE TESTS (TC18-TC23)
  describe('Admin Page', () => {
    beforeEach(() => {
      const { onAuthStateChanged } = require('firebase/auth');
      onAuthStateChanged.mockImplementation((auth, cb) => { cb({ uid: '1' }); return jest.fn(); });
    });

    test('TC18: Renders admin panel title', () => {
      renderWithProviders(<AdminPage />);
      expect(screen.getByText('Admin Panel')).toBeInTheDocument();
    });

    test('TC19: Renders data table', () => {
      renderWithProviders(<AdminPage />);
      expect(screen.getByRole('table')).toBeInTheDocument();
    });

    test('TC20: Renders table headers', () => {
      renderWithProviders(<AdminPage />);
      expect(screen.getByText('Type')).toBeInTheDocument();
      expect(screen.getByText('Title')).toBeInTheDocument();
      expect(screen.getByText('Category')).toBeInTheDocument();
    });

    test('TC21: Renders item data', () => {
      renderWithProviders(<AdminPage />);
      expect(screen.getByText('Black Wallet')).toBeInTheDocument();
      expect(screen.getByText('Blue Water Bottle')).toBeInTheDocument();
    });

    test('TC22: Renders action buttons', () => {
      renderWithProviders(<AdminPage />);
      expect(screen.getAllByText('Mark Claim').length).toBe(4);
      expect(screen.getAllByText('Remove').length).toBe(4);
    });

    test('TC23: Remove button removes item from table', () => {
      renderWithProviders(<AdminPage />);
      expect(screen.getByText('Black Wallet')).toBeInTheDocument();
      fireEvent.click(screen.getAllByText('Remove')[0]);
      expect(screen.queryByText('Black Wallet')).not.toBeInTheDocument();
    });
  });

  // REPORT ITEM PAGE TESTS (TC24-TC27)
  describe('Report Item Page', () => {
    beforeEach(() => {
      const { onAuthStateChanged } = require('firebase/auth');
      onAuthStateChanged.mockImplementation((auth, cb) => {
        cb({ uid: '1', displayName: 'Test', email: 'test@test.com' });
        return jest.fn();
      });
    });

    test('TC24: Renders page title', () => {
      renderWithProviders(<ReportItemPage />);
      expect(screen.getByText('Report an item')).toBeInTheDocument();
    });

    test('TC25: Renders type toggle (Lost/Found)', () => {
      renderWithProviders(<ReportItemPage />);
      expect(screen.getByText('Lost')).toBeInTheDocument();
      expect(screen.getByText('Found')).toBeInTheDocument();
    });

    test('TC26: Renders all form fields', () => {
      renderWithProviders(<ReportItemPage />);
      expect(screen.getByText('Item Title')).toBeInTheDocument();
      expect(screen.getByText('Category')).toBeInTheDocument();
      expect(screen.getByText('Description')).toBeInTheDocument();
      expect(screen.getByText('Location')).toBeInTheDocument();
    });

    test('TC27: Renders Submit and Clear buttons', () => {
      renderWithProviders(<ReportItemPage />);
      expect(screen.getByText('Submit')).toBeInTheDocument();
      expect(screen.getByText('Clear')).toBeInTheDocument();
    });
  });

  // ITEM DETAIL MODAL TESTS (TC28-TC30)
  describe('Item Detail Modal', () => {
    const mockItem = {
      id: 1,
      title: 'Test Item',
      description: 'Test description',
      location: 'Test Location',
      date: '2025-01-01',
      category: 'Electronics',
      postedBy: 'Test User',
      contact: 'test@test.com',
      handover: 'Pick up at office',
    };

    test('TC28: Renders modal when open is true', () => {
      render(<ItemDetailModal open={true} onClose={jest.fn()} item={mockItem} type="lost" />);
      expect(screen.getByRole('dialog')).toBeInTheDocument();
    });

    test('TC29: Displays item details in modal', () => {
      render(<ItemDetailModal open={true} onClose={jest.fn()} item={mockItem} type="lost" />);
      expect(screen.getByText('Test Item')).toBeInTheDocument();
      expect(screen.getByText('Test Location')).toBeInTheDocument();
      expect(screen.getByText('Electronics')).toBeInTheDocument();
    });

    test('TC30: Shows Claim button for found items only', () => {
      render(<ItemDetailModal open={true} onClose={jest.fn()} item={mockItem} type="found" />);
      expect(screen.getByText('Claim This Item')).toBeInTheDocument();
    });
  });
});
