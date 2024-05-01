import React, { useEffect, useState, useRef, useContext } from 'react';
import Container from '@mui/material/Container';
import Grid from '@mui/material/Unstable_Grid2';
import Typography from '@mui/material/Typography';
import AppWidgetSummary from '../app-widget-summary';
import EmotionsPerEvent from '../app-website-visits';
import AppCurrentVisits from '../app-current-visits';
import BarChartComponent from '../app-bar-chart';
import AppCurrentSubject from '../app-current-subject';
import InteractiveLineChart from '../app-line-chart';
import AppOrderTimeline from '../app-order-timeline';
import AppSatisfactionGauge from '../app-satisfaction-guage';
import Iconify from 'src/components/iconify';
import Box from '@mui/material/Box';
import AppEmotionCorrelationHeatmap from '../app-emotions-correlations-heatmap';
import SelectionModal from '../selection-modal';
import Button from '@mui/material/Button'; // Add this line
import { ChartSelectionsContext } from '../chart-selections-context';

import { jsPDF } from 'jspdf';
import 'jspdf-autotable';
import html2canvas from 'html2canvas';

import axios from 'axios';
const apiBaseUrl = import.meta.env.VITE_API_URL || 'http://localhost:3000';

const chartStyle = {
  height: '580px', // Adjust this value as needed
};

