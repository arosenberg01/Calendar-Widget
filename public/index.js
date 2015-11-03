

function Calendar(events) {
  var wrap;
  var label;
  var months = ['January', 'February', 'March', 'April', 'May', 'June', 'July',
  'August', 'September', 'October', 'November', 'December'];

  function init(newWrap) {
    wrap = $(newWrap || '#cal');
    label = wrap.find('#label');
    wrap.find('#prev').bind('click.calendar', function() {
      switchMonth(false);
    });
    wrap.find('#next').bind('click.calendar', function() {
      switchMonth(true);
    });
    label.bind('click', function() {
      switchMonth(null, new Date().getMonth(), new Date().getFullYear());
    })

  }

  function switchMonth(next, month, year) {
    var curr = label.text().trim().split(' ');
    var calendar;
    var tempYear =  parseInt(curr[1], 10);

    if (!month) {
      if (next) {
        curr[0] === 'December' ? month = 0 : month = months.indexOf(curr[0]) + 1;
      } else {
        curr[0] === 'January' ? month = 11 : month = months.indexOf(curr[0]) - 1;
      }
    }
    if (!year) {
      if (next && month === 0) {
        year = tempYear + 1
      } else if (!next && month === 11) {
        year = tempYear - 1;
      } else {
        year = tempYear;
      }
    }

    calendar =  createCalendar(year, month);

    var theCal = calendar.calendar();

    $('#cal-frame', wrap)
        .find('.curr')
        .removeClass('curr')
        .addClass('temp')
        .end()
        .prepend(theCal)
        .find('.temp')
        .fadeOut('fast', function () { $(this).remove(); });
        // $(this).remove();
    $('#label').text(calendar.label);
  }

  function createCalendar(year, month) {
    var day = 1
    var i;
    var j;
    var haveDays = true;
    var startDay = new Date(year, month, day).getDay();
    var isFebLeap = (((year % 4 === 0) && (year % 100 !== 0)) || (year % 400 === 0));
    var febDays = isFebLeap ? 29 : 28;
    var daysInMonths = [31, febDays, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31];
    var calendar = [];

    if (createCalendar.cache[year] && createCalendar.cache[year][month]) {
      return createCalendar.cache[year][month];
    } else {
      createCalendar.cache[year] = {};
    }

    i = 0;
    while (haveDays) {
      calendar[i] = [];
      for (j = 0; j < 7; j++) {
        if (i === 0) {
          if (j === startDay) {
            calendar[i][j] = day++;
            startDay++;
          }
        } else if (day <= daysInMonths[month]) {
          calendar[i][j] = day++;
        } else {
          calendar[i][j] = '';
          haveDays = false;
        }

        if (day > daysInMonths[month]) {
          haveDays = false;
        }
      }
      i++;
    }

    if (calendar[5]) {
      for (i = 0; i < calendar[5].length; i++) {
        if (calendar[5][i] !== '') {
          calendar[4][i] = '<span>' + calendar[4][i] + '</span><span>' + calendar[5][i] + '</span>';
        }
      }
      calendar = calendar.slice(0, 5);
    }

    calendar = calendar.map(function(week) {
      return '<tr><td>' + week.join('</td><td>') + '</td></tr>';
    });

    calendar = $('<table>' + calendar.join('') + '</table>').addClass('curr');

    $('td:empty', calendar).addClass('nil');

    if (month === new Date().getMonth()) {
      $('td', calendar).filter(function () {
        return $(this).text() === new Date().getDate().toString();
      }).addClass('today');
    }

    createCalendar.cache[year][month] = {
      calendar: function () {
        return calendar.clone()
      },
      label: months[month] + ' ' + year,
      events: []
    };

    return createCalendar.cache[year][month];
  }

  createCalendar.cache = {};

  return {
    init: init,
    switchMonth: switchMonth,
    createCalendar: createCalendar
  }
}
//
// $('#cal #cal-frame').on('click', 'td', function() {
//   console.log('day clicked');
// })
