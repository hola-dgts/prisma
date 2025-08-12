'use client';

import { useState, useEffect } from 'react';
import Image from "next/image";
import { Settings, Users, BarChart3, Presentation, Plus, Eye, LogOut } from "lucide-react";
import { apiClient, User } from '@/lib/api';
import LoginForm from '@/components/LoginForm';
import PresentationsList from '@/components/PresentationsList';

export default function Home() {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [currentView, setCurrentView] = useState<'dashboard' | 'presentations' | 'analytics'>('presentations');

  useEffect(() => {
    checkAuth();
  }, []);

  const checkAuth = async () => {
    try {
      if (apiClient.isAuthenticated()) {
        const profile = await apiClient.getProfile();
        setUser(profile);
      }
    } catch (error) {
      console.error('Auth check failed:', error);
      await apiClient.logout();
    } finally {
      setIsLoading(false);
    }
  };

  const handleLogin = (userData: User) => {
    setUser(userData);
  };

  const handleLogout = async () => {
    await apiClient.logout();
    setUser(null);
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-neutral-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-red-600"></div>
        <span className="ml-2 text-neutral-600">Cargando...</span>
      </div>
    );
  }

  if (!user) {
    return <LoginForm onLogin={handleLogin} />;
  }

  return (
    <div className="min-h-screen bg-neutral-50">
      {/* Header */}
      <header className="bg-white border-b border-neutral-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-3">
              <Image
                src="/prisma-logo.svg"
                alt="Prisma Logo"
                width={32}
                height={32}
                className="w-8 h-8"
              />
              <h1 className="text-xl font-bold text-neutral-900">Prisma v5</h1>
            </div>
            <div className="flex items-center space-x-4">
              <span className="text-sm text-neutral-600">
                {user.email} ({user.role})
              </span>
              <button 
                onClick={handleLogout}
                className="p-2 text-neutral-600 hover:text-red-600 transition-colors"
                title="Cerrar sesión"
              >
                <LogOut className="w-5 h-5" />
              </button>
              <div className="w-8 h-8 bg-red-600 rounded-full flex items-center justify-center">
                <span className="text-white text-sm font-medium">
                  {user.name?.[0] || user.email[0].toUpperCase()}
                </span>
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Navigation */}
      <nav className="bg-white border-b border-neutral-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex space-x-8">
            <button
              onClick={() => setCurrentView('presentations')}
              className={`py-4 px-1 border-b-2 font-medium text-sm ${
                currentView === 'presentations'
                  ? 'border-red-500 text-red-600'
                  : 'border-transparent text-neutral-500 hover:text-neutral-700 hover:border-neutral-300'
              }`}
            >
              <Presentation className="w-4 h-4 inline mr-2" />
              Presentaciones
            </button>
            <button
              onClick={() => setCurrentView('analytics')}
              className={`py-4 px-1 border-b-2 font-medium text-sm ${
                currentView === 'analytics'
                  ? 'border-red-500 text-red-600'
                  : 'border-transparent text-neutral-500 hover:text-neutral-700 hover:border-neutral-300'
              }`}
            >
              <BarChart3 className="w-4 h-4 inline mr-2" />
              Analytics
            </button>
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {currentView === 'presentations' && (
          <PresentationsList
            onCreateNew={() => alert('Funcionalidad de crear presentación próximamente')}
            onEdit={(presentation) => alert(`Editar: ${presentation.title}`)}
          />
        )}
        
        {currentView === 'analytics' && (
          <div className="space-y-6">
            <div>
              <h2 className="text-2xl font-bold text-neutral-900 mb-2">Analytics</h2>
              <p className="text-neutral-600">Métricas y estadísticas de uso de las presentaciones.</p>
            </div>
            
            <div className="bg-white rounded-lg border border-neutral-200 p-6">
              <div className="text-center py-12">
                <BarChart3 className="w-16 h-16 text-neutral-400 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-neutral-900 mb-2">Analytics Dashboard</h3>
                <p className="text-neutral-600 mb-4">Panel de métricas y estadísticas próximamente.</p>
                <div className="bg-blue-50 border border-blue-200 rounded-md p-3 max-w-md mx-auto">
                  <p className="text-sm text-blue-600">
                    <strong>API Funcional:</strong> El sistema de analytics está funcionando correctamente en el backend.
                    La interfaz visual estará disponible próximamente.
                  </p>
                </div>
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