export default function AppView() {
  const [chartData, setChartData] = useState({
    completeEventData: [],
    eventsBarChart: [],
    eventsTimeline: [],
    totalEmotionsPerEvent: [],
    heatmapData: {},
    appWebsiteVisitsData: {},
    emotionCorrelationHeatmapData: [],
  });

  const [summaryData, setSummaryData] = useState({
    totalEvents: 0,
    activeEvents: 0,
    totalEmotions: 0,
    totalCameras: 0,
  });

  const [modalOpen, setModalOpen] = useState(false);
  const [events, setEvents] = useState([]);
  const [months, setMonths] = useState([]);
  const [emotions, setEmotions] = useState([]);

  useEffect(() => {
    const fetchSummaryData = async () => {
      try {
        let user = {
          id: localStorage.getItem('id'),
        };

        const eventSummaryResponse = await axios.get(`${apiBaseUrl}/events/summary/${user.id}`);
        const cameraSummaryResponse = await axios.get(`${apiBaseUrl}/cameras/summary/${user.id}`);

        setSummaryData({
          totalEvents: eventSummaryResponse.data.totalEvents,
          activeEvents: eventSummaryResponse.data.activeEvents,
          totalEmotions: eventSummaryResponse.data.totalEmotions,
          totalCameras: cameraSummaryResponse.data.totalCameras,
        });
      } catch (error) {
        console.error('Axios error:', error.message);
      }
    };

    const fetchChartData = async () => {
      try {
        let user = {
          id: localStorage.getItem('id'),
        };
        const response = await axios.get(`${apiBaseUrl}/events/charts/${user.id}`);
        setChartData(response.data);

        const fetchedEvents = response.data.eventsBarChart.map((chart) => chart.event);
        const fetchedMonths = response.data.completeEventData.map((data) => data.month);
        const fetchedEmotions =
          response.data.eventsBarChart.length > 0
            ? Object.keys(response.data.eventsBarChart[0])
              .filter((key) => key !== 'event')
              .map((e) => e.toLowerCase())
            : [];

        setEvents(fetchedEvents);
        setMonths(fetchedMonths);
        setEmotions(fetchedEmotions);
      } catch (error) {
        console.error('Axios error:', error.message);
      }
    };

    fetchSummaryData();
    fetchChartData();
     // Set up polling
     const interval = setInterval(() => {
      fetchSummaryData();
      fetchChartData();
    }, 10000); // Polling every 10 seconds

    // Cleanup function to clear the interval when the component unmounts
    return () => clearInterval(interval);
  }, []);

  const {
    completeEventData,
    eventsBarChart,
    eventsTimeline,
    totalEmotionsPerEvent,
    heatmapData,
    appWebsiteVisitsData,
    emotionCorrelationHeatmapData,
  } = chartData;

  // Define colors for each emotion
  const emotionColors = {
    happy: '#FFD700', // Gold
    sad: '#1E90FF', // DodgerBlue
    disgusted: '#008000', // Green
    surprised: '#FF69B4', // HotPink
    neutral: '#A52A2A', // Brown
    fearful: '#800080', // Purple
    angry: '#FF0000', // Red
  };

  // Construct series for BarChartComponent
  const series = emotions.map((emotion) => ({
    dataKey: emotion,
    label: emotion,
    fill: emotionColors[emotion] || '#000000', // Default to black if emotion not found
  }));

  const [isGeneratingPDF, setIsGeneratingPDF] = useState(false);

  const handleGeneratePDF = () => {
    setModalOpen(true);
  };

  // Function to handle selection changes from the modal
  const handleSelectionChange = (newSelections) => {
    // Here you can update the state or perform other actions with the new selections
  };
  const { selections, updateSelections } = useContext(ChartSelectionsContext);

  const handleModalSave = async (newSelections) => {
    await updateSelections(newSelections);

    // Close the modal
    setModalOpen(false);
    setIsGeneratingPDF(true); // Set this flag to true when PDF generation starts

    // Generate PDF after a brief delay
    setTimeout(() => {
      generatePDF(newSelections);
    }, 500);
  };

  const pdfRef = useRef(null);
  const logoUrl = '/assets/logo.svg'; // Adjust the path as necessary

  const getSvgAsBase64Image = async (svgUrl, width, height) => {
    const svgResponse = await fetch(svgUrl);
    const svgText = await svgResponse.text();
    return new Promise((resolve, reject) => {
      const img = new Image();
      img.onload = () => {
        const canvas = document.createElement('canvas');
        canvas.width = width;
        canvas.height = height;
        const context = canvas.getContext('2d');
        context.drawImage(img, 0, 0, width, height);
        resolve(canvas.toDataURL('image/png'));
      };
      img.onerror = () => reject('Error loading SVG');
      img.src = 'data:image/svg+xml;base64,' + btoa(unescape(encodeURIComponent(svgText)));
    });
  };
  // Function to map selection names to a more readable format
  const mapSelectionName = (name) => {
    if (name.endsWith('Emotions') || name.endsWith('Emotion')) {
      return 'Emotions';
    } else if (name.endsWith('Events') || name.endsWith('Event')) {
      return 'Events';
    } else if (name.endsWith('Months') || name.endsWith('Month')) {
      return 'Months';
    }
    return name; // Default case
  };

  const addCoverPage = async (pdf, logoData, pageWidth) => {
    const userName = (await localStorage.getItem('name')) || 'User';
    const userEmail = (await localStorage.getItem('email')) || 'email@example.com';

    await pdf.addImage(logoData, 'PNG', (pageWidth - 50) / 2, 40, 50, 50);
    await pdf.setFontSize(24);
    await pdf.setTextColor('#336699');
    await pdf.text('Welcome to Your Report', pageWidth / 2, 130, null, null, 'center');
    await pdf.setFontSize(18);
    await pdf.text(userName, pageWidth / 2, 160, null, null, 'center');
    await pdf.text(userEmail, pageWidth / 2, 180, null, null, 'center');
    await pdf.addPage();
  };

  const addTableOfContents = async (pdf, chartTitles, pageWidth) => {
    await pdf.setFontSize(20);
    await pdf.setTextColor('#336699');
    await pdf.text('Table of Contents', pageWidth / 2, 40, null, null, 'center');
    await pdf.setFontSize(14);
    await chartTitles.forEach(async (title, index) => {
      await pdf.text(`${index + 1}. ${title}`, 20, 60 + index * 20);
      await pdf.text(`${index + 2}`, pageWidth - 20, 60 + index * 20, null, null, 'right');
    });
    await pdf.addPage();
  };

  const addIntroductionPage = (pdf, pageWidth) => {
    // Title for the Introduction Page
    const title = 'Report Overview';
    pdf.setFontSize(20);
    pdf.setTextColor('#336699'); // Navy blue
    pdf.text(title, pageWidth / 2, 40, null, null, 'center');

    // Decorative line under the title
    pdf.setDrawColor('#336699');
    pdf.setLineWidth(1);
    pdf.line(60, 45, pageWidth - 60, 45);

    // Introduction Text
    const introText = [
      'This report is designed to provide a comprehensive overview of the key metrics and data. To make the most out of this report, consider the following guidelines:',
      'Each section focuses on a specific aspect of the data, offering a clear and concise analysis.',
      'Interactive charts and visual representations are used to simplify complex data insights.',
      'Look for trends and patterns within the charts to understand the broader implications.',
      'The report is structured to progressively build your understanding, so reviewing it in sequence is recommended.',
      'The information in this report aims to offer strategic insights and support informed decision-making. Please take your time to review each section thoroughly to fully grasp the detailed analyses provided.',
    ];
    pdf.setFont('helvetica'); // Setting a readable font
    pdf.setFontSize(12);
    pdf.setTextColor('#333333'); // Darker text for better readability

    let startY = 60; // Y position where the introduction text will start
    const lineHeight = 10; // Vertical space between lines

    introText.forEach((line, index) => {
      // Adjust the second parameter to startY + (lineHeight * index) to prevent overlapping
      pdf.text(line, 15, startY + lineHeight * index, {
        maxWidth: pageWidth - 30,
        align: 'justify',
      });
    });
    pdf.addPage();
  };

  const addSummaryPage = async (pdf, summaryData, events, pageWidth) => {
    let currentY = 20;
    const primaryColor = '#336699';
    const textColor = '#333333';
    const iconSize = 15;

    // Load the logo
    const logoData = await getSvgAsBase64Image(logoUrl, 200, 200);

    // Add the logo to the summary page
    const logoX = (pageWidth - 60) / 2;
    pdf.addImage(logoData, 'PNG', logoX, currentY, 60, 60);
    currentY += 70; // Increment Y position after logo

    // Summary title
    pdf.setFontSize(20);
    pdf.setTextColor(primaryColor);
    pdf.text('Summary Overview', pageWidth / 2, currentY, null, null, 'center');

    // Summary explanation text
    const summaryDescription =
      'This overview encapsulates the pivotal data points collected from the events. It offers insights into the overall activity, the responsiveness captured through active events, the diversity of emotions identified, and the extent of coverage provided by the camera network.';
    currentY += 20; // Increment Y position after title
    pdf.setFontSize(12);
    pdf.setTextColor(textColor);
    pdf.text(summaryDescription, pageWidth / 2, currentY, {
      maxWidth: pageWidth - 40,
      align: 'center',
    });
    currentY += 20; // Increment Y position after text

    // Main summary table with icons and counts
    pdf.autoTable({
      startY: currentY,
      theme: 'grid',
      head: [['Metric', 'Count', 'Description']],
      body: [
        [
          'Total Events',
          summaryData.totalEvents.toString(),
          'The cumulative number of events recorded.',
        ],
        ['Active Events', summaryData.activeEvents.toString(), 'Events currently in progress.'],
        [
          'Emotions Detected',
          summaryData.totalEmotions.toString(),
          'Total count of all emotions detected.',
        ],
        [
          'Number of Cameras',
          summaryData.totalCameras.toString(),
          'Cameras operational and recording.',
        ],
      ],
      styles: { valign: 'middle', cellWidth: 'wrap', fontSize: 11 },
      headStyles: { fillColor: primaryColor, textColor: '#FFFFFF', fontStyle: 'bold' },
      columnStyles: {
        1: { cellWidth: iconSize },
        2: { halign: 'center' },
        3: { cellWidth: 'auto' },
      },
      margin: { left: 20, right: 20, top: 20, bottom: 20 },
    });
    currentY = pdf.lastAutoTable.finalY + 10; // Update Y position after table

    // Add a detailed explanation paragraph
    pdf.setFontSize(12);
    pdf.setTextColor(textColor);
    pdf.text(
      'Each metric provides a unique perspective on the event dynamics. Combined, they deliver a comprehensive view of the engagement and the emotional responses elicited.',
      20,
      currentY,
      { maxWidth: pageWidth - 40, align: 'justify' }
    );

    currentY += 30; // Increment Y position after detailed explanation

    // Events list title
    pdf.setFontSize(14);
    pdf.setTextColor(primaryColor);
    pdf.text('Detailed Events Breakdown', pageWidth / 2, currentY, null, null, 'center');
    currentY += 10; // Increment Y position after title

    // Events list table
    const eventList = events.map((event) => [event]);
    pdf.autoTable({
      startY: currentY,
      head: [['Event Name']],
      body: eventList,
      theme: 'striped',
      styles: { halign: 'left', cellWidth: 'wrap', fontSize: 11 },
      headStyles: { fillColor: primaryColor, textColor: '#FFFFFF', fontStyle: 'bold' },
      margin: { left: 20, right: 20, top: 20, bottom: 20 },
    });

    pdf.addPage();
  };

  const getChartDescription = async (chartData, chartTitle) => {
    try {
      const response = await axios.post(`${apiBaseUrl}/actions/generate-text`, {
        prompt: `Please provide a 50-word description for the following chart data of ${chartTitle}: ${JSON.stringify(
          chartData
        )}`,
      });
      return response.data;
    } catch (error) {
      console.error('Error while getting chart description:', error);
      return 'Description unavailable';
    }
  };

  const generatePDF = async (newSelections) => {
    // Selections from context
    const {
      emotionDistributionEvents,
      eventSatisfactionEvent,
      emotionsMapEvents,
      eventEmotionAnalysisEvents,
      eventEmotionAnalysisEmotions,
      emotionCorrelationHeatmapEvent,
      emotionCorrelationHeatmapMonth,
      appWebsiteVisitsEvents,
    } = newSelections;

    const chartSelectionsMapping = {
      'Emotions per Event': { Events: appWebsiteVisitsEvents.join(', ') },
      'Emotion Distribution per Event': { Events: emotionDistributionEvents.join(', ') },
      'Event Satisfaction': { Event: eventSatisfactionEvent },
      'Emotions Map': { Events: emotionsMapEvents.join(', ') },
      'Event Emotion Analysis': {
        Events: eventEmotionAnalysisEvents.join(', '),
        Emotions: eventEmotionAnalysisEmotions.join(', '),
      },
      'Emotion Correlation Heatmap': {
        Event: emotionCorrelationHeatmapEvent,
        Month: months[emotionCorrelationHeatmapMonth - 1],
      },
      // Add other charts if needed
    };

    // Start generating PDF content
    if (pdfRef.current) {
      const reportGeneratedTime = new Date().toLocaleString();
      const logoData = await getSvgAsBase64Image(logoUrl, 260, 250);
      const pdf = new jsPDF();
      const elements = pdfRef.current.getElementsByClassName('pdf-section');
      const pageHeight = pdf.internal.pageSize.getHeight();
      const pageWidth = pdf.internal.pageSize.getWidth();

      // Create cover page
      await addCoverPage(pdf, logoData, pageWidth);

      // Prepare for table of contents
      let pageIndex = 3; // Cover page is page 1
      const chartTitles = ['Introduction', 'Summary Overview']; // Start with the Summary page title

      // Add Introduction Page
      await addIntroductionPage(pdf, pageWidth);
      pageIndex++; // Increment page index for the introduction page

      // Create summary page and add its title to the table of contents
      await addSummaryPage(pdf, summaryData, events, pageWidth);
      pageIndex++; // Increment page index for the summary page

      // Add other chart titles for table of contents
      Array.from(elements).forEach((element) => {
        const chartTitle = element
          .closest('.MuiCard-root')
          .querySelector('.MuiCardHeader-title').innerText;
        chartTitles.push(chartTitle);
      });

      // Create table of contents
      await addTableOfContents(pdf, chartTitles, pageWidth, pageIndex);

      // Define Colors
      const primaryColor = '#336699'; // Navy blue shade
      const secondaryColor = '#6699CC'; // Light blue shade
      const textColor = '#333333'; // Dark text
      const whiteColor = '#FFFFFF'; // White text for contrast

      for (let i = 0; i < elements.length; i++) {
        const element = elements[i];
        const canvas = await html2canvas(element, { scale: 2 }); // Scale canvas for better quality
        const imgData = canvas.toDataURL('image/png');
        const chartTitle = element
          .closest('.MuiCard-root')
          .querySelector('.MuiCardHeader-title').innerText;
        const selections = chartSelectionsMapping[chartTitle] || {};

        // Add new page for each chart
        if (i > 0) pdf.addPage();
        pageIndex++; // Increment page index for each new chart page

        const pageWidth = pdf.internal.pageSize.getWidth();
        pdf.addImage(logoData, 'PNG', (pageWidth - 25) / 2, 10, 25, 25);

        pdf.setFontSize(16);
        pdf.setTextColor(primaryColor);
        pdf.text('General Report', pageWidth / 2, 45, null, null, 'center');

        pdf.setLineWidth(1);
        pdf.setDrawColor(primaryColor);
        pdf.line(10, 55, pageWidth - 10, 55);

        pdf.setFontSize(14);
        pdf.setTextColor(secondaryColor);
        pdf.text(chartTitle, 15, 70);

        // Adjust chart height to not exceed 30% of the page height while maintaining the aspect ratio
        const maxChartHeight = (pageHeight * 30) / 100; // 30% of page height
        const aspectRatio = canvas.width / canvas.height;
        const chartWidth = i < elements.length - 2 ? 180 / aspectRatio : 180; // Fixed chart width
        const chartHeight = Math.min(maxChartHeight, chartWidth / aspectRatio);
        // Center the chart horizontally
        const xPosition = (pageWidth - chartWidth) / 2;
        const yPosition = 80; // Y position for chart

        // Add chart image to PDF
        pdf.addImage(imgData, 'PNG', xPosition, yPosition, chartWidth, chartHeight);

        let tableYPosition = yPosition + chartHeight + 10;
        const body = Object.entries(selections).map(([key, value]) => [
          mapSelectionName(key),
          value,
        ]);

        pdf.autoTable({
          startY: tableYPosition,
          head: [['Type', 'Value']],
          body: body,
          theme: 'grid',
          styles: {
            halign: 'center',
            cellWidth: 'wrap',
            fillColor: primaryColor,
            textColor: whiteColor,
            fontStyle: 'bold',
          },
          columnStyles: {
            0: { fillColor: secondaryColor, textColor: whiteColor },
            1: { cellWidth: 'auto' },
          },
        });

        // Prepare chart data for AI description
        const chartKey = chartTitle.toLowerCase().replace(/\s/g, '_');
        const formattedChartData = JSON.stringify(chartData[chartKey] || {});

        // Fetch chart description from backend
        let cardYPosition = yPosition + chartHeight + 40; // Adjusted space between chart and card
        const chartAnalysisTitle = 'Chart Description';
        const chartAnalysisText = await getChartDescription(formattedChartData, chartTitle);

        // Card Background
        const cardHeight = 50; // Adjust as needed
        pdf.setFillColor(230, 230, 230); // Light grey background
        pdf.roundedRect(15, cardYPosition, pageWidth - 30, cardHeight, 3, 3, 'FD'); // Draw rectangle for card

        // Style the card title
        pdf.setFontSize(16); // Increase the size for the title
        pdf.setTextColor(primaryColor); // Color similar to the page title
        pdf.setFont('helvetica', 'bold'); // Bold title
        pdf.text(chartAnalysisTitle, 20, cardYPosition + 10);

        // Style the card text
        pdf.setFontSize(12); // Regular size for text
        pdf.setTextColor(textColor); // Regular text color
        pdf.setFont('helvetica', 'normal'); // Normal font weight for text
        pdf.text(chartAnalysisText, 20, cardYPosition + 20, { maxWidth: pageWidth - 40 });

        // Ensure there is no overlap with the next content
        let nextContentYPosition = cardYPosition + cardHeight + 10;

        pdf.setDrawColor(primaryColor);
        pdf.line(10, 280, 200, 280);
        pdf.setTextColor(textColor);
        pdf.setFontSize(10);
        pdf.text(
          `Page ${i + 1} - Generated on: ${reportGeneratedTime}`,
          105,
          285,
          null,
          null,
          'center'
        );
      }

      pdf.save(`General-report.pdf`);
      setIsGeneratingPDF(false);
    } else {
      console.error('PDF generation error: pdfRef is not attached to a DOM element.');
    }
  };
  return (
    <Container maxWidth="xl">
      <Typography variant="h4" sx={{ mb: 5 }}>
        Hi, Welcome back 👋
      </Typography>

      <div ref={pdfRef}>
        <Grid container spacing={3}>
          {/* Widgets */}
          <Grid item xs={12} sm={6} md={3}>
            <AppWidgetSummary
              title="Total Events"
              total={summaryData.totalEvents}
              color="success"
              icon={<img alt="icon" src="/assets/icons/app-view/events_list.png" />}
            />
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
            <AppWidgetSummary
              title="Active Events"
              total={summaryData.activeEvents}
              color="info"
              icon={<img alt="icon" src="/assets/icons/app-view/active_event.png" />}
            />
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
            <AppWidgetSummary
              title="Emotions Detected"
              total={summaryData.totalEmotions}
              color="warning"
              icon={<img alt="icon" src="/assets/icons/app-view/total_emotions.png" />}
            />
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
            <AppWidgetSummary
              title="Number of Cameras"
              total={summaryData.totalCameras}
              color="error"
              icon={<img alt="icon" src="/assets/icons/app-view/cameras.png" />}
            />
          </Grid>

          {/* Charts */}
          {appWebsiteVisitsData.chart && (
            <Grid item xs={12} md={6} lg={8} style={chartStyle}>
              <EmotionsPerEvent
                title="Emotions per Event"
                subheader="Emotions per each event"
                chart={appWebsiteVisitsData.chart}
                isGeneratingPDF={isGeneratingPDF}
              />
            </Grid>
          )}
          {totalEmotionsPerEvent && (
            <Grid item xs={12} md={6} lg={4} style={chartStyle}>
              <AppCurrentVisits
                title="Emotions Events Percentage"
                chart={{
                  series: totalEmotionsPerEvent,
                }}
                isGeneratingPDF={isGeneratingPDF}
              />
            </Grid>
          )}
          {eventsBarChart && (
            <Grid item xs={12} md={6} lg={8} style={chartStyle}>
              <BarChartComponent
                title="Emotion Distribution per Event"
                subheader="Aggregated data over the last 12 months"
                dataset={eventsBarChart}
                xAxis={{ dataKey: 'event' }}
                series={series}
                isGeneratingPDF={isGeneratingPDF}
              />
            </Grid>
          )}
          {eventsTimeline && (
            <Grid item xs={12} md={6} lg={4} style={chartStyle}>
              <AppOrderTimeline
                title="Events Timeline"
                eventsTimeline={eventsTimeline}
                isGeneratingPDF={isGeneratingPDF}
              />
            </Grid>
          )}
          <Grid item xs={12} md={6} lg={6} style={chartStyle}>
            <AppSatisfactionGauge title="Event Satisfaction" isGeneratingPDF={isGeneratingPDF} />
          </Grid>
          {heatmapData && heatmapData.series && (
            <Grid item xs={12} md={6} lg={6} style={chartStyle}>
              <AppCurrentSubject
                title="Emotions Map"
                chart={heatmapData}
                isGeneratingPDF={isGeneratingPDF}
              />
            </Grid>
          )}
          {completeEventData.length > 0 && (
            <Grid item xs={12} md={12} lg={12} style={chartStyle}>
              <InteractiveLineChart
                title="Event Emotion Analysis"
                subheader="Monthly emotion distribution per event"
                completeEventData={completeEventData}
                events={events}
                emotions={emotions}
                isGeneratingPDF={isGeneratingPDF}
              />
            </Grid>
          )}
          {emotionCorrelationHeatmapData && (
            <Grid item xs={12} lg={12} style={chartStyle}>
              <AppEmotionCorrelationHeatmap
                emotionCorrelationHeatmapData={emotionCorrelationHeatmapData}
                events={events}
                isGeneratingPDF={isGeneratingPDF}
              />
            </Grid>
          )}
        </Grid>
      </div>

      <SelectionModal
        open={modalOpen}
        onClose={() => setModalOpen(false)}
        onSave={handleModalSave}
        events={events}
        months={months}
        emotions={emotions}
        onSelectionChange={handleSelectionChange}
      />

      <Box display="flex" justifyContent="center" my={2}>
        <Button
          variant="contained"
          startIcon={<Iconify icon="mdi:file-pdf-box" />}
          onClick={handleGeneratePDF}
          sx={{
            bgcolor: 'primary.main',
            '&:hover': {
              bgcolor: 'primary.dark',
            },
          }}
        >
          Generate PDF
        </Button>
      </Box>

    </Container>
  );
}
