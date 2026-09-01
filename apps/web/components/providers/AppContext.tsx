'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';
import { db, User } from '../../lib/db-mock';

interface AppContextProps {
  activeOrgId: string;
  setActiveOrgId: (orgId: string) => void;
  currentUser: User;
  setCurrentUser: (user: User) => void;
  usersList: User[];
  refreshData: () => void;
  resetDatabase: () => void;
  onboardingComplete: boolean;
  setOnboardingComplete: (val: boolean) => void;
}

const AppContext = createContext<AppContextProps | undefined>(undefined);

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [activeOrgId, setActiveOrgId] = useState<string>('org-acme');
  const [currentUser, setCurrentUser] = useState<User>({
    id: 'usr-alice',
    organizationId: 'org-acme',
    email: 'alice.vance@acme.com',
    firstName: 'Alice',
    lastName: 'Vance',
    role: 'HR_ADMIN',
    status: 'active'
  });
  const [usersList, setUsersList] = useState<User[]>([]);
  const [refreshTrigger, setRefreshTrigger] = useState(0);
  const [onboardingComplete, setOnboardingComplete] = useState<boolean>(true);

  // Load configuration from local storage
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const savedOrg = localStorage.getItem('hrflow_active_org');
      const savedUser = localStorage.getItem('hrflow_active_user');
      const onboardingFlag = localStorage.getItem('hrflow_onboarding_completed');
      
      if (savedOrg) setActiveOrgId(savedOrg);
      if (onboardingFlag) {
        setOnboardingComplete(onboardingFlag === 'true');
      } else {
        setOnboardingComplete(true);
      }

      // Load matching users list
      try {
        const dbStateRaw = localStorage.getItem('hrflow_db_state');
        if (dbStateRaw) {
          const dbState = JSON.parse(dbStateRaw);
          setUsersList(dbState.users || []);
          if (savedUser && savedUser !== 'null') {
            try {
              const parsed = JSON.parse(savedUser) as User;
              if (parsed && parsed.id) {
                const match = (dbState.users as User[]).find(u => u && u.id === parsed.id);
                if (match) setCurrentUser(match);
              }
            } catch (err) {
              console.error("Error restoring user session:", err);
            }
          }
        }
      } catch (e) {
        console.error(e);
      }
    }
  }, [refreshTrigger]);

  const handleSetOrg = (orgId: string) => {
    setActiveOrgId(orgId);
    if (typeof window !== 'undefined') {
      localStorage.setItem('hrflow_active_org', orgId);
    }
    
    // Switch to first user in that org automatically
    try {
      const dbStateRaw = localStorage.getItem('hrflow_db_state');
      if (dbStateRaw) {
        const dbState = JSON.parse(dbStateRaw);
        const orgUsers = (dbState.users as User[]).filter(u => u.organizationId === orgId);
        if (orgUsers.length > 0) {
          handleSetUser(orgUsers[0]);
        }
      }
    } catch (e) {
      console.error(e);
    }
    setRefreshTrigger(prev => prev + 1);
  };

  const handleSetUser = (user: User) => {
    setCurrentUser(user);
    if (typeof window !== 'undefined') {
      localStorage.setItem('hrflow_active_user', JSON.stringify(user));
    }
    setRefreshTrigger(prev => prev + 1);
  };

  const handleSetOnboarding = (val: boolean) => {
    setOnboardingComplete(val);
    if (typeof window !== 'undefined') {
      localStorage.setItem('hrflow_onboarding_completed', val ? 'true' : 'false');
    }
  };

  const refreshData = () => {
    setRefreshTrigger(prev => prev + 1);
  };

  const resetDatabase = () => {
    db.resetDatabase();
    localStorage.removeItem('hrflow_active_org');
    localStorage.removeItem('hrflow_active_user');
    localStorage.removeItem('hrflow_onboarding_completed');
    setActiveOrgId('org-acme');
    setCurrentUser({
      id: 'usr-alice',
      organizationId: 'org-acme',
      email: 'alice.vance@acme.com',
      firstName: 'Alice',
      lastName: 'Vance',
      role: 'HR_ADMIN',
      status: 'active'
    });
    setOnboardingComplete(false);
    setRefreshTrigger(prev => prev + 1);
  };

  return (
    <AppContext.Provider
      value={{
        activeOrgId,
        setActiveOrgId: handleSetOrg,
        currentUser,
        setCurrentUser: handleSetUser,
        usersList,
        refreshData,
        resetDatabase,
        onboardingComplete,
        setOnboardingComplete: handleSetOnboarding
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (context === undefined) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
};
export { db };
