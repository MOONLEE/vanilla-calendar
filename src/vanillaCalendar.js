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
    disablePastDays: false,
    disableSelect: false,
    disableSelectSchedule: true,
    onSelectedSchedule: null 
  },
  date: new Date(),
  todaysDate: new Date(),
  schedule: {}, 
  selectedSchedule : null,
  

  init: function (options, month, day) {

    if (options) {
      var __keys = Object.keys(options)
      for (var __i = 0; __i < __keys.length; __i++) {
        this.options[__keys[__i]] = options[__keys[__i]];
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
        this.makeEmptyDay(6, -1);

        // newDay.style.marginLeft = (6 * 14.28) + '%' 
      } else {
        // newDay.style.marginLeft = ((day - 1) * 14.28) + '%'
        this.makeEmptyDay(day-1, -1);
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
    newDay.appendChild(dateEl)
    this.month.appendChild(newDay)
    
  },


  makeEmptyDay: function (day, type) {
   
    if (type == -1) {
      this.date.setDate(this.date.getDate() - day );
    } else {
      this.date.setDate(this.date.getDate() + 1);
    }
    for (var i = 0; i < day; i++) {


        var newDay = document.createElement('div')
        var dateEl = document.createElement('span')
        var _strYear = this.date.getFullYear().toString();
        var _strMonth = this.leftZero((this.date.getMonth() + 1).toString());
        var _strDate =  this.leftZero(this.date.getDate().toString());
        newDay.setAttribute('data-calendar-date', _strYear + _strMonth + _strDate)
      dateEl.classList.add('vcal-data-num');
      newDay.className = 'vcal-date'
      newDay.classList.add('vcal-date')
      newDay.appendChild(dateEl)
      this.month.appendChild(newDay)
      
        this.date.setDate(this.date.getDate() + 1);
  
    }
  },

  dateClicked: function () {
    
    var _this = this
    this.activeDates = document.querySelectorAll(
      '[data-calendar-status="active"]'
    );

    for (var i = 0; i < this.activeDates.length; i++) {
      if (!this.options.disableSelect) {
          this.activeDates[i].addEventListener('click', function (event) {
          _this.setValue(this.dataset.calendarDate);
        });
      }
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
       
          var ___day = leftZero(__i);//__i < 10 ? '0' + parseInt(__i) : __i;
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
      this.date.setDate(this.date.getDate() + 1);
    }

    this.date.setDate(this.date.getDate() - 1);
    this.makeEmptyDay(7 - this.date.getDay(), 1);
    
    // while loop trips over and day is at 30/31, bring it back
    this.date.setDate(1);
    this.date.setMonth(this.date.getMonth() - 1)


    this.label.innerHTML = this.date.getFullYear() + '년 ' + this.monthsAsString(this.date.getMonth());
    this.dateClicked();
  },


  makeschedule: function(obj) {

    this.removeSchedule();

    var _this = this;

    if (obj) {
      this.schedule = obj;
    }

    var _keyList = Object.keys(this.schedule);

    for (var i = 0; i < _keyList.length; i++) {
      this.schedule.key = _keyList[i];
      var __fromdate = this.schedule[_keyList[i]].fromdate;
      var __todate = this.schedule[_keyList[i]].todate;
      var __text = this.schedule[_keyList[i]].text;
      var __style = this.schedule[_keyList[i]].style;
      __text = __text ? __text : '';


      var __fdate = __fromdate.substring(__fromdate.length-2, __fromdate.length);
      var __tdate = __todate.substring(__todate.length-2, __todate.length);

      
      var __fmonth = __fromdate.substring(__fromdate.length-4, __fromdate.length-2);
      var __tmonth = __todate.substring(__todate.length-4, __todate.length-2);


      this.date.setDate(__fdate);
      this.date.setMonth(parseInt(__fmonth)-1);
      var __fday = this.date.getDay();
      this.date.setDate(__tdate);
      this.date.setMonth(parseInt(__tmonth)-1);
      var __tday = this.date.getDay();

      __fday = __fday == 0 ? 7 : __fday;
      __tday = __tday == 0 ? 7 : __tday;

      var __newScheduleWrapper = document.createElement('div');

      __newScheduleWrapper.classList.add('vcal-schedule-wrapper-left-edge');
      

      var __newSchedule = document.createElement('div');
      __newSchedule.innerHTML = __text;
      __newScheduleWrapper.appendChild(__newSchedule);
      

      __newSchedule.setAttribute('data-calendar-schedule-from', __fromdate);
      __newSchedule.setAttribute('data-calendar-schedule-to', __todate);
      __newSchedule.setAttribute('data-calendar-schedule-key', _keyList[i]);

      __newSchedule.classList.add('vcal-schedule');
      __newSchedule.classList.add('vcal-left-radius');

      if (  (__fday < __tday && __fmonth == __tmonth && (parseInt(__tdate) - parseInt(__fdate) <= 7 ) )
      || (parseInt(__fmonth)  < parseInt(__tmonth) && parseInt(__fdate) > parseInt(__tdate) )) {

        __newSchedule.classList.add('vcal-right-radius');


        __newScheduleWrapper.style.width = (100 * (Math.abs(__tday - __fday) + 1)) + '%';
        __newScheduleWrapper.classList.add('vcal-schedule-wrapper')
        __newScheduleWrapper.classList.add('vcal-schedule-wrapper-right-edge')
      
        var __el = document.querySelectorAll(
          '[data-calendar-date="' + __fromdate + '"]'
        )[0];
        __el.appendChild(__newScheduleWrapper);

        
        if (!this.options.disableSelectSchedule) {
          
          __newSchedule.addEventListener('click', function (event) {
            
            _this.scheduleSelected(this.dataset.calendarScheduleKey);
          });
        }

          
        
        if (__style) {
          __newSchedule.classList.add(__style);
        }
        
      } else {
        __newScheduleWrapper.style.width = (100 * (7 - __fday + 1)) + '%';
        __newScheduleWrapper.classList.add('vcal-schedule-wrapper-right')

        var ___diff = ((__tdate - __fdate) - (7 - __fday + 1));
        var ___nextRowScheduleDate = __tdate - ___diff ;

        this.date.setDate(___nextRowScheduleDate);
        var ___nextRowStartDate = this.getYYYYMMDD(this.date)
        
        this.date.setDate(___nextRowScheduleDate -1);
        var ___newRowStartDate = this.getYYYYMMDD(this.date)

        var __nextScheduleWrapper = document.createElement('div');
        __nextScheduleWrapper.classList.add('vcal-schedule-wrapper');
        __nextScheduleWrapper.classList.add('vcal-schedule-wrapper-next-right-edge');
        
        var __nextSchedule = document.createElement('div');
        __nextScheduleWrapper.appendChild(__nextSchedule);
        __nextScheduleWrapper.style.width = 100 * (___diff + 1) + '%';

        __nextSchedule.setAttribute('data-calendar-from', __fromdate);
        __nextSchedule.setAttribute('data-calendar-schedule-to', __todate);
        __nextSchedule.setAttribute('data-calendar-schedule-key', _keyList[i]);

        if (___diff < 2 ) {
          __nextSchedule.innerHTML = __text
          __newSchedule.innerHTML = '';
        }

        var __el = document.querySelectorAll(
          '[data-calendar-date="' + ___newRowStartDate + '"]'
        )[0];
  
        
        var ___nextEl = document.querySelectorAll(
          '[data-calendar-date="' + ___nextRowStartDate + '"]'
        )[0];

        __nextSchedule.classList.add('vcal-schedule');
        __nextSchedule.classList.add('vcal-right-radius');

        __el.appendChild(__newScheduleWrapper);
        ___nextEl.appendChild(__nextScheduleWrapper);

        if (!this.options.disableSelectSchedule) {
          
          __newSchedule.addEventListener('click', function (event) {
            _this.scheduleSelected(this.dataset.calendarScheduleKey);
          });

          __nextSchedule.addEventListener('click', function (event) {
            _this.scheduleSelected(this.dataset.calendarScheduleKey);
          });
        }
        
        if (__style) {
          __newSchedule.classList.add(__style);
          __nextSchedule.classList.add(__style);
        }

      }
    }
  },

  
  removeSchedule: function () {
    var __elList = document.querySelectorAll(
      '.vcal-schedule-wrapper'
    );

    console.log(__elList);

    var __rightList = document.querySelectorAll(
      '.vcal-schedule-wrapper-right'
    );
    console.log(__rightList);

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


  scheduleSelected : function (key) {


    
    var _scheduleData = this.schedule[key];

    _scheduleData['key'] = key;
    
    this.removeScheduleSelected();

    var _scheduleArr = document.querySelectorAll( 
      '[data-calendar-schedule-key="' + key + '"]'
    );

    for (var i = 0; i < _scheduleArr.length; i++) {
      _scheduleArr[i].classList.add('vcal-schedule--selected');
    }

    if (this.options.onSelectedSchedule) {
      this.options.onSelectedSchedule(_scheduleData);
    }
  },


  removeScheduleSelected : function () {

    var _scheduleArr = document.querySelectorAll('.vcal-schedule');

    for (var i = 0; i < _scheduleArr.length; i++) {
      _scheduleArr[i].classList.remove('vcal-schedule--selected');
    }

  },

  updateScheduleText : function (obj) {
    var _keyArr = Object.keys(obj);

    for (var i = 0 ; i < _keyArr.length; i++) {
      var __key = _keyArr[i];
      this.schedule[__key].text = obj[__key].text;
      this.schedule[__key].style = obj[__key].style;
      

      var _scheduleArr = document.querySelectorAll( 
        '[data-calendar-schedule-key="' + __key + '"]'
      );

      for (var j = 0; j < _scheduleArr.length; j++) {
        if (_scheduleArr[j].innerHTML != '') {
          _scheduleArr[j].innerHTML = this.schedule[__key].text;
        }

        
        if (this.schedule[__key].style) {

          _scheduleArr[j].classList.remove('end');
          _scheduleArr[j].classList.remove('free')
          _scheduleArr[j].classList.remove('busy')
          _scheduleArr[j].classList.add(this.schedule[__key].style);
        }
        
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
      , '2월'
      , '3월'
      , '4월'
      , '5월'
      , '6월'
      , '7월'
      , '8월'
      , '9월'
      , '10월'
      , '11월'
      , '12월'
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