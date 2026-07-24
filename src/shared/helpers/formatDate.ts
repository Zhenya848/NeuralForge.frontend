export const formatDate = (value: Date | string | number) => {
  const date = new Date(value);

  const months = [
    'янв','фев','мар','апр','мая','июн',
    'июл','авг','сен','окт','ноя','дек'
  ];

  const d = date.getDate();
  const m = months[date.getMonth()];
  const y = date.getFullYear();

  const h = String(date.getHours()).padStart(2, '0');
  const min = String(date.getMinutes()).padStart(2, '0');

  return `${d} ${m} ${y}, ${h}:${min}`;
};