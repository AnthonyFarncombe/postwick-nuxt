export default () => ({
  authUser: null,
  hmiActive: false,
  connected: false,
  authenticated: false,
  variables: [],
  schedules: [],
  daysOfTheWeek: [
    'Sunday',
    'Monday',
    'Tuesday',
    'Wednesday',
    'Thursday',
    'Friday',
    'Saturday',
  ],
  meetingSizes: [
    {
      text: 'Maintenance (empty hall)',
      value: 1,
    },
    {
      text: 'Local (up to 50 people)',
      value: 2,
    },
    {
      text: 'City (up to 250 people)',
      value: 3,
    },
    {
      text: 'Interchange (up to 600 people)',
      value: 4,
    },
    {
      text: 'Full (max capacity)',
      value: 5,
    },
  ],
  frequencyOptions: [
    { value: '0', text: 'One Off' },
    { value: '1', text: 'Every Week' },
    { value: '2', text: 'Every Other Week' },
    { value: '3', text: 'Every Three Weeks' },
    { value: 'CM', text: 'Care Meeting' },
  ],
})
