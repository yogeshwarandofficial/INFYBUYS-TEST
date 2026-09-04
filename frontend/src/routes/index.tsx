import { createBrowserRouter, Navigate } from 'react-router';
import { lazy, Suspense } from 'react';
import { RootLayout } from '../layouts/RootLayout';
import { PublicLayout } from '../layouts/PublicLayout';
import { AuthLayout } from '../layouts/AuthLayout';
import { DashboardLayout } from '../layouts/DashboardLayout';
import { BuyerLayout } from '../layouts/BuyerLayout';
import { SellerLayout } from '../layouts/SellerLayout';
import { ProtectedRoute } from './ProtectedRoute';
import { PublicRoute } from './PublicRoute';

// Public Pages
const Home = lazy(() => import('../pages/public/Home'));
const Search = lazy(() => import('../pages/public/Search'));
const About = lazy(() => import('../pages/public/About'));
const Pricing = lazy(() => import('../pages/public/Pricing'));
const Contact = lazy(() => import('../pages/public/Contact'));
const FAQ = lazy(() => import('../pages/public/FAQ'));
const Help = lazy(() => import('../pages/public/Help'));
const Guides = lazy(() => import('../pages/public/Guides'));
const Categories = lazy(() => import('../pages/public/Categories'));
const CategoryDetails = lazy(() => import('../pages/public/CategoryDetails'));
const BusinessDetails = lazy(() => import('../pages/public/BusinessDetails'));
const FeaturedListings = lazy(() => import('../pages/public/FeaturedListings'));
const LatestListings = lazy(() => import('../pages/public/LatestListings'));
const BlogListing = lazy(() => import('../pages/public/BlogListing'));
const BlogDetails = lazy(() => import('../pages/public/BlogDetails'));
const PrivacyPolicy = lazy(() => import('../pages/public/PrivacyPolicy'));
const TermsConditions = lazy(() => import('../pages/public/TermsConditions'));
const CookiePolicy = lazy(() => import('../pages/public/CookiePolicy'));
const AdvisoryBooking = lazy(() => import('../pages/public/AdvisoryBooking'));
const NotFound = lazy(() => import('../pages/public/NotFound'));
const ServerError = lazy(() => import('../pages/public/ServerError'));
const Maintenance = lazy(() => import('../pages/public/Maintenance'));
const Unauthorized = lazy(() => import('../pages/public/Unauthorized'));

// Auth Pages
const Login = lazy(() => import('../pages/auth/Login'));
const Register = lazy(() => import('../pages/auth/Register'));
const OTPVerification = lazy(() => import('../pages/auth/OTPVerification'));
const ForgotPassword = lazy(() => import('../pages/auth/ForgotPassword'));
const ResetPassword = lazy(() => import('../pages/auth/ResetPassword'));
const EmailVerification = lazy(() => import('../pages/auth/EmailVerification'));
const PhoneVerification = lazy(() => import('../pages/auth/PhoneVerification'));
const VerifyEmailHandler = lazy(() => import('../pages/auth/VerifyEmailHandler'));

