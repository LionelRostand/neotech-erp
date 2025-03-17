
import React from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Check, Trash2, Download, ChevronDown, ChevronUp } from 'lucide-react';
import { AppModule } from '@/data/types/modules';

interface ModuleCardProps {
  module: AppModule;
  isInstalled: boolean;
  isExpanded: boolean;
  onInstall: (moduleId: number) => void;
  onUninstall: (moduleId: number) => void;
  onToggleExpansion: (moduleId: number) => void;
}

const ModuleCard: React.FC<ModuleCardProps> = ({
  module,
  isInstalled,
  isExpanded,
  onInstall,
  onUninstall,
  onToggleExpansion
}) => {
  return (
    <Card className="border border-gray-200 transition-all hover:shadow-md flex flex-col">
      <CardHeader className="bg-gray-50 py-3 px-4">
        <div className="flex items-center gap-2">
          <div className="p-1.5 rounded-md bg-neotech-primary/10 text-neotech-primary">
            {module.icon}
          </div>
          <div className="flex-1">
            <CardTitle className="text-base">{module.name}</CardTitle>
            <CardDescription className="text-xs">Module #{module.id}</CardDescription>
          </div>
          {module.submodules && isInstalled && (
            <Button 
              variant="ghost" 
              size="sm" 
              onClick={() => onToggleExpansion(module.id)}
              className="ml-auto h-7 w-7 p-0"
            >
              {isExpanded ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
            </Button>
          )}
        </div>
      </CardHeader>
      <CardContent className="py-3 px-4 flex-1 text-sm">
        <p className="text-sm text-gray-600">{module.description}</p>
        
        {/* Sous-modules (visible uniquement si le module est installé et développé) */}
        {isInstalled && isExpanded && module.submodules && (
          <div className="mt-3 border-t pt-3">
            <h3 className="font-medium mb-2 text-sm">Fonctionnalités disponibles:</h3>
            <div className="grid grid-cols-1 gap-1.5">
              {module.submodules.map((submodule) => (
                <div key={submodule.id} className="flex items-center p-1.5 rounded-md bg-gray-50 hover:bg-gray-100">
                  <div className="mr-2 text-neotech-primary">
                    {submodule.icon}
                  </div>
                  <span className="text-xs font-medium">{submodule.name}</span>
                </div>
              ))}
            </div>
          </div>
        )}
      </CardContent>
      <CardFooter className="bg-gray-50 flex justify-between py-2 px-4">
        {isInstalled ? (
          <>
            <Button variant="ghost" size="sm" className="text-green-600 h-7 text-xs" disabled>
              <Check className="mr-1 h-3 w-3" />
              Installé
            </Button>
            <Button 
              variant="outline" 
              size="sm"
              className="text-red-600 hover:text-red-700 hover:bg-red-50 h-7 text-xs"
              onClick={() => onUninstall(module.id)}
            >
              <Trash2 className="mr-1 h-3 w-3" />
              Désinstaller
            </Button>
          </>
        ) : (
          <Button 
            variant="outline"
            size="sm"
            onClick={() => onInstall(module.id)}
            className="hover:bg-neotech-primary hover:text-white h-7 text-xs"
          >
            <Download className="mr-1 h-3 w-3" />
            Installer
          </Button>
        )}
      </CardFooter>
    </Card>
  );
};

export default ModuleCard;
