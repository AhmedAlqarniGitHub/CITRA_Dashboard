import React, { useState } from 'react';
import PropTypes from 'prop-types';
import Card from '@mui/material/Card';
import CardHeader from '@mui/material/CardHeader';
import { styled, useTheme } from '@mui/material/styles';
import Select from '@mui/material/Select';
import MenuItem from '@mui/material/MenuItem';
import Checkbox from '@mui/material/Checkbox';
import ListItemText from '@mui/material/ListItemText';
import FormControl from '@mui/material/FormControl';
import InputLabel from '@mui/material/InputLabel';
import Box from '@mui/material/Box';

import Chart, { useChart } from 'src/components/chart';

const CHART_HEIGHT = 400;
const LEGEND_HEIGHT = 72;

const StyledChart = styled(Chart)(({ theme }) => ({
  height: CHART_HEIGHT,
  '& .apexcharts-canvas, .apexcharts-inner, svg, foreignObject': {
    height: `100% !important`,
  },
  '& .apexcharts-legend': {
    height: LEGEND_HEIGHT,
    borderTop: `dashed 1px ${theme.palette.divider}`,
    top: `calc(${CHART_HEIGHT - LEGEND_HEIGHT}px) !important`,
  },
}));

export default function AppCurrentSubject({ title, subheader, chart, ...other }) {
  const theme = useTheme();
  const { series, colors, categories, options } = chart;

  // State to track selected series
  const [selectedSeries, setSelectedSeries] = useState(series.slice(0, 3).map((s) => s.name));

  // Function to handle series selection change
  const handleSeriesChange = (event) => {
    const value = event.target.value;
    // Limit the number of selected series to 3
    if (value.length <= 3) {
      setSelectedSeries(value);
    }
  };

  // Filter the chart series based on the selected series
  const filteredSeries = series.filter((serie) => selectedSeries.includes(serie.name));

  const chartOptions = useChart({
    colors,
    stroke: {
      width: 2,
    },
    fill: {
      opacity: 0.48,
    },
    legend: {
      floating: true,
      position: 'bottom',
      horizontalAlign: 'center',
    },
    xaxis: {
      categories,
      labels: {
        style: {
          colors: [...Array(6)].map(() => theme.palette.text.secondary),
        },
      },
    },
    ...options,
  });

  return (
    <Card {...other} style={{ height: '100%' }}>
      <CardHeader title={title} subheader={subheader} sx={{ mb: 0 }} />

      <Box sx={{ display: 'flex', justifyContent: 'center', p: 2 }}>
        <FormControl fullWidth variant="outlined" style={{ paddingBlockStart: '1vh' }}>
          <InputLabel id="series-select-label">Select Series</InputLabel>
          <Select
            labelId="series-select-label"
            multiple
            value={selectedSeries}
            onChange={handleSeriesChange}
            renderValue={(selected) => selected.join(', ')}
          >
            {series.map((serie) => (
              <MenuItem key={serie.name} value={serie.name}>
                <Checkbox checked={selectedSeries.indexOf(serie.name) > -1} />
                <ListItemText primary={serie.name} />
              </MenuItem>
            ))}
          </Select>
        </FormControl>
      </Box>

      <StyledChart
        dir="ltr"
        type="radar"
        series={filteredSeries}
        options={chartOptions}
        width="100%"
        height={340}
      />
    </Card>
  );
}

AppCurrentSubject.propTypes = {
  chart: PropTypes.object,
  subheader: PropTypes.string,
  title: PropTypes.string,
};
