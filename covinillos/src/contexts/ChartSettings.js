// Settings Context - src/context/Settings
import React, { useState } from 'react';

import config from '../config';


const ChartSettingsContext = React.createContext();

const defaultChartSettings = {
  showData: config.defaultShowData,
  showType: config.defaultShowType,
};


export const ChartSettingsProvider = ({ children, chartSettings }) => {
   const [currentChartSettings, setCurrentChartSettings] = useState(
      chartSettings || defaultChartSettings
   );

   const saveChartSettings = (values) => {
     setCurrentChartSettings(values)
   };

   return (
      <ChartSettingsContext.Provider
         value={{ chartSettings: currentChartSettings, saveChartSettings }}
      >
         {children}
      </ChartSettingsContext.Provider>
   );
};

export const ChartSettingsConsumer = ChartSettingsContext.Consumer;

export default ChartSettingsContext;
