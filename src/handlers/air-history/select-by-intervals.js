export const selectByIntervals = (raw_history, every) => {
   const calcInterval = (every) => {
      const daysInMonth = 31; // todo
      const hoursInDay = 24;
      const minutesInHour = 60;
      const secondsInMinute = 60;
      const millisecondsInSecond = 1000;

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

      const sum = (arr) => arr.reduce((acc, num) => acc + num, 0);
      const interval = sum(intervalElements);
      return interval;
   };

   const selectRows = (raw_history, originalInterval) => {
      let selectedRows = [];
      selectedRows.push(raw_history[0]);

      let beginRow = raw_history[0];
      let beginDate = new Date(beginRow.timestamp);
      let beginTime = beginDate.getTime();

      for (let i = 1; i < raw_history.length - 2; i++) {
         const currentRow = raw_history[i];
         const currentDate = new Date(currentRow.timestamp);
         const currentTime = currentDate.getTime();
         const prevInterval = currentTime - beginTime;

         const nextRow = raw_history[i + 1];
         const nextDate = new Date(nextRow.timestamp);
         const nextTime = nextDate.getTime();
         const nextInterval = nextTime - beginTime;

         if (
            prevInterval < originalInterval &&
            nextInterval > originalInterval
         ) {
            const prevTimeDiff = originalInterval - prevInterval;
            const nextTimeDiff = nextInterval - originalInterval;
            let resultRow = {};

            if (prevTimeDiff < nextTimeDiff) {
               resultRow = currentRow;
            } else {
               resultRow = nextRow;
            }

            selectedRows.push(resultRow);
            beginRow = resultRow;
            beginDate = new Date(beginRow.timestamp);
            beginTime = beginDate.getTime();
         }
      }

      return selectedRows;
   };

   const interval = calcInterval(every);
   const history = selectRows(raw_history, interval);
   return history;
};
