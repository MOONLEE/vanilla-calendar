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
    var subMark = document.createElement('div')
    dateEl.innerHTML = num
    newDay.className = 'vcal-date'
    var _strYear = this.date.getFullYear().toString();
    var _strMonth =  (this.date.getMonth() + 1) < 10 ?  '0'+ (this.date.getMonth() + 1).toString() : (this.date.getMonth() + 1).toString()
    var _strDate =  this.date.getDate() < 10 ?  '0'+ this.date.getDate().toString() : this.date.getDate().toString()
    newDay.setAttribute('data-calendar-date', _strYear + _strMonth + _strDate)

    // if it's the first day of the month
    if (num === 1) {
      if (day === 0) {
        newDay.style.marginLeft = (6 * 14.28) + '%' 
      } else {
        newDay.style.marginLeft = ((day - 1) * 14.28) + '%'
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
    subMark.classList.add('sub-mark');
    newDay.appendChild(dateEl)
    newDay.appendChild(subMark);
    this.month.appendChild(newDay)
    
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
    // while loop trips over and day is at 30/31, bring it back
    this.date.setDate(1)
    this.date.setMonth(this.date.getMonth() - 1)

    this.label.innerHTML =
    this.monthsAsString(this.date.getMonth()) + ' ' + this.date.getFullYear()
    this.dateClicked()
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