
import React from 'react';
import { cn } from "@/lib/utils";

interface NavLinkProps {
  icon: React.ReactNode;
  label: string;
  href: string;
  isActive: boolean;
  onClick: () => void;
  showLabelWhenCollapsed?: boolean;
}

const NavLink = ({ 
  icon, 
  label, 
  href, 
  isActive, 
  onClick, 
  showLabelWhenCollapsed = true 
}: NavLinkProps) => (
  <a
    href={href}
    className={cn(
      "nav-link group flex items-center px-4 py-2 text-sm font-medium rounded-md my-1 transition-colors",
      isActive ? "bg-neotech-primary text-white" : "text-gray-700 hover:bg-gray-100"
    )}
    onClick={(e) => {
      e.preventDefault();
      onClick();
    }}
  >
    <span className="transition-transform duration-300 group-hover:scale-110 mr-3">
      {icon}
    </span>
    <span className={cn(
      "transition-opacity duration-300",
      !showLabelWhenCollapsed && "sidebar-collapsed-hide"
    )}>
      {label}
    </span>
  </a>
);

export default NavLink;
