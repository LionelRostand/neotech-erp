
import React, { useEffect } from 'react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/patched-select';
import { toast } from "sonner";

/**
 * This component serves as a patch for select components in the transport module.
 * It overrides the original select components with the patched ones that ensure
 * all SelectItems have valid values.
 */
const SelectPatch: React.FC = () => {
  useEffect(() => {
    // This is a hacky solution but it works for patching without modifying the transport module
    // It globally injects the patched Select components for use in the transport module
    try {
      // @ts-ignore - we're doing this hack to patch the components
      window.__PATCHED_SELECT__ = {
        Select,
        SelectContent,
        SelectItem,
        SelectTrigger,
        SelectValue
      };
      
      console.log('Select components patched successfully');
      
      // Monkey patch the original Select.Item component to ensure it always has a valid value
      const originalSelectItem = require('@radix-ui/react-select').Item;
      if (originalSelectItem && !originalSelectItem.__patched) {
        const OriginalComponent = originalSelectItem;
        
        // @ts-ignore - Extending the React component
        require('@radix-ui/react-select').Item = React.forwardRef((props: any, ref) => {
          // Ensure value is never empty
          const safeProps = {...props};
          if (!safeProps.value || safeProps.value === '') {
            safeProps.value = `item-${Math.random().toString(36).substring(2, 9)}`;
            console.log('Patched empty Select.Item value with:', safeProps.value);
          }
          
          return <OriginalComponent {...safeProps} ref={ref} />;
        });
        
        // Mark as patched to avoid double patching
        // @ts-ignore - Adding custom property
        require('@radix-ui/react-select').Item.__patched = true;
        
        console.log('Radix UI Select.Item monkey patched successfully');
      }
    } catch (error) {
      console.error('Failed to patch Select components:', error);
      toast.error("Failed to patch Select components", {
        description: "Some components may not work correctly"
      });
    }
    
    // Additional patch to ensure SelectItem from UI components is also patched
    try {
      const SelectUIModule = require('@/components/ui/select');
      if (SelectUIModule && SelectUIModule.SelectItem && !SelectUIModule.SelectItem.__patched) {
        const OriginalUISelectItem = SelectUIModule.SelectItem;
        
        // @ts-ignore - Replace the component
        SelectUIModule.SelectItem = React.forwardRef((props: any, ref) => {
          // Ensure value is never empty
          const safeProps = {...props};
          if (!safeProps.value || safeProps.value === '') {
            safeProps.value = `ui-item-${Math.random().toString(36).substring(2, 9)}`;
            console.log('Patched empty UI SelectItem value with:', safeProps.value);
          }
          
          return <OriginalUISelectItem {...safeProps} ref={ref} />;
        });
        
        // Mark as patched
        // @ts-ignore
        SelectUIModule.SelectItem.__patched = true;
        
        console.log('UI SelectItem patched successfully');
      }
    } catch (error) {
      console.error('Failed to patch UI SelectItem:', error);
    }
  }, []);

  // This component doesn't render anything
  return null;
};

export default SelectPatch;
