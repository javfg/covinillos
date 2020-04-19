import { useContext } from 'react';

import ChartSettingsContext from '../contexts/ChartSettings';


export default () => {
   const context = useContext(ChartSettingsContext);

   return context;
};
