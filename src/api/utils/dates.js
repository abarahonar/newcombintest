function is_valid_date(date) {
  if (!/^\d\d\/\d\d\/\d\d\d\d$/.test(date)) {
    return false;
  }
  const [mm, dd, yyyy] = date.split('/').map((p) => parseInt(p, 10));
  const d = new Date(yyyy, mm - 1, dd);
  return d.getMonth() === mm -1 && d.getDate() === dd && d.getFullYear() === yyyy;
}

module.exports = is_valid_date;
