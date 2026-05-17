import React, { useState, useEffect } from 'react';
import { auth } from './lib/firebase';
import { onAuthStateChanged, User } from 'firebase/auth';
import { Auth } from './components/Auth';
import { Layout } from './components/Layout';
import { Dashboard } from './components/Dashboard';
import { BrandSettings } from './components/BrandSettings';
import { ProductManager } from './components/ProductManager';
import { OrderManager } from './components/OrderManager';
import { TeamManager } from './components/TeamManager';
import { AIReplyWriter } from './components/AIReplyWriter';
import { InventoryManager } from './components/InventoryManager';
import { TaskManager } from './components/TaskManager';
import { Analytics } from './components/Analytics';
import { MarketingManager } from './components/MarketingManager';
import { ShootsManager } from './components/ShootsManager';
import { APIKeys } from './components/APIKeys';
import { DesignerWorkspace } from './components/DesignerWorkspace';
import { AttendanceTracker } from './components/AttendanceTracker';
import { ExpenseTracker } from './components/ExpenseTracker';
import { CouponManager } from './components/CouponManager';
import { DealsManager } from './components/DealsManager';
import { UserGuide } from './components/UserGuide';
import { CommandCenter } from './components/CommandCenter';
import { AIBrain } from './components/AIBrain';
import { SeasonalSales } from './components/SeasonalSales';
import { TeamStats } from './components/TeamStats';
import { Intelligence } from './components/Intelligence';
import { Workflow } from './components/Workflow';
import { useTheme } from './lib/useTheme';
import { Toaster } from 'sonner';

