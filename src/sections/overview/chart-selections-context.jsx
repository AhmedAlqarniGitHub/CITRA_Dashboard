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

  return (
    <ChartSelectionsContext.Provider value={{ selections, updateSelections }}>
      {children}
    </ChartSelectionsContext.Provider>
  );
};
