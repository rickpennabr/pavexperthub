/**
 * AppContainer Component
 * 
 * The root container component that provides the main layout structure
 * for the entire application. It sets up the maximum width, minimum height,
 * and basic styling for the app's content area.
 */

import React from 'react';

interface ContainerProps {
  children: React.ReactNode;
}

const AppContainer: React.FC<ContainerProps> = ({ children }) => {
  return (
    <div className="w-full max-w-[1080px] min-h-screen mx-auto bg-black border border-black p-1 flex flex-col">
      {children}
    </div>
  );
};

export default AppContainer; 