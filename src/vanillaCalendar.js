var vanillaCalendar = {
  month: document.querySelectorAll('[data-calendar-area="month"]')[0],
  next: document.querySelectorAll('[data-calendar-toggle="next"]')[0],
  previous: document.querySelectorAll('[data-calendar-toggle="previous"]')[0],
  label: document.querySelectorAll('[data-calendar-label="month"]')[0],
  activeDates: null,
  selectedDate: null,
  selectedStartDate: null,
  selectedEndDate: null,
  options: {
    isMultiSelect: false,
    disablePastDays: false
  },
  date: new Date(),
  todaysDate: new Date(),
  schedule: {},
  

  init: function (options, month, day) {

    if (options) {
      var __keys = Object.keys(options)
      for (var __i = 0; __i < __keys.length; __i++) {
        this.options[__keys] = options[__keys];
      }
    }
    var _days = day ? day : 1; 
    var _month = month ? month - 1: this.date.getDate();
    this.date.setDate(1)
    this.date.setMonth(_month);
    this.createMonth()
    this.createListeners()
  },

  createListeners: function () {
    var _this = this
    if (this.next) {
      this.next.addEventListener('click', function () {
        _this.clearCalendar()
        var nextMonth = _this.date.getMonth() + 1
        _this.date.setMonth(nextMonth)
        _this.createMonth()
      })
    }
    // Clears the calendar and shows the previous month
    if (this.previous) {
      this.previous.addEventListener('click', function () {
        _this.clearCalendar()
        var prevMonth = _this.date.getMonth() - 1
        _this.date.setMonth(prevMonth)
        _this.createMonth()
      })
    }
  },

  createDay: function (num, day, year) {
    var newDay = document.createElement('div')
    var dateEl = document.createElement('span')
    

    // var subMark = document.createElement('div')
    dateEl.innerHTML = num
    dateEl.classList.add('vcal-data-num');
    newDay.className = 'vcal-date'
    var _strYear = this.date.getFullYear().toString();
    var _strMonth = this.leftZero((this.date.getMonth() + 1).toString());
    var _strDate =  this.leftZero(this.date.getDate().toString());
    newDay.setAttribute('data-calendar-date', _strYear + _strMonth + _strDate)

    // if it's the first day of the month 
    if (num === 1) {
      if (day === 0) {
        this.makeEmptyDay(6);

        // newDay.style.marginLeft = (6 * 14.28) + '%' 
      } else {
        // newDay.style.marginLeft = ((day - 1) * 14.28) + '%'
        this.makeEmptyDay(day-1);
      }
    }

    if (this.options.disablePastDays && this.date.getTime() <= this.todaysDate.getTime() - 1) {
      newDay.classList.add('vcal-date--disabled')
    } else {
      newDay.classList.add('vcal-date--active')
      newDay.setAttribute('data-calendar-status', 'active')
    }

    if (this.date.toString() === this.todaysDate.toString()) {
      newDay.classList.add('vcal-date--today')
    }
    // subMark.classList.add('sub-mark');
    newDay.appendChild(dateEl)
    // newDay.appendChild(subMark);
    this.month.appendChild(newDay)
    
  },


  makeEmptyDay: function (day) {

    for (var i = 0; i < day; i++) {
      //console.log('makeEmptyDay' + i)
      var newDay = document.createElement('div')
      var dateEl = document.createElement('span')
      dateEl.classList.add('vcal-data-num');
      newDay.className = 'vcal-date'
      // var _strYear = this.date.getFullYear().toString();
      // var _strMonth =  (this.date.getMonth() + 1) < 10 ?  '0'+ (this.date.getMonth() + 1).toString() : (this.date.getMonth() + 1).toString()
      // var _strDate =  this.date.getDate() < 10 ?  '0'+ this.date.getDate().toString() : this.date.getDate().toString()
      // newDay.setAttribute('data-calendar-date', _strYear + _strMonth + _strDate)
      newDay.classList.add('vcal-date--disabled')
      // subMark.classList.add('sub-mark');
      newDay.appendChild(dateEl)
      // newDay.appendChild(subMark);
      this.month.appendChild(newDay)
  
    }

  },

  dateClicked: function () {
    
    var _this = this
    this.activeDates = document.querySelectorAll(
      '[data-calendar-status="active"]'
    )
    for (var i = 0; i < this.activeDates.length; i++) {
      this.activeDates[i].addEventListener('click', function (event) {
        _this.setValue(this.dataset.calendarDate);
      })
    }
  },

  setValue: function(dateValue) {

    var picked = document.querySelectorAll(
      '[data-calendar-label="picked"]'
    )[0]

    this.removeActiveClass();

    if (this.options.isMultiSelect) {

      if (this.selectedStartDate == null) {
        this.selectedStartDate = dateValue;
        
      } else if (this.selectedStartDate && this.selectedEndDate) {
        this.selectedStartDate = dateValue;
        this.selectedEndDate = null;
      } else if (dateValue < this.selectedStartDate) {
        this.selectedEndDate = this.selectedStartDate;
        this.selectedStartDate = dateValue;
        
      } else if (dateValue > this.selectedStartDate) {
        this.selectedEndDate = dateValue;

      } 

      var __selectedStartDate = this.selectedStartDate ? this.selectedStartDate : '';
      var __selectEndDate = this.selectedEndDate ? this.selectedEndDate : ''

      var __startdays =  __selectedStartDate.substring(__selectedStartDate.length - 2, __selectedStartDate.length);
      var __enddays =  __selectEndDate.substring(__selectEndDate.length - 2, __selectEndDate.length);

      if (this.selectedEndDate) {
        for (var __i = __startdays; __i <= __enddays; __i++) {
       
          var ___day = __i < 10 ? '0' + parseInt(__i) : __i;
          var ___yyyymm = __selectedStartDate.substring(0, __selectedStartDate.length -2);
          var ___selecteDate = ___yyyymm  + ___day;
         

          var ___selectedEl = document.querySelectorAll(
            '[data-calendar-date="' + ___selecteDate + '"]'
          )[0]
  
          ___selectedEl.classList.add('vcal-date--selected');
        }
        
      } else {
       
        var __selectedEl = document.querySelectorAll(
          '[data-calendar-date="' + __selectedStartDate + '"]'
        )[0]

        __selectedEl.classList.add('vcal-date--selected');

      }

      picked.innerHTML = __selectedStartDate + ' - ' + __selectEndDate



    } else {
      
      var __selectedEl = document.querySelectorAll(
        '[data-calendar-date="' + dateValue + '"]'
      )[0]

      __selectedEl.classList.add('vcal-date--selected');

      var picked = document.querySelectorAll(
        '[data-calendar-label="picked"]'
      )[0]
  

      this.selectedDate = dateValue
      picked.innerHTML = this.selectedDate

    }
    
    
    
  },

  createMonth: function () {
    var currentMonth = this.date.getMonth()
    while (this.date.getMonth() === currentMonth) {
      this.createDay(
        this.date.getDate(),
        this.date.getDay(),
        this.date.getFullYear()
      )
      this.date.setDate(this.date.getDate() + 1)
    }

    this.date.setDate(this.date.getDate() - 1)
    this.makeEmptyDay(7 - this.date.getDay())
    
    // while loop trips over and day is at 30/31, bring it back
    this.date.setDate(1)
    // this.date.setMonth(this.date.getMonth() - 1)


    this.label.innerHTML =
    this.monthsAsString(this.date.getMonth()) + ' ' + this.date.getFullYear()
    this.dateClicked()
  },


  makeSchdule: function(obj) {

    this.removeSchedule();

    if (obj) {
      this.schedule = obj;
    }

    var _keyList = Object.keys(this.schedule);

    for (i = 0; i < _keyList.length; i++) {
      console.log(this.schedule[_keyList[i]]);
      var __fromdate = this.schedule[_keyList[i]].fromdate;
      var __todate = this.schedule[_keyList[i]].todate;
      var __text = this.schedule[_keyList[i]].text;
      __text = __text ? __text : '';


      var __fdate = __fromdate.substring(__fromdate.length-2, __fromdate.length);
      var __tdate = __todate.substring(__todate.length-2, __todate.length);
      

      this.date.setDate(__fdate);
      var __fday = this.date.getDay();
      this.date.setDate(__tdate);
      var __tday = this.date.getDay();

      __fday = __fday == 0 ? 7 : __fday;
      __tday = __tday == 0 ? 7 : __tday;

      var __newScheduleWrapper = document.createElement('div');
      __newScheduleWrapper.style.paddingLeft = '1.6rem';

      var __newSchedule = document.createElement('div');
      __newScheduleWrapper.appendChild(__newSchedule);
      

      __newSchedule.setAttribute('data-caldendar-schedule-from', __fromdate);
      __newSchedule.setAttribute('data-caldendar-schedule-to', __todate);
      __newSchedule.setAttribute('data-caldendar-schedule-grp', _keyList[i]);

      __newSchedule.classList.add('vcal-schdule');
      __newSchedule.classList.add('vcal-left-radius');
      __newSchedule.innerHTML = __text;
        


      if (__fday < __tday && (__tdate - __fdate) <= 7) {

        __newSchedule.classList.add('vcal-right-radius');


        __newScheduleWrapper.style.paddingRight = '1.6rem';
        __newScheduleWrapper.style.width = (100 * (__tday - __fday + 1)) + '%';
        __newScheduleWrapper.classList.add('vcal-schdule-wrapper')
      
        var __el = document.querySelectorAll(
          '[data-calendar-date="' + __fromdate + '"]'
        )[0];
        __el.appendChild(__newScheduleWrapper);

      } else {
        __newScheduleWrapper.style.width = (100 * (7 - __fday + 1)) + '%';
        __newScheduleWrapper.classList.add('vcal-schdule-wrapper-right')

        var ___diff = ((__tdate - __fdate) - (7 - __fday + 1));
        var ___nextRowScheduleDate = __tdate - ___diff ;

        this.date.setDate(___nextRowScheduleDate);
        var ___nextRowStartDate = this.getYYYYMMDD(this.date)
        
        this.date.setDate(___nextRowScheduleDate -1);
        var ___newRowStartDate = this.getYYYYMMDD(this.date)

        
        var __nextScheduleWrapper = document.createElement('div');
        __nextScheduleWrapper.classList.add('vcal-schdule-wrapper');
        
        var __nextSchedule = document.createElement('div');
        __nextScheduleWrapper.appendChild(__nextSchedule);
        __nextScheduleWrapper.style.paddingRight = '1.6rem';
        __nextScheduleWrapper.style.width = 100 * (___diff + 1) + '%';

        __nextSchedule.setAttribute('data-caldendar-from', __fromdate);
        __nextSchedule.setAttribute('data-caldendar-schedule-to', __todate);
        __nextSchedule.setAttribute('data-caldendar-schedule-grp', _keyList[i]);

        
        var __el = document.querySelectorAll(
          '[data-calendar-date="' + ___newRowStartDate + '"]'
        )[0];
  
        
        var ___nextEl = document.querySelectorAll(
          '[data-calendar-date="' + ___nextRowStartDate + '"]'
        )[0];

        __nextSchedule.classList.add('vcal-schdule');
        __nextSchedule.classList.add('vcal-right-radius');

        __el.appendChild(__newScheduleWrapper);
        ___nextEl.appendChild(__nextScheduleWrapper);

      }
    }
    
  }
  ,

  
  removeSchedule: function () {
    var __elList = document.querySelectorAll(
      '[class="vcal-schdule-wrapper"]'
    );

    var __rightList = document.querySelectorAll(
      '[class="vcal-schdule-wrapper-right"]'
    );

    if (__elList) {
      for (var i = 0; i < __elList.length; i++) {
        __elList[i].remove();
      }
    }

    if (__rightList) {
      for (var i = 0; i < __rightList.length; i++) {
        __rightList[i].remove();
      }
    }
    
  },

  leftZero: function (str) {
    return str < 10 ? "0" + str : str
  } ,

  getYYYYMMDD: function (obj) {
    return this.date.getFullYear().toString() + this.leftZero((this.date.getMonth() + 1).toString()) + this.leftZero(this.date.getDate().toString())
  },
  
  monthsAsString: function (monthIndex) {
    return [
       '1월'
      ,'2월'
      ,'3월'
      ,'4월'
      ,'5월'
      ,'6월'
      ,'7월'
      ,'8월'
      ,'9월'
      ,'10월'
      ,'11월'
      ,'12월'
    ][monthIndex]
  },

  clearCalendar: function () {
    vanillaCalendar.month.innerHTML = ''
  },

  removeActiveClass: function () {
    for (var i = 0; i < this.activeDates.length; i++) {
      this.activeDates[i].classList.remove('vcal-date--selected')
    }
  }
}