// Buyer Pages
const BuyerDashboard = lazy(() => import('../pages/buyer/BuyerDashboard'));
const BuyerBrowse = lazy(() => import('../pages/buyer/BuyerBrowse'));
const BuyerFavorites = lazy(() => import('../pages/buyer/BuyerFavorites'));
const BuyerSavedSearches = lazy(() => import('../pages/buyer/BuyerSavedSearches'));
const BuyerEnquiries = lazy(() => import('../pages/buyer/BuyerEnquiries'));
const BuyerEnquiryDetails = lazy(() => import('../pages/buyer/BuyerEnquiryDetails'));
const BuyerMessages = lazy(() => import('../pages/buyer/BuyerMessages'));
const BuyerConversation = lazy(() => import('../pages/buyer/BuyerConversation'));
const BuyerNotifications = lazy(() => import('../pages/buyer/BuyerNotifications'));
const BuyerNDA = lazy(() => import('../pages/buyer/BuyerNDA'));
const BuyerNDADetails = lazy(() => import('../pages/buyer/BuyerNDADetails'));
const BuyerSubscription = lazy(() => import('../pages/buyer/BuyerSubscription'));
const BuyerCheckout = lazy(() => import('../pages/buyer/BuyerCheckout'));
const PaymentResult = lazy(() => import('../pages/buyer/PaymentResult'));
const BuyerBilling = lazy(() => import('../pages/buyer/BuyerBilling'));
const InvoiceDetails = lazy(() => import('../pages/buyer/InvoiceDetails'));
const BuyerProfile = lazy(() => import('@/pages/buyer/BuyerProfile'));
const BuyerSettings = lazy(() => import('@/pages/buyer/BuyerSettings'));
const BuyerReviews = lazy(() => import('@/pages/buyer/BuyerReviews'));

// Seller Pages
const SellerDashboard = lazy(() => import('../pages/seller/SellerDashboard'));
const SellerListings = lazy(() => import('../pages/seller/SellerListings'));
const SellerCreateListing = lazy(() => import('../pages/seller/SellerCreateListing'));
const SellerEditListing = lazy(() => import('../pages/seller/SellerEditListing'));
const SellerListingPreview = lazy(() => import('../pages/seller/SellerListingPreview'));
const SellerEnquiries = lazy(() => import('../pages/seller/SellerEnquiries'));
const SellerEnquiryDetails = lazy(() => import('../pages/seller/SellerEnquiryDetails'));
const SellerNotifications = lazy(() => import('../pages/seller/SellerNotifications'));
const SellerAnalytics = lazy(() => import('../pages/seller/SellerAnalytics'));
const SellerProfile = lazy(() => import('../pages/seller/SellerProfile'));
const SellerSettings = lazy(() => import('../pages/seller/SellerSettings'));
const SellerKyc = lazy(() => import('../pages/seller/SellerKyc'));

// Admin Pages
const AdminLayout = lazy(() => import('../layouts/AdminLayout'));
const AdminDashboard = lazy(() => import('../pages/admin/AdminDashboard'));
const AdminSettings = lazy(() => import('@/pages/admin/AdminSettings'));
const AdminActivityLog = lazy(() => import('@/pages/admin/AdminActivityLog'));
const AdminUsers = lazy(() => import('../pages/admin/AdminUsers'));
const AdminUserDetails = lazy(() => import('../pages/admin/AdminUserDetails'));
const AdminSellers = lazy(() => import('../pages/admin/AdminSellers'));
const AdminSellerDetails = lazy(() => import('../pages/admin/AdminSellerDetails'));
const AdminBuyers = lazy(() => import('../pages/admin/AdminBuyers'));
const AdminBuyerDetails = lazy(() => import('../pages/admin/AdminBuyerDetails'));
const AdminReports = lazy(() => import('@/pages/admin/AdminReports'));
const AdminListings = lazy(() => import('../pages/admin/AdminListings'));
const AdminListingDetails = lazy(() => import('../pages/admin/AdminListingDetails'));
const AdminEnquiries = lazy(() => import('../pages/admin/AdminEnquiries'));
const AdminEnquiryDetails = lazy(() => import('../pages/admin/AdminEnquiryDetails'));
const AdminConversations = lazy(() => import('../pages/admin/AdminConversations'));
const AdminConversationDetails = lazy(() => import('../pages/admin/AdminConversationDetails'));
const AdminNotifications = lazy(() => import('../pages/admin/AdminNotifications'));
const AdminAnalytics = lazy(() => import('../pages/admin/AdminAnalytics'));
const AdminReviews = lazy(() => import('../pages/admin/AdminReviews'));
const AdminReviewDetails = lazy(() => import('../pages/admin/AdminReviewDetails'));
const AdminKyc = lazy(() => import('../pages/admin/AdminKyc'));
const AdminKycDetails = lazy(() => import('../pages/admin/AdminKycDetails'));

