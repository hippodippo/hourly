module.exports = {
    formatTime: function(time) {
      var time_1, time_2, amORpm;
      var index = time.indexOf(':');

      time_1 = time.split('').splice(0, index).join('');
      time_2 = time.split('').splice(index+1, time.length).join('');

      index = time_2.indexOf(' ');

      amORpm = time_2.split('').splice(index+1, time_2.length).join('');

      time_2 = time_2.split('').splice(0, index).join('');

      return [Number(time_1), Number(time_2), amORpm];
    },

    getTotalHours: function(start_time, end_time, lunch=false) {
      var total = 0;

      if (end_time[2] === 'am') {
        if (start_time[0] > end_time[0])
          total += (start_time[0] - end_time[0]);
        else if (end_time[0] > start_time[0])
          total += (end_time[0] - start_time[0]);
      }

      if (start_time[2] === 'pm') {
        if (start_time[0] > end_time[0])
          total += (start_time[0] - end_time[0]);
        else if (end_time[0] > start_time[0])
          total += (end_time[0] - start_time[0]);
      }

      if (end_time[2] !== 'am' && start_time[2] !== 'pm') {
        // Figure Hours.
        total += (12 - start_time[0]);
        total += end_time[0];
      }

      // Figure Minutes.
      if ((start_time[1] !== 0 || end_time[1] !== 0) && start_time[1] !== end_time[1]) {
        if (start_time[1] > end_time[1])
          total += ((start_time[1] - end_time[1]) * (1 / 60));
        else
          total += ((end_time[1] - start_time[1]) * (1 / 60));

        return lunch ? total - lunch : total;
      }

      return lunch ? total - lunch : total;
    },

    getTotalItemPrice(items) {
      var total = 0;

      for (var i = 0; i < items.length; i++) {
        total += Number(items[i].price);
      }

      return total;
    },
    // [{ item: '', price: '' }]
    createItemsString(items) {
      let itemsString = '';

      for (var i = 0; i < items.length; i++) {
        itemsString += `${items[i].item}: ${items[i].price}, `;
      }

      return itemsString;
    },

    addAllHours: function(hours) {
      let completedHours = [{ name: "Kaycee Ingram", hours: 0, items: 0 }, { name: "", hours: 0, items: 0 }, { name: "", hours: 0, items: 0 }];
      let finalHours = '';

      for (var h = 1; h <= 7; h++) {
        for (var i = 0; i < hours.length; i++) {
          if (hours[i].user_id === h) {
            completedHours[h-1].hours += Number(hours[i].total_hours);
            completedHours[h-1].items += Number(hours[i].total_items_price);
          }
        }
      }

      for (var j = 0; j < completedHours.length; j++) {
        finalHours += `${completedHours[j].name}: ${completedHours[j].hours} - ${completedHours[j].total_items_price}\n`;
      }

      return finalHours;
    },
}