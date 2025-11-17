const formatNumber = (n) => {
  if (n === '' || n === null || n === undefined) return '';
  return Number(n).toLocaleString(undefined, {
    minimumFractionDigits: 4,
    maximumFractionDigits: 4,
  });
};

export default {
  formatNumber,
};