const PageLoader = () => (
  <div className="flex-1 flex items-center justify-center min-h-[50vh]">
    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
  </div>
);

export const router = createBrowserRouter([
  {
    path: '/',
    element: <RootLayout />,
    errorElement: <ServerError />,
    children: [
      {
        path: 'maintenance',
        element: (
          <Suspense fallback={<PageLoader />}>
            <Maintenance />
          </Suspense>
        )
      },
      {
        path: 'unauthorized',
        element: (
          <Suspense fallback={<PageLoader />}>
            <Unauthorized />
          </Suspense>
        )
      },
      {
        element: <PublicLayout />,
        children: [
          { index: true, element: <Suspense fallback={<PageLoader />}><Home /></Suspense> },
          { path: 'search', element: <Suspense fallback={<PageLoader />}><Search /></Suspense> },
          { path: 'about', element: <Suspense fallback={<PageLoader />}><About /></Suspense> },
          { path: 'pricing', element: <Suspense fallback={<PageLoader />}><Pricing /></Suspense> },
          { path: 'contact', element: <Suspense fallback={<PageLoader />}><Contact /></Suspense> },
          { path: 'faq', element: <Suspense fallback={<PageLoader />}><FAQ /></Suspense> },
          { path: 'help', element: <Suspense fallback={<PageLoader />}><Help /></Suspense> },
          { path: 'guides', element: <Suspense fallback={<PageLoader />}><Guides /></Suspense> },
          { path: 'categories', element: <Suspense fallback={<PageLoader />}><Categories /></Suspense> },
          { path: 'category/:slug', element: <Suspense fallback={<PageLoader />}><CategoryDetails /></Suspense> },
          { path: 'listing/:id', element: <Suspense fallback={<PageLoader />}><BusinessDetails /></Suspense> },
          { path: 'featured', element: <Suspense fallback={<PageLoader />}><FeaturedListings /></Suspense> },
          { path: 'latest', element: <Suspense fallback={<PageLoader />}><LatestListings /></Suspense> },
          { path: 'blog', element: <Suspense fallback={<PageLoader />}><BlogListing /></Suspense> },
          { path: 'blog/:id', element: <Suspense fallback={<PageLoader />}><BlogDetails /></Suspense> },
          { path: 'privacy', element: <Suspense fallback={<PageLoader />}><PrivacyPolicy /></Suspense> },
          { path: 'terms', element: <Suspense fallback={<PageLoader />}><TermsConditions /></Suspense> },
          { path: 'cookie-policy', element: <Suspense fallback={<PageLoader />}><CookiePolicy /></Suspense> },
          { path: 'advisory-booking', element: <Suspense fallback={<PageLoader />}><AdvisoryBooking /></Suspense> },
          { path: '*', element: <Suspense fallback={<PageLoader />}><NotFound /></Suspense> }
        ]
      },
      {
        element: <PublicRoute />, // Prevents logged in users from seeing auth pages
        children: [
          {
            element: <AuthLayout />,
            children: [
              { path: 'login', element: <Suspense fallback={<PageLoader />}><Login /></Suspense> },
              { path: 'register', element: <Suspense fallback={<PageLoader />}><Register /></Suspense> },
              { path: 'forgot-password', element: <Suspense fallback={<PageLoader />}><ForgotPassword /></Suspense> },
              { path: 'reset-password', element: <Suspense fallback={<PageLoader />}><ResetPassword /></Suspense> },
              { path: 'verify-otp', element: <Suspense fallback={<PageLoader />}><OTPVerification /></Suspense> },
              { path: 'verify-email', element: <Suspense fallback={<PageLoader />}><EmailVerification /></Suspense> },
              { path: 'verify-email/confirm', element: <Suspense fallback={<PageLoader />}><VerifyEmailHandler /></Suspense> },
              { path: 'verify-phone', element: <Suspense fallback={<PageLoader />}><PhoneVerification /></Suspense> },
            ]
          }
        ]
      },
      // Protected Role Dashboards
      {
        element: <ProtectedRoute allowedRoles={['buyer', 'seller']} />,
        children: [
          {
            path: 'buyer',
            element: <BuyerLayout />,
            children: [
              { index: true, element: <Suspense fallback={<PageLoader />}><BuyerDashboard /></Suspense> },
              { path: 'browse', element: <Suspense fallback={<PageLoader />}><BuyerBrowse /></Suspense> },
              { path: 'favorites', element: <Suspense fallback={<PageLoader />}><BuyerFavorites /></Suspense> },
              { path: 'saved-searches', element: <Suspense fallback={<PageLoader />}><BuyerSavedSearches /></Suspense> },
              { path: 'enquiries', element: <Suspense fallback={<PageLoader />}><BuyerEnquiries /></Suspense> },
              { path: 'enquiries/:id', element: <Suspense fallback={<PageLoader />}><BuyerEnquiryDetails /></Suspense> },
              { path: 'messages', element: <Suspense fallback={<PageLoader />}><BuyerMessages /></Suspense> },
              { path: 'messages/:conversationId', element: <Suspense fallback={<PageLoader />}><BuyerConversation /></Suspense> },
              { path: 'notifications', element: <Suspense fallback={<PageLoader />}><BuyerNotifications /></Suspense> },
              { path: 'nda', element: <Suspense fallback={<PageLoader />}><BuyerNDA /></Suspense> },
              { path: 'nda/:id', element: <Suspense fallback={<PageLoader />}><BuyerNDADetails /></Suspense> },
              { path: 'subscription', element: <Suspense fallback={<PageLoader />}><BuyerSubscription /></Suspense> },
              { path: 'checkout', element: <Suspense fallback={<PageLoader />}><BuyerCheckout /></Suspense> },
              { path: 'payment-result', element: <Suspense fallback={<PageLoader />}><PaymentResult /></Suspense> },
              { path: 'billing', element: <Suspense fallback={<PageLoader />}><BuyerBilling /></Suspense> },
              { path: 'billing/invoice/:id', element: <Suspense fallback={<PageLoader />}><InvoiceDetails /></Suspense> },
              { path: 'profile', element: <Suspense fallback={<PageLoader />}><BuyerProfile /></Suspense> },
              { path: 'settings', element: <Suspense fallback={<PageLoader />}><BuyerSettings /></Suspense> },
              { path: 'reviews', element: <Suspense fallback={<PageLoader />}><BuyerReviews /></Suspense> }
            ]
          }
        ]
      },
      {
        element: <ProtectedRoute allowedRoles={['seller', 'buyer']} />,
        children: [
          {
            path: 'seller',
            element: <SellerLayout />,
            children: [
              { index: true, element: <Suspense fallback={<PageLoader />}><SellerDashboard /></Suspense> },
              { path: 'listings', element: <Suspense fallback={<PageLoader />}><SellerListings /></Suspense> },
              { path: 'listings/new', element: <Suspense fallback={<PageLoader />}><SellerCreateListing /></Suspense> },
              { path: 'listings/:id', element: <Suspense fallback={<PageLoader />}><SellerListingPreview /></Suspense> },
              { path: 'listings/:id/edit', element: <Suspense fallback={<PageLoader />}><SellerEditListing /></Suspense> },
              { path: 'enquiries', element: <Suspense fallback={<PageLoader />}><SellerEnquiries /></Suspense> },
              { path: 'enquiries/:id', element: <Suspense fallback={<PageLoader />}><SellerEnquiryDetails /></Suspense> },
              { path: 'notifications', element: <Suspense fallback={<PageLoader />}><SellerNotifications /></Suspense> },
              { path: 'analytics', element: <Suspense fallback={<PageLoader />}><SellerAnalytics /></Suspense> },
              { path: 'profile', element: <Suspense fallback={<PageLoader />}><SellerProfile /></Suspense> },
              { path: 'settings', element: <Suspense fallback={<PageLoader />}><SellerSettings /></Suspense> },
              { path: 'kyc', element: <Suspense fallback={<PageLoader />}><SellerKyc /></Suspense> },
              { path: 'verification', element: <Navigate to="/seller/kyc" replace /> }
            ]
          }
        ]
      },
      {
        element: <ProtectedRoute allowedRoles={['agency']} />,
        children: [
          {
            path: 'agency',
            element: <DashboardLayout role="agency" />,
            children: [{ index: true, element: <div className="p-8">Agency Dashboard Stub</div> }]
          }
        ]
      },
      {
        element: <ProtectedRoute allowedRoles={['admin']} />,
        children: [
          {
            path: 'admin',
            element: <Suspense fallback={<PageLoader />}><AdminLayout /></Suspense>,
            children: [
              { index: true, element: <Suspense fallback={<PageLoader />}><AdminDashboard /></Suspense> },
              { path: 'users', element: <Suspense fallback={<PageLoader />}><AdminUsers /></Suspense> },
              { path: 'users/:id', element: <Suspense fallback={<PageLoader />}><AdminUserDetails /></Suspense> },
              { path: 'sellers', element: <Suspense fallback={<PageLoader />}><AdminSellers /></Suspense> },
              { path: 'sellers/:id', element: <Suspense fallback={<PageLoader />}><AdminSellerDetails /></Suspense> },
              { path: 'buyers', element: <Suspense fallback={<PageLoader />}><AdminBuyers /></Suspense> },
              { path: 'buyers/:id', element: <Suspense fallback={<PageLoader />}><AdminBuyerDetails /></Suspense> },
              { path: 'listings', element: <Suspense fallback={<PageLoader />}><AdminListings /></Suspense> },
              { path: 'listings/:id', element: <Suspense fallback={<PageLoader />}><AdminListingDetails /></Suspense> },
              { path: 'enquiries', element: <Suspense fallback={<PageLoader />}><AdminEnquiries /></Suspense> },
              { path: 'enquiries/:id', element: <Suspense fallback={<PageLoader />}><AdminEnquiryDetails /></Suspense> },
              { path: 'messages', element: <Suspense fallback={<PageLoader />}><AdminConversations /></Suspense> },
              { path: 'messages/:id', element: <Suspense fallback={<PageLoader />}><AdminConversationDetails /></Suspense> },
              { path: 'notifications', element: <Suspense fallback={<PageLoader />}><AdminNotifications /></Suspense> },
              { path: 'analytics', element: <Suspense fallback={<PageLoader />}><AdminAnalytics /></Suspense> },
              { path: 'reviews', element: <Suspense fallback={<PageLoader />}><AdminReviews /></Suspense> },
              { path: 'reviews/:id', element: <Suspense fallback={<PageLoader />}><AdminReviewDetails /></Suspense> },
              { path: 'reports', element: <Suspense fallback={<PageLoader />}><AdminReports /></Suspense> },
              { path: 'kyc', element: <Suspense fallback={<PageLoader />}><AdminKyc /></Suspense> },
              { path: 'kyc/:id', element: <Suspense fallback={<PageLoader />}><AdminKycDetails /></Suspense> },
              { path: 'activity', element: <Suspense fallback={<PageLoader />}><AdminActivityLog /></Suspense> },
              { path: 'settings', element: <Suspense fallback={<PageLoader />}><AdminSettings /></Suspense> }
            ]
          }
        ]
      },
      {
        element: <ProtectedRoute allowedRoles={['super-admin']} />,
        children: [
          {
            path: 'super-admin',
            element: <DashboardLayout role="super-admin" />,
            children: [{ index: true, element: <div className="p-8">Super Admin Dashboard Stub</div> }]
          }
        ]
      }
    ]
  }
]);
