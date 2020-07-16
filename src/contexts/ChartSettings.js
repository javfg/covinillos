// Settings Context - src/context/Settings
import React, { useState } from 'react';

import config from '../config';


const ChartSettingsContext = React.createContext();

const searchParams = new URLSearchParams(location.search);
const showData = searchParams.get('data') || config.defaultShowData;
const showType = searchParams.get('type') || config.defaultShowType;

const defaultChartSettings = { showData, showType };


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
