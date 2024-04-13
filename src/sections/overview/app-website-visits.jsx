import React, { useState, useEffect, useContext } from 'react';
import PropTypes from 'prop-types';
import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import CardHeader from '@mui/material/CardHeader';
import Select from '@mui/material/Select';
import MenuItem from '@mui/material/MenuItem';
import Checkbox from '@mui/material/Checkbox';
import ListItemText from '@mui/material/ListItemText';
import FormControl from '@mui/material/FormControl';
import InputLabel from '@mui/material/InputLabel';
import { ChartSelectionsContext } from './chart-selections-context';

import Chart, { useChart } from 'src/components/chart';

export default function AppWebsiteVisits({ title, subheader, chart, isGeneratingPDF, ...other }) {
  const { labels, colors, series, options } = chart;
  const { selections } = useContext(ChartSelectionsContext);
  const [selectedItems, setSelectedItems] = useState([]);
  const [oldSelectedItems, setOldSelectedItems] = useState([]);

  // Function to handle selection change
  const handleSelectionChange = (event) => {
    const value = event.target.value;
    // Limit the number of selected items to 3
    if (value.length <= 3) {
      setSelectedItems(value);
    }
  };

  useEffect(() => {
    if (isGeneratingPDF) {
      setOldSelectedItems(selectedItems);
      if (selections.appWebsiteVisitsEvents) {
        setSelectedItems(selections.appWebsiteVisitsEvents);
      }
    } else {
      setSelectedItems(oldSelectedItems);
    }
  }, [isGeneratingPDF]);

  // Initialize with context or default values
  useEffect(() => {
    setSelectedItems(series.slice(0, 3).map((s) => s.name));
    setOldSelectedItems(series.slice(0, 3).map((s) => s.name));
  }, [series]);

  // Filter the chart series based on the selected items
  const filteredSeries = series.filter((serie) => selectedItems.includes(serie.name));

  const chartOptions = useChart({
    colors,
    plotOptions: {
      bar: {
        columnWidth: '16%',
      },
    },
    fill: {
      type: series.map((i) => i.fill),
    },
    labels,
    xaxis: {
      type: 'datetime',
    },
    tooltip: {
      shared: true,
      intersect: false,
      y: {
        formatter: (value) => {
          if (typeof value !== 'undefined') {
            return `${value.toFixed(0)} visits`;
          }
          return value;
        },
      },
    },
    ...options,
  });

  return (
    <Card {...other} style={{ height: '100%' }}>
      <CardHeader title={title} subheader={subheader} />
      <FormControl
        fullWidth
        style={{
          marginInline: '2.5%',
          paddingInlineStart: '5px',
          marginBlockStart: '1vh',
          width: '95%',
          paddingBlockStart: '0.5vh',
        }}
      >
        <InputLabel id="multiple-checkbox-label">Select Data</InputLabel>
        <Select
          labelId="multiple-checkbox-label"
          multiple
          value={selectedItems}
          onChange={handleSelectionChange}
          renderValue={(selected) => selected.join(', ')}
        >
          {series.map((serie) => (
            <MenuItem key={serie.name} value={serie.name}>
              <Checkbox checked={selectedItems.indexOf(serie.name) > -1} />
              <ListItemText primary={serie.name} />
            </MenuItem>
          ))}
        </Select>
      </FormControl>
      <Box sx={{ p: 3, pb: 1 }}>
        <Chart
          className="pdf-section"
          dir="ltr"
          type="line"
          series={filteredSeries}
          options={chartOptions}
          width="100%"
          height={364}
        />
      </Box>
    </Card>
  );
}

AppWebsiteVisits.propTypes = {
  chart: PropTypes.object.isRequired,
  subheader: PropTypes.string,
  title: PropTypes.string,
};
