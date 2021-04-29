const formatDateAndTime = (date) => {
  const time = date.split('T')[1]
  const splitDate = date.split('T')[0].split('-')
  const formattedDate = `${splitDate[2]}/${splitDate[1]}/${splitDate[0]}`
  console.log('formatting date and timeeeee');
  console.log({time, formattedDate});
  
  return {time, date: formattedDate}
}

module.exports = {formatDateAndTime};