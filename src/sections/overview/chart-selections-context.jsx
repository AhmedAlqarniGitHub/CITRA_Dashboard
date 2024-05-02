import React, { createContext, useState, useEffect } from 'react';

export const ChartSelectionsContext = createContext();

export const ChartSelectionsProvider = ({ children }) => {
  const [selections, setSelections] = useState({
    emotionDistributionEvents: [],
    eventSatisfactionEvent: '',
    emotionsMapEvents: [],
    eventEmotionAnalysisEvents: [],
    eventEmotionAnalysisEmotions: [],
    emotionCorrelationHeatmapEvent: '',
    emotionCorrelationHeatmapMonth: '',
    appWebsiteVisitsEvents: [],
  });

  // Function to update selections
  const updateSelections = (newSelections) => {
    setSelections(newSelections);
  };

  const [appSelections, setAppSelections] = useState({
    appBarEvents: [],
    emotionDistributionEvents: [],
    eventSatisfactionEvent: '',
    emotionsMapEvents: [],
    eventEmotionAnalysisEvents: [],
    eventEmotionAnalysisEmotions: [],
    emotionCorrelationHeatmapEvent: '',
    emotionCorrelationHeatmapMonth: '',
    appWebsiteVisitsEvents: [],
    lineChartEvents: [],
    lineChartEmotions: [],
  });

  // Function to partially update app selections
  const updateAppSelections = (newAppSelections) => {
    setAppSelections((prevAppSelections) => ({ ...prevAppSelections, ...newAppSelections }));
  };

  return (
    <ChartSelectionsContext.Provider
      value={{ selections, updateSelections, appSelections, updateAppSelections }}
    >
      {children}
    </ChartSelectionsContext.Provider>
  );
};