export default function App() {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('dashboard');

  const { brandConfig } = useTheme();

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setUser(user);
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen bg-brand-black flex items-center justify-center">
        <div className="w-12 h-12 border-2 border-brand-gold border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  if (!user) {
    return <Auth brandConfig={brandConfig} />;
  }

  const renderContent = () => {
    switch (activeTab) {
      case 'dashboard':
        return <Dashboard />;
      case 'command-center':
        return <CommandCenter />;
      case 'notifications':
        return <div className="p-8"><h1 className="text-3xl font-display font-bold">Notifications</h1><p className="text-brand-muted">System alerts and team activity</p></div>;
      case 'seasonal-sales':
        return <SeasonalSales />;
      case 'brand-settings':
        return <BrandSettings />;
      case 'products':
        return <ProductManager />;
      case 'orders':
        return <OrderManager />;
      case 'customers':
        return <div className="p-8"><h1 className="text-3xl font-display font-bold">Customers</h1><p className="text-brand-muted">Customer history and loyalty tiers</p></div>;
      case 'multi-location':
        return <div className="p-8"><h1 className="text-3xl font-display font-bold">Multi-Location</h1><p className="text-brand-muted">Stock management across branches</p></div>;
      case 'team':
        return <TeamManager />;
      case 'ai-brain':
        return <AIBrain />;
      case 'ai-reply':
        return <AIReplyWriter />;
      case 'ai-desc':
        return <div className="p-8"><h1 className="text-3xl font-display font-bold">AI Descriptions</h1><p className="text-brand-muted">Generate high-converting copy</p></div>;
      case 'inventory':
        return <InventoryManager />;
      case 'tasks':
        return <TaskManager />;
      case 'analytics':
        return <Analytics />;
      case 'team-stats':
        return <TeamStats />;
      case 'intelligence':
        return <Intelligence />;
      case 'brand-report':
        return <div className="p-8"><h1 className="text-3xl font-display font-bold">Brand Report</h1><p className="text-brand-muted">Generate branded PDF reports</p></div>;
      case 'marketing':
        return <MarketingManager />;
      case 'influencers':
        return <div className="p-8"><h1 className="text-3xl font-display font-bold">Influencers</h1><p className="text-brand-muted">Deal tracking and ROI analysis</p></div>;
      case 'content-planner':
        return <div className="p-8"><h1 className="text-3xl font-display font-bold">Content Planner</h1><p className="text-brand-muted">Social media content calendar</p></div>;
      case 'follow-ups':
        return <div className="p-8"><h1 className="text-3xl font-display font-bold">Follow-Ups</h1><p className="text-brand-muted">Customer re-engagement tools</p></div>;
      case 'reviews':
        return <div className="p-8"><h1 className="text-3xl font-display font-bold">Reviews</h1><p className="text-brand-muted">Manage customer feedback</p></div>;
      case 'wa-business':
        return <div className="p-8"><h1 className="text-3xl font-display font-bold">WA Business API</h1><p className="text-brand-muted">Meta Cloud API integration</p></div>;
      case 'shoots':
        return <ShootsManager />;
      case 'design':
        return <DesignerWorkspace />;
      case 'attendance':
        return <AttendanceTracker />;
      case 'expenses':
        return <ExpenseTracker />;
      case 'coupons':
        return <CouponManager />;
      case 'deals':
        return <DealsManager />;
      case 'returns':
        return <div className="p-8"><h1 className="text-3xl font-display font-bold">Returns</h1><p className="text-brand-muted">Log and track product returns</p></div>;
      case 'biz-manager':
        return <div className="p-8"><h1 className="text-3xl font-display font-bold">Biz Manager</h1><p className="text-brand-muted">Financial health and profit charts</p></div>;
      case 'leaderboard':
        return <TeamStats />;
      case 'workflow':
        return <Workflow />;
      case 'brand-conn':
        return <div className="p-8"><h1 className="text-3xl font-display font-bold">Brand Connections</h1><p className="text-brand-muted">API keys and social links</p></div>;
      case 'ecommerce':
        return <div className="p-8"><h1 className="text-3xl font-display font-bold">E-Commerce</h1><p className="text-brand-muted">WooCommerce and Shopify sync</p></div>;
      case 'tool-hub':
        return <div className="p-8"><h1 className="text-3xl font-display font-bold">Tool Hub</h1><p className="text-brand-muted">External design and marketing tools</p></div>;
      case 'event-theming':
        return <SeasonalSales />;
      case 'custom-events':
        return <div className="p-8"><h1 className="text-3xl font-display font-bold">Custom Events</h1><p className="text-brand-muted">Add your own brand events</p></div>;
      case 'mobile-pwa':
        return <div className="p-8"><h1 className="text-3xl font-display font-bold">Mobile PWA</h1><p className="text-brand-muted">Install BrandFlow as an app</p></div>;
      case 'health-monitor':
        return <div className="p-8"><h1 className="text-3xl font-display font-bold">Health Monitor</h1><p className="text-brand-muted">System status and error tracking</p></div>;
      case 'cart-recovery':
        return <div className="p-8"><h1 className="text-3xl font-display font-bold">Cart Recovery</h1><p className="text-brand-muted">Recover abandoned checkouts</p></div>;
      case 'loyalty-tiers':
        return <div className="p-8"><h1 className="text-3xl font-display font-bold">Loyalty Tiers</h1><p className="text-brand-muted">Customer reward programs</p></div>;
      case 'ai-campaign':
        return <div className="p-8"><h1 className="text-3xl font-display font-bold">AI Campaign Planner</h1><p className="text-brand-muted">Seasonal marketing strategies</p></div>;
      case 'guide':
        return <UserGuide />;
      case 'api-keys':
        return <APIKeys />;
      default:
        return (
          <div className="flex flex-col items-center justify-center h-full space-y-4 opacity-50">
            <div className="w-16 h-16 rounded-full bg-white/5 flex items-center justify-center">
              <span className="text-2xl">🚧</span>
            </div>
            <h2 className="text-xl font-bold uppercase tracking-widest">Module Under Construction</h2>
            <p className="text-sm text-brand-muted">We are currently building the {activeTab} module.</p>
          </div>
        );
    }
  };

  return (
    <>
      <Toaster position="top-right" theme="dark" richColors />
      <Layout activeTab={activeTab} setActiveTab={setActiveTab} brandConfig={brandConfig}>
        {renderContent()}
      </Layout>
    </>
  );
}
