# Detailed Software Requirements Specification for Lost & Found Management System

## Table of Contents

1. [INTRODUCTION](#1-introduction)
   - 1.1 [PURPOSE](#11-purpose)
   - 1.2 [SUMMARY](#12-summary)
   - 1.3 [COMPANY OVERVIEW](#13-company-overview)
   - 1.4 [PROJECT OVERVIEW](#14-project-overview)
   - 1.5 [SCOPE](#15-scope)
   - 1.6 [ASSUMPTIONS](#16-assumptions)
   - 1.7 [DEFINITIONS, ACRONYMS AND TERMINOLOGY](#17-definitions-acronyms-and-terminology)
   - 1.8 [REFERENCES](#18-references)

2. [PROJECT SCOPE AND IMPACT](#2-project-scope-and-impact)
   - 2.1 [SCOPE INCLUSIONS](#21-scope-inclusions)
   - 2.2 [SCOPE EXCLUSIONS](#22-scope-exclusions)
   - 2.3 [IMPACT ON OTHER SYSTEMS](#23-impact-on-other-systems)

3. [FUNCTIONAL REQUIREMENTS](#3-functional-requirements)
   - 3.1 [Core Functions](#31-core-functions)
   - 3.2 [Data Archival and Retention](#32-data-archival-and-retention)
   - 3.3 [User Profiles, Roles and Privileges](#33-user-profiles-roles-and-privileges)
   - 3.4 [Reporting Requirements](#34-reporting-requirements)

4. [NON-FUNCTIONAL REQUIREMENTS](#4-non-functional-requirements)
   - 4.1 [Performance and Load Requirements](#41-performance-and-load-requirements)
   - 4.2 [Compatibility Requirements](#42-compatibility-requirements)
   - 4.3 [External Interface Requirements](#43-external-interface-requirements)
   - 4.4 [Security and Authentication Requirements](#44-security-and-authentication-requirements)
   - 4.5 [Quality Assurance Requirements](#45-quality-assurance-requirements)
   - 4.6 [Development Requirements](#46-development-requirements)
   - 4.7 [Deployment Requirements](#47-deployment-requirements)
   - 4.8 [Special Documentation Requirements](#48-special-documentation-requirements)
   - 4.9 [Applicable Standards](#49-applicable-standards)
   - 4.10 [On-line User Documentation and Help System Requirements](#410-on-line-user-documentation-and-help-system-requirements)
   - 4.11 [Usability Requirements](#411-usability-requirements)

5. [FUTURE REQUIREMENTS](#5-future-requirements)

6. [APPENDIX](#6-appendix)

---

## Document Revisions

| Date | Version | Description | Author |
|------|---------|-------------|--------|
| 12/Sep/2025 | 1.0 | Initial SRS Document | S.W.D.K.M.A. Dinodi Rimesha Manamendra, F.Z. Fallil, N.S.U.S. Kavinda |

## Document Approval

Open University of Sri Lanka and the Development Team have reviewed this document and hereby agree that the contents herein are accurate. Any changes to this document must be communicated in writing and signed off by both parties.

| Customer | Development Team |
|----------|------------------|
| Signature: _______________ | Signature: _______________ |
| Date: _______________ | Date: _______________ |
| Name: _______________ | Name: _______________ |
| Open University of Sri Lanka | EEY4189 Project Team |

---

## 1. INTRODUCTION

### 1.1 PURPOSE

This document lists requirements for the Lost & Found Management System for Open University of Sri Lanka. The purpose of this document is to identify the system requirements and obtain sign-off on all requirements before moving into the design phase. The engineering team will use this document as the basis for the system design.

After sign-off, requested changes to requirements will be documented including the effect on the project costs, scope and timelines and presented to Open University of Sri Lanka for approval.

These requirements were gathered during extended discussions with university stakeholders, security personnel, and students, and from documents provided by the university administration.

### 1.2 SUMMARY

The Open University of Sri Lanka currently lacks a centralized digital system for managing lost and found items, resulting in significant inefficiencies and frustrations for students, staff, and security personnel. This project will develop a comprehensive web-based Lost & Found Management System that enables efficient reporting, tracking, and retrieval of lost items within the university premises, featuring secure verification processes and real-time notifications.

### 1.3 COMPANY OVERVIEW

The Open University of Sri Lanka (OUSL) is a national university in Sri Lanka established in 1980. It is the premier open and distance learning institution in the country, serving over 30,000 students across multiple regional centers. The university operates with a distributed campus structure, making it challenging to manage lost and found items effectively through traditional methods.

### 1.4 PROJECT OVERVIEW

This project involves developing a comprehensive web-based Lost & Found Management System to replace the current informal and inefficient methods of handling lost items at OUSL. The system will serve three primary user groups: students who report lost or found items, security officers who manage physical items and verification processes, and administrators who oversee system operations.

The system will feature automated matching algorithms, real-time notifications, secure verification processes, and detailed reporting capabilities. It will be built using modern web technologies including React.js for the frontend and Node.js with MongoDB for the backend.

### 1.5 SCOPE

This document covers the software requirements for the Lost & Found Management System to be implemented at the Open University of Sri Lanka. The scope includes all functional and non-functional requirements for the web application, database design, user interfaces, and system integration requirements.

### 1.6 ASSUMPTIONS

- All students and staff have access to internet-enabled devices (smartphones, tablets, or computers)
- The university will provide necessary IT infrastructure and support for system deployment
- University's existing student information system can be integrated for user authentication
- Security personnel will be trained to use the new digital system
- The system will be maintained by the university's IT department after deployment
- University email system will be available for notification services
- Students have valid university email addresses and phone numbers

### 1.7 DEFINITIONS, ACRONYMS AND TERMINOLOGY

| Term | Definition |
|------|------------|
| OUSL | Open University of Sri Lanka |
| SRS | Software Requirements Specification |
| UI | User Interface |
| API | Application Programming Interface |
| JWT | JSON Web Token |
| SMS | Short Message Service |
| HTTPS | HyperText Transfer Protocol Secure |
| CRUD | Create, Read, Update, Delete |
| Lost Item | An item reported as missing by a student or staff member |
| Found Item | An item discovered and registered by security or other users |
| Claim | A request made by a user to retrieve a found item |
| Match | When system identifies potential correlation between lost and found items |
| Verification | Process of confirming legitimate ownership of an item |

### 1.8 REFERENCES

- EEY4189 Project Proposal - Lost & Found Management System
- University IT Policy Documents
- Student Information System Documentation
- Campus Security Protocols
- Web Content Accessibility Guidelines (WCAG) 2.1

---

## 2. PROJECT SCOPE AND IMPACT

### 2.1 SCOPE INCLUSIONS

The following features and functionality will be addressed in this project:

- **User Registration and Authentication**: Integration with university student information system for secure login
- **Lost Item Reporting**: Comprehensive form for students to report lost items with photos, descriptions, and location data
- **Found Item Registration**: Interface for security officers and students to register found items
- **Automated Matching Algorithm**: System to automatically identify potential matches between lost and found items
- **Notification System**: Email and SMS notifications for matches, status updates, and important alerts
- **Claim Management**: Workflow for students to claim found items with verification processes
- **Verification System**: Multi-factor verification including security questions, photos, and personal identification
- **Administrative Dashboard**: Management interface for system administrators and security officers
- **Reporting and Analytics**: Generate reports on lost/found statistics, trends, and system usage
- **Mobile-Responsive Design**: Optimized interface for mobile devices, tablets, and desktop computers
- **Search and Filter**: Advanced search capabilities for items by category, location, date, and description
- **Item Status Tracking**: Real-time status updates throughout the lost/found/claim process

### 2.2 SCOPE EXCLUSIONS

The following items are explicitly excluded from this project scope:

- Physical infrastructure for storing found items (lockers, storage rooms, etc.)
- Integration with surveillance camera systems
- Payment processing for any fees or charges
- Integration with external transport systems (buses, trains, etc.)
- Mobile native applications (iOS/Android apps) - only responsive web application
- Advanced AI/ML features like image recognition or predictive analytics
- Integration with social media platforms
- Multi-language support (English only for initial version)
- Blockchain or cryptocurrency features
- Third-party vendor integrations
- Hardware procurement (servers, networking equipment, etc.)

### 2.3 IMPACT ON OTHER SYSTEMS

#### 2.3.1 Affected by Other Systems

The Lost & Found Management System will receive information from:

- **University Student Information System**: Student authentication, profile data, and enrollment status
- **University Email System**: For sending notification emails to users
- **University Network Infrastructure**: Internet connectivity and internal network access
- **SMS Gateway Service**: For sending SMS notifications (third-party service)

#### 2.3.2 Affects on Other Systems

The Lost & Found Management System will provide information to:

- **University Management Dashboard**: Statistical reports and analytics data
- **Campus Security Systems**: Integration points for security incident reporting
- **University Website**: Embedded widgets or links for easy access
- **IT Help Desk System**: Error logs and system health information for troubleshooting

---

## 3. FUNCTIONAL REQUIREMENTS

### 3.1 Core Functions

#### 3.1.1 User Registration and Authentication

**Description**: Secure user registration and login system integrated with university credentials.

**Functional Details**:
- Users authenticate using existing university credentials (student ID and password)
- First-time users complete profile setup with contact information
- System validates user status against university database
- Password reset functionality through university email
- Session management with automatic timeout for security

**Process Flow**:
1. User accesses system login page
2. Enters university credentials
3. System validates against university database
4. If first login, redirect to profile completion
5. Create user session with appropriate permissions
6. Redirect to appropriate dashboard based on user role

#### 3.1.2 Lost Item Reporting

**Description**: Comprehensive interface for reporting lost items with detailed information and photo uploads.

**Functional Details**:
- Multi-step form with item category selection
- Required fields: item name, category, description, location lost, date/time
- Optional fields: serial numbers, distinguishing features, estimated value
- Photo upload capability (up to 3 photos per item)
- Location selection from predefined university locations
- Auto-save draft functionality
- Email confirmation sent upon successful submission

**Input Validation**:
- Item description minimum 10 characters
- Date cannot be future date
- Photo file size maximum 5MB each
- Required field validation before submission

#### 3.1.3 Found Item Registration

**Description**: Interface for security officers and users to register items they have found.

**Functional Details**:
- Similar form structure to lost item reporting
- Additional fields for current item location and condition
- Mandatory photo upload for found items
- Chain of custody tracking (who found, when, where currently stored)
- Barcode or reference number generation for physical tracking
- Integration with security officer accounts for location tracking

#### 3.1.4 Automated Matching System

**Description**: Algorithm to automatically identify potential matches between lost and found items.

**Functional Details**:
- Keyword matching on item descriptions and categories
- Location proximity analysis (within same building/area)
- Date/time correlation (found after lost date)
- Color and size attribute matching
- Confidence scoring system for match quality
- False positive reduction through multiple criteria validation
- Automatic notification trigger for high-confidence matches

**Matching Criteria**:
- Item category (exact match required)
- Location (within 500m radius)
- Date range (found item date > lost item date)
- Description keywords (minimum 2 matching terms)
- Color attributes (if specified)

#### 3.1.5 Notification System

**Description**: Multi-channel notification system for user alerts and updates.

**Functional Details**:
- Email notifications for all major events
- SMS notifications for urgent/time-sensitive alerts
- In-app notifications visible on user dashboard
- Notification preferences management by users
- Delivery confirmation tracking
- Template-based messaging system

**Notification Types**:
- New item match found
- Claim status updates
- Item claim deadline reminders
- System maintenance alerts
- Security verification requests

#### 3.1.6 Claim Management System

**Description**: Workflow management for item claims with verification processes.

**Functional Details**:
- Claim initiation from matched items or search results
- Multi-step verification process
- Security question authentication
- Photo comparison verification
- Approval workflow for security officers
- Claim status tracking with timestamps
- Automatic expiration of unclaimed items (30 days)

**Verification Steps**:
1. User initiates claim on found item
2. System requests additional verification details
3. User provides security answers and additional photos
4. Security officer reviews claim and evidence
5. Security officer approves or denies claim
6. Approved claims generate pickup instructions
7. Physical handover with digital signature confirmation

### 3.2 Data Archival and Retention

- Lost item records retained for 2 years from report date
- Found item records retained for 2 years from registration date
- User activity logs retained for 1 year
- Claimed items archived with 6-month retention of transaction details
- Automatic data purging with 30-day notice to users
- Export functionality for data backup before archival
- Compliance with university data retention policies

### 3.3 User Profiles, Roles and Privileges

#### 3.3.1 Student Role
- Report lost items
- Register found items
- Search available items
- Claim found items
- View personal item history
- Update contact information
- Manage notification preferences

#### 3.3.2 Security Officer Role
- All student privileges
- Verify and approve/deny claims
- Generate item reference numbers
- Update found item status and location
- Access to all reported items in their assigned areas
- Generate location-specific reports

#### 3.3.3 Administrator Role
- All system privileges
- User management (create, modify, deactivate accounts)
- System configuration management
- Analytics dashboard access
- Generate comprehensive reports
- Data export and backup functions
- System maintenance tasks

### 3.4 Reporting Requirements

#### 3.4.1 Standard Reports
- Daily summary of new lost/found items
- Weekly claim processing statistics
- Monthly trend analysis by item category
- Location-based incident reports
- User activity reports
- System performance metrics

#### 3.4.2 Custom Reports
- Date range filtering capabilities
- Location-specific filtering
- Item category breakdown
- Claim success rate analysis
- User engagement metrics
- Export to PDF and Excel formats

---

## 4. NON-FUNCTIONAL REQUIREMENTS

### 4.1 Performance and Load Requirements

| Requirement | Specification |
|-------------|---------------|
| Current User Load | 500 concurrent users |
| Expected Growth | 50% annually for 3 years |
| Maximum Concurrent Users | 1,000 simultaneous users |
| Average Transaction Time | < 3 seconds for standard operations |
| Page Load Time | < 2 seconds for main pages |
| Search Response Time | < 1 second for basic searches |
| File Upload Time | < 30 seconds for 5MB images |
| Database Query Response | < 500ms for standard queries |
| System Availability | 99.5% uptime (excluding maintenance) |
| Peak Load Handling | System must handle 2x normal load during peak hours |

### 4.2 Compatibility Requirements

| Component | Specification |
|-----------|---------------|
| Web Browsers | Chrome 90+, Firefox 88+, Safari 14+, Edge 90+ |
| Mobile Browsers | Mobile Chrome, Mobile Safari, Samsung Internet |
| Screen Resolutions | 320px to 1920px responsive design |
| Database | MongoDB 5.0+ |
| Node.js Version | Node.js 16+ LTS |
| Operating System | Windows Server 2019+, Ubuntu 20.04+ |
| SSL/TLS | TLS 1.2 minimum, TLS 1.3 preferred |

### 4.3 External Interface Requirements

#### 4.3.1 User Interfaces

**Web Application Interface**:
- Responsive design supporting desktop, tablet, and mobile devices
- Clean, intuitive navigation following university branding guidelines
- Accessibility compliance with WCAG 2.1 AA standards
- High contrast mode support for visually impaired users
- Keyboard navigation support
- Touch-friendly interface for mobile devices

**Dashboard Interfaces**:
- Student Dashboard: Personal item tracking, claim status, notifications
- Security Officer Dashboard: Area-specific item management, claim approvals
- Admin Dashboard: System overview, user management, analytics

#### 4.3.2 Hardware Interfaces

- Standard web server hardware requirements
- Camera integration for mobile photo uploads
- QR code scanner integration for mobile devices (future enhancement)

#### 4.3.3 Software Interfaces

**University Student Information System**:
- LDAP/Active Directory integration for authentication
- RESTful API for student data validation
- Real-time enrollment status verification

**Email System Integration**:
- SMTP integration with university mail server
- Support for HTML email templates
- Bounce handling and delivery confirmation

**SMS Gateway Integration**:
- Third-party SMS service API integration
- Delivery receipt processing
- International number format support

#### 4.3.4 Communications Interfaces

- HTTPS only for all communications
- RESTful API architecture
- JSON data exchange format
- WebSocket connections for real-time notifications
- OAuth 2.0 for secure API authentication

### 4.4 Security and Authentication Requirements

#### 4.4.1 Data Storage Security

- All sensitive data encrypted at rest using AES-256
- Database connection encryption using SSL
- User passwords hashed using bcrypt with salt
- Personal information anonymized in logs
- Regular security backups with encryption
- Data access logging for audit trails

#### 4.4.2 Data Communication Security

- HTTPS/TLS 1.3 for all web traffic
- API endpoints secured with JWT tokens
- Cross-Site Scripting (XSS) protection
- Cross-Site Request Forgery (CSRF) protection
- SQL injection prevention through parameterized queries
- Rate limiting to prevent DDoS attacks
- Input validation and sanitization

### 4.5 Quality Assurance Requirements

#### 4.5.1 QA Test Scope

- Unit testing for all critical functions (90% code coverage minimum)
- Integration testing for external system interfaces
- User acceptance testing with student focus groups
- Performance testing under expected load conditions
- Security testing including penetration testing
- Cross-browser compatibility testing
- Mobile device testing on iOS and Android

#### 4.5.2 QA Environment

**Software Requirements**:
- Testing frameworks: Jest, React Testing Library, Supertest
- Browser testing tools: Selenium WebDriver
- Performance testing: Apache JMeter
- Security scanning: OWASP ZAP

**Hardware Requirements**:
- Dedicated testing server environment
- Multiple device types for mobile testing
- Network simulation tools for performance testing

#### 4.5.3 QA Data

- Anonymized production data for realistic testing
- Test user accounts for all user roles
- Sample item images and descriptions
- Load testing data sets
- Security test scenarios and exploits

### 4.6 Development Requirements

#### 4.6.1 Development Environment

**Software Stack**:
- Frontend: React.js 18+, Material-UI, Redux Toolkit
- Backend: Node.js 16+, Express.js, MongoDB
- Development Tools: VS Code, Git, Docker, Postman
- Package Management: npm or yarn

**Hardware Requirements**:
- Development machines: 16GB RAM, SSD storage
- Local development database servers
- Staging environment matching production specifications

#### 4.6.2 Development Data

- Anonymized student data for development testing
- Sample item images and descriptions
- Test notification templates
- Development database with realistic data volumes

#### 4.6.3 Coding Standards

- JavaScript ES6+ standards with ESLint configuration
- React functional components with hooks
- Consistent naming conventions (camelCase for variables, PascalCase for components)
- Comprehensive code comments for complex algorithms
- Git commit message standards
- Code review requirements for all pull requests

#### 4.6.4 Implementation Packaging Requirements

- Modular component structure
- Separate packages for frontend and backend
- Environment-specific configuration files
- Docker containerization for consistent deployment
- Build optimization for production deployment

### 4.7 Deployment Requirements

#### 4.7.1 Installation Packaging Requirements

- Docker containers for easy deployment and scaling
- Environment configuration through environment variables
- Database migration scripts for schema updates
- Automated build and deployment pipelines
- Health check endpoints for monitoring

#### 4.7.2 Deployment Requirements

**Production Environment**:
- AWS EC2 instances or equivalent cloud infrastructure
- Load balancer for high availability
- MongoDB replica set for database redundancy
- Redis cache for session management
- Nginx reverse proxy with SSL termination
- Automated backup systems
- Monitoring and logging solutions

**Staging Environment**:
- Mirror of production environment for testing
- Separate database instance with test data
- Blue-green deployment capability for zero-downtime updates

#### 4.7.3 Documentation Requirements

- Technical documentation for system administrators
- User manuals for students and security officers
- API documentation for future integrations
- Database schema documentation
- Deployment and maintenance procedures
- Troubleshooting guides

### 4.8 Special Documentation Requirements

- Privacy policy compliance documentation
- Data protection and GDPR compliance notes (if applicable)
- Security audit documentation
- Accessibility compliance statement
- Open source license compliance

### 4.9 Applicable Standards

**Security Standards**:
- OWASP Top 10 security guidelines
- ISO 27001 information security standards

**Web Standards**:
- W3C HTML5 and CSS3 standards
- WCAG 2.1 AA accessibility guidelines
- REST API design principles

**Quality Standards**:
- IEEE software engineering standards
- ISO 9126 software quality model

### 4.10 On-line User Documentation and Help System Requirements

- Contextual help system within the application
- Video tutorials for common tasks
- FAQ section addressing common issues
- Online user manual with search functionality
- Contact information for technical support
- System status page for maintenance notifications

### 4.11 Usability Requirements

- Intuitive navigation requiring minimal training
- Maximum 3 clicks to reach any major function
- Consistent UI patterns throughout the application
- Mobile-first responsive design approach
- Support for common accessibility tools
- Multi-language support framework (for future expansion)
- Clear error messages with suggested solutions

---

## 5. FUTURE REQUIREMENTS

The following features may be considered for future versions:

**Phase 2 Enhancements**:
- Mobile native applications (iOS/Android)
- QR code scanning for quick item identification
- Integration with campus surveillance systems
- Push notifications for mobile apps
- Advanced analytics and reporting dashboard

**Phase 3 Enhancements**:
- AI-powered image recognition for automatic item categorization
- Predictive analytics for lost item hotspots
- Integration with campus access control systems
- Multi-language support for international students
- Blockchain-based ownership verification

**Long-term Vision**:
- Inter-university system integration
- IoT device integration for automated item tracking
- Machine learning algorithms for improved matching
- Virtual reality item visualization
- Integration with campus safety and emergency systems

---

## 6. APPENDIX

### A. Use Case Diagrams

*[Use case diagrams would be inserted here in the actual document]*

### B. Database Schema

*[Entity Relationship Diagrams would be inserted here]*

### C. Wireframes and Mockups

*[UI wireframes and design mockups would be inserted here]*

### D. Risk Assessment Matrix

| Risk | Probability | Impact | Mitigation Strategy |
|------|-------------|---------|-------------------|
| Integration delays with university systems | Medium | High | Early coordination with IT department |
| User adoption resistance | Low | Medium | Comprehensive training and support |
| Performance issues under load | Medium | High | Thorough performance testing and optimization |
| Security vulnerabilities | Low | High | Regular security audits and updates |

### E. Testing Scenarios

*[Detailed test cases and scenarios would be documented here]*

---

**Document Version**: 1.0  
**Last Updated**: September 12, 2025  
**Next Review Date**: October 12, 2025