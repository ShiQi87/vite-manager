export const getNowTime = () => {
  let hour = new Date().getHours();
  let msg = '';
  if (hour <= 10) {
    msg = '早上';
  } else if (hour <= 13) {
    msg = '中午';
  } else if (hour <= 18) {
    msg = '下午';
  } else {
    msg = '晚上';
  }

  return msg;
}