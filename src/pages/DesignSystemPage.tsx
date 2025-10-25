/**
 * Design System Demo Page
 *
 * This page demonstrates the complete Pure Ohana Design System.
 * Add this route to see all components in action:
 *
 * In App.tsx:
 * import DesignSystemPage from './pages/DesignSystemPage';
 *
 * <Route path="/design-system" element={<DesignSystemPage />} />
 */

import React from 'react';
import DesignSystemShowcase from '../design-system/DesignSystemShowcase';

const DesignSystemPage: React.FC = () => {
  return <DesignSystemShowcase />;
};

export default DesignSystemPage;
