// Dataset for the last 12 months for each event and each emotion
const completeEventData = [
    {
      month: 'Jan',
      'KFUPM Expo': { Happy: 120, Sad: 60, Disgusted: 30, Surprised: 90, Natural: 300, Fear: 1 },
      'Innovation Expo': { Happy: 140, Sad: 50, Disgusted: 25, Surprised: 80, Natural: 250, Fear: 20 },
      'Riyadh Boulevard': { Happy: 110, Sad: 70, Disgusted: 35, Surprised: 75, Natural: 220, Fear: 18 },
      'Tech Summit': { Happy: 130, Sad: 80, Disgusted: 40, Surprised: 85, Natural: 290, Fear: 16 },
    },
    {
        month: 'Feb',
        'KFUPM Expo': { Happy: 10, Sad: 60, Disgusted: 45, Surprised: 70, Natural: 30, Fear: 1 },
        'Innovation Expo': { Happy: 190, Sad: 10, Disgusted: 35, Surprised: 40, Natural: 20, Fear: 200 },
        'Riyadh Boulevard': { Happy: 220, Sad: 33, Disgusted: 55, Surprised: 98, Natural: 111, Fear: 13 },
        'Tech Summit': { Happy: 130, Sad: 80, Disgusted: 40, Surprised: 85, Natural: 20, Fear: 16 },
      },
      {
        month: 'Mar',
        'KFUPM Expo': { Happy: 55, Sad: 40, Disgusted: 33, Surprised: 66, Natural: 200, Fear: 1 },
        'Innovation Expo': { Happy: 140, Sad: 50, Disgusted: 25, Surprised: 80, Natural: 50, Fear: 44 },
        'Riyadh Boulevard': { Happy: 110, Sad: 40, Disgusted: 35, Surprised: 55, Natural: 220, Fear: 18 },
        'Tech Summit': { Happy: 130, Sad: 44, Disgusted: 40, Surprised: 85, Natural: 190, Fear: 16 },
      },
      {
        month: 'Apr',
        'KFUPM Expo': { Happy: 120, Sad: 63, Disgusted: 22, Surprised: 10, Natural: 100, Fear: 1 },
        'Innovation Expo': { Happy: 140, Sad: 50, Disgusted: 25, Surprised: 80, Natural: 250, Fear: 20 },
        'Riyadh Boulevard': { Happy: 110, Sad: 44, Disgusted: 35, Surprised: 75, Natural: 220, Fear: 18 },
        'Tech Summit': { Happy: 130, Sad: 80, Disgusted: 55, Surprised: 66, Natural: 290, Fear: 16 },
      },
      {
        month: 'May',
        'KFUPM Expo': { Happy: 120, Sad: 60, Disgusted: 30, Surprised: 44, Natural: 300, Fear: 1 },
        'Innovation Expo': { Happy: 140, Sad: 50, Disgusted: 25, Surprised: 44, Natural: 250, Fear: 20 },
        'Riyadh Boulevard': { Happy: 110, Sad: 70, Disgusted: 35, Surprised: 45, Natural: 220, Fear: 18 },
        'Tech Summit': { Happy: 130, Sad: 80, Disgusted: 40, Surprised: 45, Natural: 490, Fear: 16 },
      },
      {
        month: 'Jun',
        'KFUPM Expo': { Happy: 120, Sad: 60, Disgusted: 30, Surprised: 90, Natural: 300, Fear: 1 },
        'Innovation Expo': { Happy: 140, Sad: 50, Disgusted: 25, Surprised: 80, Natural: 150, Fear: 20 },
        'Riyadh Boulevard': { Happy: 110, Sad: 70, Disgusted: 35, Surprised: 75, Natural: 110, Fear: 18 },
        'Tech Summit': { Happy: 90, Sad: 91, Disgusted: 88, Surprised: 55, Natural: 111, Fear: 16 },
      },
      {
        month: 'Jul',
        'KFUPM Expo': { Happy: 111, Sad: 60, Disgusted: 30, Surprised: 90, Natural: 300, Fear: 1 },
        'Innovation Expo': { Happy: 140, Sad: 50, Disgusted: 25, Surprised: 80, Natural: 250, Fear: 20 },
        'Riyadh Boulevard': { Happy: 200, Sad: 70, Disgusted: 35, Surprised: 75, Natural: 220, Fear: 18 },
        'Tech Summit': { Happy: 130, Sad: 80, Disgusted: 40, Surprised: 85, Natural: 290, Fear: 16 },
      },
      {
        month: 'Aug',
        'KFUPM Expo': { Happy: 120, Sad: 60, Disgusted: 30, Surprised: 90, Natural: 300, Fear: 1 },
        'Innovation Expo': { Happy: 140, Sad: 50, Disgusted: 25, Surprised: 80, Natural: 250, Fear: 20 },
        'Riyadh Boulevard': { Happy: 110, Sad: 70, Disgusted: 65, Surprised: 75, Natural: 220, Fear: 18 },
        'Tech Summit': { Happy: 130, Sad: 80, Disgusted: 40, Surprised: 85, Natural: 290, Fear: 16 },
      },
      {
        month: 'Sep',
        'KFUPM Expo': { Happy: 120, Sad: 60, Disgusted: 30, Surprised: 90, Natural: 300, Fear: 1 },
        'Innovation Expo': { Happy: 140, Sad: 50, Disgusted: 25, Surprised: 80, Natural: 250, Fear: 20 },
        'Riyadh Boulevard': { Happy: 110, Sad: 70, Disgusted: 35, Surprised: 75, Natural: 220, Fear: 18 },
        'Tech Summit': { Happy: 130, Sad: 80, Disgusted: 40, Surprised: 85, Natural: 290, Fear: 16 },
      },
      {
        month: 'Oct',
        'KFUPM Expo': { Happy: 120, Sad: 60, Disgusted: 30, Surprised: 90, Natural: 110, Fear: 1 },
        'Innovation Expo': { Happy: 140, Sad: 50, Disgusted: 25, Surprised: 80, Natural: 210, Fear: 20 },
        'Riyadh Boulevard': { Happy: 110, Sad: 70, Disgusted: 35, Surprised: 75, Natural: 55, Fear: 18 },
        'Tech Summit': { Happy: 130, Sad: 80, Disgusted: 40, Surprised: 85, Natural: 290, Fear: 16 },
      },
      {
        month: 'Nov',
        'KFUPM Expo': { Happy: 10, Sad: 60, Disgusted: 45, Surprised: 70, Natural: 30, Fear: 1 },
        'Innovation Expo': { Happy: 190, Sad: 10, Disgusted: 35, Surprised: 40, Natural: 20, Fear: 200 },
        'Riyadh Boulevard': { Happy: 220, Sad: 33, Disgusted: 55, Surprised: 98, Natural: 111, Fear: 13 },
        'Tech Summit': { Happy: 130, Sad: 80, Disgusted: 40, Surprised: 85, Natural: 20, Fear: 16 },
      },
      {
        month: 'Dec',
        'KFUPM Expo': { Happy: 120, Sad: 60, Disgusted: 30, Surprised: 44, Natural: 300, Fear: 1 },
        'Innovation Expo': { Happy: 140, Sad: 50, Disgusted: 25, Surprised: 44, Natural: 250, Fear: 20 },
        'Riyadh Boulevard': { Happy: 110, Sad: 70, Disgusted: 35, Surprised: 45, Natural: 220, Fear: 18 },
        'Tech Summit': { Happy: 130, Sad: 80, Disgusted: 40, Surprised: 45, Natural: 490, Fear: 16 },
      },
      
    // Repeat the above structure for each month, with updated counts
    // ...
  ];

  export default completeEventData;