
import { FileText, FileUp, Archive, FolderSearch, Settings } from 'lucide-react';
import { AppModule, createIcon } from '../types/modules';

export const documentsModule: AppModule = {
  id: 16,
  name: "Documents",
  description: "Gestion électronique de documents, archivage et partage",
  href: "/modules/documents",
  icon: createIcon(FileText),
  category: 'communication',
  submodules: [
    { id: "documents-files", name: "Fichiers", href: "/modules/documents/files", icon: createIcon(FileUp) },
    { id: "documents-archive", name: "Archives", href: "/modules/documents/archive", icon: createIcon(Archive) },
    { id: "documents-search", name: "Recherche", href: "/modules/documents/search", icon: createIcon(FolderSearch) },
    { id: "documents-settings", name: "Paramètres", href: "/modules/documents/settings", icon: createIcon(Settings) }
  ]
};
