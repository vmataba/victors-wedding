import React from 'react';
import { AdminsContent } from './admins-content.component';

// Legacy component - redirects to new AdminsContent component
export const Admins: React.FC = () => {
    return <AdminsContent />;
};
