import React, { useState } from 'react';
import { DiorfyLogo } from '../brand/DiorfyLogo';
import {
  Gift,
  Bell,
  Check,
  User,
  Sparkles,
  ExternalLink,
  Settings,
  LogOut,
  ChevronDown,
  Menu,
  Globe,
} from 'lucide-react';
import { UserProfile } from '../../types/auth';
import { LanguageSelector } from '../common/LanguageSelector';
import { useTranslation } from '../../i18n/I18nContext';

interface HeaderProps {
  user?: UserProfile;
  onOpenUpgrade: () => void;
  onOpenInvite: () => void;
  onOpenAiPlayground?: () => void;
  onToggleMobileSidebar?: () => void;
  onOpenSalesPage?: () => void;
  onLogout?: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  user,
  onOpenUpgrade,
  onOpenInvite,
  onOpenAiPlayground,
  onToggleMobileSidebar,
  onOpenSalesPage,
  onLogout,
}) => {
  const { t } = useTranslation();
  const [showNotifications, setShowNotifications] = useState(false);
  const [showProfileMenu, setShowProfileMenu] = useState(false);
  const [showPlanMenu, setShowPlanMenu] = useState(false);
  const [notifications, setNotifications] = useState([
    {
      id: 1,
      title: 'Mariana comentou no board',
      body: 'Planejamento Operacional: "Já fiz os testes de estresse..."',
      time: '15m',
      unread: true,
    },
    {
      id: 2,
      title: 'Estúdio de Mapas Mentais 2.0',
      body: 'Copie e cole prints de tela com Ctrl+V diretamente na tela.',
      time: '2h',
      unread: true,
    },
    {
      id: 3,
      title: 'Backup em Nuvem Seguro',
      body: 'Todos os seus boards foram sincronizados com sucesso.',
      time: '1d',
      unread: false,
    },
  ]);

  const unreadCount = notifications.filter((n) => n.unread).length;

  const markAllRead = () => {
    setNotifications((prev) => prev.map((n) => ({ ...n, unread: false })));
  };

  const planLabel =
    user?.plan === 'team'
      ? 'Enterprise Team'
      : user?.plan === 'pro'
      ? 'Pro Creator'
      : 'Free';

  const userInitials =
    user?.name
      ?.split(' ')
      .map((w) => w[0])
      .slice(0, 2)
      .join('')
      .toUpperCase() || 'G2';

  return (
    <header className="h-14 border-b border-slate-200 bg-white px-3 sm:px-5 flex items-center justify-between z-30 shrink-0 select-none">
      {/* Left: Mobile hamburger & Diorfy Wordmark & Plan */}
      <div className="flex items-center gap-2 sm:gap-4">
        {onToggleMobileSidebar && (
          <button
            onClick={onToggleMobileSidebar}
            className="md:hidden p-1.5 text-slate-600 hover:text-slate-900 hover:bg-slate-100 rounded-lg transition-colors"
            title="Menu"
          >
            <Menu className="w-5 h-5" />
          </button>
        )}

        {/* Diorfy Logo */}
        <div
          onClick={onOpenSalesPage}
          className="flex items-center gap-2 cursor-pointer group"
          title={t('sales.pricingTitle')}
        >
          <DiorfyLogo markClassName="h-7 w-auto" textClassName="text-xl" />
        </div>

        {/* Plan Dropdown Button */}
        <div className="relative">
          <button
            onClick={() => setShowPlanMenu(!showPlanMenu)}
            className="flex items-center gap-1 px-2.5 py-1 text-xs font-medium text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-full transition-colors"
          >
            <span>
              Plan <strong className="font-semibold text-slate-900">{planLabel}</strong>
            </span>
            <ChevronDown className="w-3.5 h-3.5 text-slate-500" />
          </button>

          {showPlanMenu && (
            <div className="absolute left-0 top-full mt-1.5 w-64 bg-white rounded-xl shadow-xl border border-slate-200 py-2 z-50 animate-in fade-in slide-in-from-top-1">
              <div className="px-3 py-2 border-b border-slate-100">
                <p className="text-xs font-bold text-slate-900">{planLabel}</p>
                <p className="text-[11px] text-slate-500 mt-0.5">
                  {user?.plan === 'free'
                    ? t('sales.freePlanDesc')
                    : t('sales.teamPlanDesc')}
                </p>
              </div>
              <div className="px-2 pt-2">
                <button
                  onClick={() => {
                    setShowPlanMenu(false);
                    onOpenUpgrade();
                  }}
                  className="w-full flex items-center justify-center gap-1.5 py-2 px-3 text-xs font-semibold text-white bg-blue-600 hover:bg-blue-700 rounded-lg transition-colors"
                >
                  <Sparkles className="w-3.5 h-3.5" />
                  <span>{t('dashboard.upgradePlan')}</span>
                </button>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Right: Actions, Language Selector, Notifications, Profile */}
      <div className="flex items-center gap-1.5 sm:gap-2.5">
        {/* Language Selector in Header */}
        <LanguageSelector variant="light" showLabel={true} />

        {/* Link to Sales Landing */}
        {onOpenSalesPage && (
          <button
            onClick={onOpenSalesPage}
            className="hidden lg:flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-blue-700 bg-blue-50 hover:bg-blue-100 border border-blue-200 rounded-lg transition-colors cursor-pointer"
          >
            <Globe className="w-3.5 h-3.5 text-blue-600" />
            <span>{t('nav.pricing')}</span>
          </button>
        )}

        {/* Invite members button */}
        <button
          onClick={onOpenInvite}
          className="hidden md:flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-slate-700 hover:bg-slate-100 rounded-lg transition-colors cursor-pointer"
        >
          <User className="w-4 h-4 text-slate-500" />
          <span>{t('dashboard.inviteMembers')}</span>
        </button>

        {/* Upgrade Primary Button */}
        <button
          onClick={onOpenUpgrade}
          className="flex items-center gap-1.5 px-3 sm:px-3.5 py-1.5 text-xs font-semibold text-white bg-[#4262ff] hover:bg-[#3451e6] active:bg-[#2842d0] rounded-lg shadow-sm transition-all cursor-pointer"
        >
          <span>{t('common.upgrade')}</span>
        </button>

        {/* Notifications Bell */}
        <div className="relative">
          <button
            onClick={() => setShowNotifications(!showNotifications)}
            title={t('dashboard.notifications')}
            className="p-1.5 sm:p-2 text-slate-600 hover:text-slate-900 hover:bg-slate-100 rounded-lg transition-colors relative cursor-pointer"
          >
            <Bell className="w-4 h-4" />
            {unreadCount > 0 && (
              <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-blue-600 rounded-full animate-pulse" />
            )}
          </button>

          {showNotifications && (
            <div className="absolute right-0 top-full mt-1.5 w-72 sm:w-80 bg-white rounded-xl shadow-xl border border-slate-200 py-2 z-50">
              <div className="px-3.5 py-2 border-b border-slate-100 flex items-center justify-between">
                <h4 className="text-xs font-bold text-slate-900">{t('dashboard.notifications')}</h4>
                {unreadCount > 0 && (
                  <button
                    onClick={markAllRead}
                    className="text-[11px] text-blue-600 hover:underline font-medium cursor-pointer"
                  >
                    {t('dashboard.markAllRead')}
                  </button>
                )}
              </div>
              <div className="max-h-64 overflow-y-auto divide-y divide-slate-50">
                {notifications.map((notif) => (
                  <div
                    key={notif.id}
                    className={`px-3.5 py-2.5 hover:bg-slate-50 transition-colors ${
                      notif.unread ? 'bg-blue-50/40' : ''
                    }`}
                  >
                    <div className="flex items-start justify-between gap-1">
                      <p className="text-xs font-semibold text-slate-900">{notif.title}</p>
                      <span className="text-[10px] text-slate-400 shrink-0">{notif.time}</span>
                    </div>
                    <p className="text-xs text-slate-600 mt-0.5 line-clamp-2">{notif.body}</p>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* User Profile Avatar */}
        <div className="relative ml-1">
          <button
            onClick={() => setShowProfileMenu(!showProfileMenu)}
            className="w-8 h-8 rounded-full bg-[#e11d48] text-white font-bold text-xs flex items-center justify-center shadow-sm hover:ring-2 hover:ring-rose-300 transition-all cursor-pointer"
            title={`${user?.name || 'User'} (${user?.email || 'user@example.com'})`}
          >
            {userInitials}
          </button>

          {showProfileMenu && (
            <div className="absolute right-0 top-full mt-1.5 w-60 bg-white rounded-xl shadow-xl border border-slate-200 py-1.5 z-50">
              <div className="px-3.5 py-2.5 border-b border-slate-100">
                <p className="text-xs font-bold text-slate-900">{user?.name || 'Diorfy User'}</p>
                <p className="text-[11px] text-slate-500 truncate">
                  {user?.email || 'user@diorfy.com'}
                </p>
                <div className="mt-1 flex items-center gap-1.5">
                  <span className="text-[10px] font-semibold bg-emerald-100 text-emerald-800 px-1.5 py-0.5 rounded">
                    {planLabel}
                  </span>
                </div>
              </div>
              <div className="py-1">
                {onOpenSalesPage && (
                  <button
                    onClick={() => {
                      setShowProfileMenu(false);
                      onOpenSalesPage();
                    }}
                    className="w-full px-3.5 py-2 text-left text-xs text-slate-700 hover:bg-slate-100 flex items-center gap-2 cursor-pointer"
                  >
                    <Globe className="w-3.5 h-3.5 text-blue-600" />
                    {t('nav.pricing')}
                  </button>
                )}
                <button
                  onClick={() => {
                    setShowProfileMenu(false);
                    onOpenUpgrade();
                  }}
                  className="w-full px-3.5 py-2 text-left text-xs text-slate-700 hover:bg-slate-100 flex items-center gap-2 cursor-pointer"
                >
                  <Sparkles className="w-3.5 h-3.5 text-amber-500" />
                  {t('dashboard.upgradePlan')}
                </button>
              </div>
              <div className="border-t border-slate-100 pt-1">
                <button
                  onClick={() => {
                    setShowProfileMenu(false);
                    if (onLogout) onLogout();
                  }}
                  className="w-full px-3.5 py-2 text-left text-xs text-rose-600 hover:bg-rose-50 flex items-center gap-2 cursor-pointer"
                >
                  <LogOut className="w-3.5 h-3.5" />
                  {t('dashboard.logout')}
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};

