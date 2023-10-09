import React, { ReactElement } from 'react';

/**
 * This is the analytical dashboard page. It is responsible for displaying all user-specific stats.
 * The styled components for this page are located in the analyticalDashboard.styled.tsx file in the same directory.
 */

const AnalyticalDashboard = (): ReactElement => {
  React.useEffect(() => {
    document.title = 'dot i/o Profile';
  }, []);

  const user = 'Jane';

  return { user };
};

export default AnalyticalDashboard;
