
import React from 'react';
import ModuleItem from './ModuleItem';
import { AppModule } from '@/data/types/modules';

interface ModulesListProps {
  installedModules: AppModule[];
  expandedModules: {[key: number]: boolean};
  toggleModuleSubmenus: (moduleId: number) => void;
  showModules: boolean;
  location: { pathname: string };
  onNavigate: (href: string) => void;
}

const ModulesList: React.FC<ModulesListProps> = ({ 
  installedModules, 
  expandedModules, 
  toggleModuleSubmenus, 
  showModules, 
  location, 
  onNavigate 
}) => {
  if (!showModules || installedModules.length === 0) return null;
  
  return (
    <div className="space-y-1 py-2">
      {installedModules.map((module) => (
        <ModuleItem
          key={module.id}
          module={module}
          isExpanded={expandedModules[module.id] || false}
          toggleModuleSubmenus={toggleModuleSubmenus}
          location={location}
          onNavigate={onNavigate}
        />
      ))}
    </div>
  );
};

export default ModulesList;
