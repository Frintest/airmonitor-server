const daysInMonth = 30;
const hoursInDay = 24;
const minutesInHour = 60;
const secondsInMinute = 60;
const millisecondsInSecond = 1000;

const sumNumbers = (arr) => arr.reduce((acc, num) => acc + num, 0);

export const computeInterval = (every) => {
   let intervalElements = Object.values(every).map((item) => {
      if (item.value) {
         switch (item.name) {
            case "month":
               return (
                  item.value *
                  daysInMonth *
                  hoursInDay *
                  minutesInHour *
                  secondsInMinute *
                  millisecondsInSecond
               );

            case "days":
               return (
                  item.value *
                  hoursInDay *
                  minutesInHour *
                  secondsInMinute *
                  millisecondsInSecond
               );

            case "hours":
               return (
                  item.value *
                  minutesInHour *
                  secondsInMinute *
                  millisecondsInSecond
               );

            case "minutes":
               return item.value * secondsInMinute * millisecondsInSecond;
         }
      }
      return 0;
   });

   const interval = sumNumbers(intervalElements);
   return interval;
};
