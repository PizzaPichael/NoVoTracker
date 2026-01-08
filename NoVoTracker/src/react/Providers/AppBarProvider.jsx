import React, { createContext, useContext, useState } from 'react';
import PropTypes from 'prop-types';

import { ArrowBack } from '@mui/icons-material';

const AppBarContext = createContext();

export const useAppBar = () => useContext(AppBarContext);

export const AppBarProvider = ({ children }) => {
  const [config, setConfig] = useState({
    showBackButton: true,
    backPath: '/',
    icon: <ArrowBack />,
    title: 'NoVoTracker',
  });

  const contextValue = React.useMemo(
    () => ({ config, setConfig }),
    [config, setConfig]
  );

  return (
    <AppBarContext.Provider value={contextValue}>
      {children}
    </AppBarContext.Provider>
  );
};

AppBarProvider.propTypes = {
  children: PropTypes.node.isRequired,
};
