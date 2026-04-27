import { Bell, Shield, Key, Eye, Monitor, LogOut, AlertCircle } from 'lucide-react';
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router';
import { demoApi, SettingsResponse, getDemoModeActive } from '../lib/demoApi';

export function SettingsScreen() {
  const navigate = useNavigate();
  const [settings, setSettings] = useState<SettingsResponse | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isDemoMode, setIsDemoMode] = useState(getDemoModeActive());

  useEffect(() => {
    const handleDemoModeChange = (e: Event) => {
      const customEvent = e as CustomEvent<boolean>;
      setIsDemoMode(customEvent.detail);
    };

    window.addEventListener('demo-mode-changed', handleDemoModeChange);
    setIsDemoMode(getDemoModeActive());

    return () => {
      window.removeEventListener('demo-mode-changed', handleDemoModeChange);
    };
  }, []);

  useEffect(() => {
    async function loadSettings() {
      try {
        setIsLoading(true);
        setError(null);
        const data = await demoApi.getSettings();
        setSettings(data);
      } catch (err) {
        console.error('Failed to load settings:', err);
        setError('Unable to load settings data. Please check your connection.');
      } finally {
        setIsLoading(false);
      }
    }
    loadSettings();
  }, []);

  const handleSignOut = () => {
    navigate('/auth');
  };

  // Show loading state
  if (isLoading) {
    return (
      <div className="flex flex-col gap-6">
        <div className="rounded-[2.5rem] glass-card p-8 h-64 flex items-center justify-center">
          <div className="text-center">
            <div className="w-12 h-12 border-4 border-[#3E63F5]/20 border-t-[#3E63F5] rounded-full animate-spin mx-auto mb-4" />
            <p className="text-[14px] font-medium text-[#1F2430]/60">Loading settings...</p>
          </div>
        </div>
      </div>
    );
  }

  // Show error state with fallback settings
  if (error || !settings) {
    const fallbackGroups = [
      {
        group: "Account",
        description: "",
        controls: [
          { id: "security", label: "Security & Privacy", description: "Manage your verification data", type: 'toggle' as const, value: true },
          { id: "password", label: "Password", description: "Update your credentials", type: 'toggle' as const, value: false },
        ]
      },
      {
        group: "Preferences",
        description: "",
        controls: [
          { id: "notifications", label: "Notifications", description: "Push, email, and match alerts", type: 'toggle' as const, value: true },
          { id: "appearance", label: "Appearance", description: "Dark mode, themes, accessibility", type: 'toggle' as const, value: false },
          { id: "visibility", label: "Profile Visibility", description: "Who can see your verified stats", type: 'toggle' as const, value: true },
        ]
      }
    ];

    return (
      <div className="flex flex-col gap-6 animate-[pulse-glow_0.5s_ease-out]">
        
        {isDemoMode && (
          <div className="bg-[#1F2430] text-white px-4 py-3 rounded-xl flex items-center justify-between shadow-lg">
            <div className="flex items-center gap-3">
              <AlertCircle className="w-5 h-5 text-[#F59E0B]" />
              <div>
                <p className="text-[14px] font-bold">Demo Data</p>
                <p className="text-[13px] text-white/70">Backend connection unavailable. Showing fallback preview data.</p>
              </div>
            </div>
            <button 
              onClick={() => window.location.reload()}
              className="px-3 py-1.5 bg-white/10 hover:bg-white/20 rounded-lg text-[13px] font-medium transition-colors"
            >
              Retry Connection
            </button>
          </div>
        )}

        {error && (
          <div className="rounded-[1.5rem] glass-card p-4 md:p-6 flex flex-col md:flex-row md:items-center justify-between gap-4 border-[#F59E0B]/20">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-[#F59E0B]/10 flex items-center justify-center text-[#F59E0B] shrink-0">
                <AlertCircle className="w-5 h-5" />
              </div>
              <p className="text-[13px] md:text-[14px] text-[#1F2430]/60 font-medium">{error}</p>
            </div>
            <button 
              onClick={() => window.location.reload()}
              className="w-full md:w-auto px-5 py-2.5 rounded-xl bg-[#3E63F5] text-white text-[14px] font-bold shadow-sm hover:bg-[#2A44B0] transition-colors whitespace-nowrap shrink-0"
            >
              Retry
            </button>
          </div>
        )}
        <div className="flex items-center justify-between mb-2">
          <h2 className="font-[Manrope,sans-serif] text-[28px] font-bold text-[#1F2430] tracking-tight">
            Settings
          </h2>
        </div>

        <div className="flex flex-col gap-8">
          {fallbackGroups.map((group, i) => (
            <div key={i} className="flex flex-col gap-4">
              <h3 className="font-[Manrope,sans-serif] text-[18px] font-bold text-[#1F2430]/80 px-2">{group.group}</h3>
              <div className="rounded-[2rem] glass-card p-2 flex flex-col overflow-hidden">
                {group.controls.map((item, j) => {
                  const icons = {
                    'security': <Shield className="w-5 h-5 text-[#1F2430]/70" />,
                    'password': <Key className="w-5 h-5 text-[#1F2430]/70" />,
                    'notifications': <Bell className="w-5 h-5 text-[#1F2430]/70" />,
                    'appearance': <Monitor className="w-5 h-5 text-[#1F2430]/70" />,
                    'visibility': <Eye className="w-5 h-5 text-[#1F2430]/70" />,
                  };
                  return (
                    <button key={j} className="group w-full flex items-center justify-between p-4 sm:p-5 rounded-2xl bg-transparent hover:bg-white/60 transition-all cursor-pointer border border-transparent hover:border-white/80 hover:shadow-sm text-left">
                      <div className="flex items-center gap-4 sm:gap-5 w-full">
                        <div className="w-12 h-12 shrink-0 rounded-xl bg-[#F3F2F0] border border-white shadow-inner flex items-center justify-center group-hover:scale-105 transition-transform">
                          {icons[item.id as keyof typeof icons] || <Shield className="w-5 h-5 text-[#1F2430]/70" />}
                        </div>
                        <div className="flex-1 min-w-0">
                          <h4 className="text-[16px] font-bold text-[#1F2430] leading-tight mb-1">{item.label}</h4>
                          <p className="text-[13px] font-medium text-[#1F2430]/50 pr-2">{item.description}</p>
                        </div>
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>
          ))}

          <div className="pt-4 border-t border-[#1F2430]/10">
            <button 
              onClick={handleSignOut}
              className="w-full md:w-auto px-8 py-3.5 rounded-2xl border-2 border-[#D4183D]/20 text-[#D4183D] font-bold text-[14px] hover:bg-[#D4183D]/10 hover:border-[#D4183D]/40 transition-all flex items-center justify-center gap-2"
            >
              <LogOut className="w-4 h-4" /> Sign Out
            </button>
          </div>
        </div>
      </div>
    );
  }

  // Render with actual API data
  return (
    <div className="flex flex-col gap-6 animate-[pulse-glow_0.5s_ease-out]">
      <div className="flex items-center justify-between mb-2">
        <h2 className="font-[Manrope,sans-serif] text-[28px] font-bold text-[#1F2430] tracking-tight">
          Settings
        </h2>
      </div>

      <div className="flex flex-col gap-8">
        {settings.groups.map((group, i) => (
          <div key={i} className="flex flex-col gap-4">
            <h3 className="font-[Manrope,sans-serif] text-[18px] font-bold text-[#1F2430]/80 px-2">{group.group}</h3>
            {group.description && (
              <p className="text-[14px] text-[#1F2430]/60 px-2">{group.description}</p>
            )}
            <div className="rounded-[2rem] glass-card p-2 flex flex-col overflow-hidden">
              {group.controls.map((item, j) => {
                const iconMap: Record<string, React.ReactNode> = {
                  'shield': <Shield className="w-5 h-5 text-[#1F2430]/70" />,
                  'key': <Key className="w-5 h-5 text-[#1F2430]/70" />,
                  'bell': <Bell className="w-5 h-5 text-[#1F2430]/70" />,
                  'monitor': <Monitor className="w-5 h-5 text-[#1F2430]/70" />,
                  'eye': <Eye className="w-5 h-5 text-[#1F2430]/70" />,
                };
                
                // Try to match icon based on label
                const iconKey = item.label.toLowerCase().includes('security') || item.label.toLowerCase().includes('privacy') ? 'shield' :
                              item.label.toLowerCase().includes('password') ? 'key' :
                              item.label.toLowerCase().includes('notification') ? 'bell' :
                              item.label.toLowerCase().includes('appearance') ? 'monitor' :
                              item.label.toLowerCase().includes('visibility') ? 'eye' : 'shield';
                
                return (
                    <button key={j} className="group w-full flex items-center justify-between p-4 sm:p-5 rounded-2xl bg-transparent hover:bg-white/60 transition-all cursor-pointer border border-transparent hover:border-white/80 hover:shadow-sm text-left">
                      <div className="flex items-center gap-4 sm:gap-5 w-full">
                        <div className="w-12 h-12 shrink-0 rounded-xl bg-[#F3F2F0] border border-white shadow-inner flex items-center justify-center group-hover:scale-105 transition-transform">
                          {iconMap[iconKey]}
                        </div>
                        <div className="flex-1 min-w-0">
                          <h4 className="text-[16px] font-bold text-[#1F2430] leading-tight mb-1">{item.label}</h4>
                          <p className="text-[13px] font-medium text-[#1F2430]/50 pr-2">{item.description}</p>
                        </div>
                      </div>
                    </button>
                );
              })}
            </div>
          </div>
        ))}

        <div className="pt-4 border-t border-[#1F2430]/10">
          <button 
            onClick={handleSignOut}
            className="w-full md:w-auto px-8 py-3.5 rounded-2xl border-2 border-[#D4183D]/20 text-[#D4183D] font-bold text-[14px] hover:bg-[#D4183D]/10 hover:border-[#D4183D]/40 transition-all flex items-center justify-center gap-2"
          >
            <LogOut className="w-4 h-4" /> Sign Out
          </button>
        </div>
      </div>
    </div>
  );
}