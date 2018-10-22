var vanillaCalendar={month:document.querySelectorAll('[data-calendar-area="month"]')[0],next:document.querySelectorAll('[data-calendar-toggle="next"]')[0],previous:document.querySelectorAll('[data-calendar-toggle="previous"]')[0],label:document.querySelectorAll('[data-calendar-label="month"]')[0],activeDates:null,selectedDate:null,selectedStartDate:null,selectedEndDate:null,options:{isMultiSelect:!1,disablePastDays:!1,disableSelect:!1,disableSelectSchedule:!0,onSelectedSchedule:null},date:new Date,todaysDate:new Date,schedule:{},selectedSchedule:null,init:function(e,t,a){if(e)for(var s=Object.keys(e),d=0;d<s.length;d++)this.options[s[d]]=e[s[d]];var l=t?t-1:this.date.getDate();this.date.setDate(1),this.date.setMonth(l),this.createMonth(),this.createListeners()},createListeners:function(){var e=this;this.next&&this.next.addEventListener("click",function(){e.clearCalendar();var t=e.date.getMonth()+1;e.date.setMonth(t),e.createMonth()}),this.previous&&this.previous.addEventListener("click",function(){e.clearCalendar();var t=e.date.getMonth()-1;e.date.setMonth(t),e.createMonth()})},createDay:function(e,t,a){var s=document.createElement("div"),d=document.createElement("span");d.innerHTML=e,d.classList.add("vcal-data-num"),s.className="vcal-date";var l=this.date.getFullYear().toString(),c=this.leftZero((this.date.getMonth()+1).toString()),i=this.leftZero(this.date.getDate().toString());s.setAttribute("data-calendar-date",l+c+i),1===e&&(0===t?this.makeEmptyDay(6):this.makeEmptyDay(t-1)),this.options.disablePastDays&&this.date.getTime()<=this.todaysDate.getTime()-1?s.classList.add("vcal-date--disabled"):(s.classList.add("vcal-date--active"),s.setAttribute("data-calendar-status","active")),this.date.toString()===this.todaysDate.toString()&&s.classList.add("vcal-date--today"),s.appendChild(d),this.month.appendChild(s)},makeEmptyDay:function(e){for(var t=0;t<e;t++){var a=document.createElement("div"),s=document.createElement("span");s.classList.add("vcal-data-num"),a.className="vcal-date",a.classList.add("vcal-date--disabled"),a.appendChild(s),this.month.appendChild(a)}},dateClicked:function(){var e=this;this.activeDates=document.querySelectorAll('[data-calendar-status="active"]');for(var t=0;t<this.activeDates.length;t++)this.options.disableSelect||this.activeDates[t].addEventListener("click",function(t){e.setValue(this.dataset.calendarDate)})},setValue:function(e){var t=document.querySelectorAll('[data-calendar-label="picked"]')[0];if(this.removeActiveClass(),this.options.isMultiSelect){null==this.selectedStartDate?this.selectedStartDate=e:this.selectedStartDate&&this.selectedEndDate?(this.selectedStartDate=e,this.selectedEndDate=null):e<this.selectedStartDate?(this.selectedEndDate=this.selectedStartDate,this.selectedStartDate=e):e>this.selectedStartDate&&(this.selectedEndDate=e);var a=this.selectedStartDate?this.selectedStartDate:"",s=this.selectedEndDate?this.selectedEndDate:"",d=a.substring(a.length-2,a.length),l=s.substring(s.length-2,s.length);if(this.selectedEndDate)for(var c=d;c<=l;c++){var i=leftZero(c),n=a.substring(0,a.length-2)+i;document.querySelectorAll('[data-calendar-date="'+n+'"]')[0].classList.add("vcal-date--selected")}else document.querySelectorAll('[data-calendar-date="'+a+'"]')[0].classList.add("vcal-date--selected");t.innerHTML=a+" - "+s}else{document.querySelectorAll('[data-calendar-date="'+e+'"]')[0].classList.add("vcal-date--selected");t=document.querySelectorAll('[data-calendar-label="picked"]')[0];this.selectedDate=e,t.innerHTML=this.selectedDate}},createMonth:function(){for(var e=this.date.getMonth();this.date.getMonth()===e;)this.createDay(this.date.getDate(),this.date.getDay(),this.date.getFullYear()),this.date.setDate(this.date.getDate()+1);this.date.setDate(this.date.getDate()-1),this.makeEmptyDay(7-this.date.getDay()),this.date.setDate(1),this.label.innerHTML=this.date.getFullYear()+"-"+this.monthsAsString(this.date.getMonth()),this.dateClicked()},makeschedule:function(e){this.removeSchedule();var t=this;e&&(this.schedule=e);var a=Object.keys(this.schedule);for(i=0;i<a.length;i++){var s=this.schedule[a[i]].fromdate,d=this.schedule[a[i]].todate,l=this.schedule[a[i]].text;l=l||"";var c=s.substring(s.length-2,s.length),n=d.substring(d.length-2,d.length);this.date.setDate(c);var r=this.date.getDay();this.date.setDate(n);var h=this.date.getDay();r=0==r?7:r,h=0==h?7:h;var o=document.createElement("div"),u=document.createElement("span");u.classList.add("vcal-schedule-text"),u.innerHTML=l,o.classList.add("vcal-schedule-wrapper-left-edge");var v=document.createElement("div");if(o.appendChild(v),v.setAttribute("data-calendar-schedule-from",s),v.setAttribute("data-calendar-schedule-to",d),v.setAttribute("data-calendar-schedule-key",a[i]),v.classList.add("vcal-schedule"),v.classList.add("vcal-left-radius"),v.appendChild(u),r<h&&n-c<=7){v.classList.add("vcal-right-radius"),o.style.width=100*(h-r+1)+"%",o.classList.add("vcal-schedule-wrapper"),o.classList.add("vcal-schedule-wrapper-right-edge"),(y=document.querySelectorAll('[data-calendar-date="'+s+'"]')[0]).appendChild(o),this.options.disableSelectSchedule||v.addEventListener("click",function(e){t.scheduleSelected(this.dataset.calendarScheduleKey)})}else{o.style.width=100*(7-r+1)+"%",o.classList.add("vcal-schedule-wrapper-right");var g=n-c-(7-r+1),m=n-g;this.date.setDate(m);var S=this.getYYYYMMDD(this.date);this.date.setDate(m-1);var D=this.getYYYYMMDD(this.date),p=document.createElement("div");p.classList.add("vcal-schedule-wrapper"),p.classList.add("vcal-schedule-wrapper-next-right-edge");var f=document.createElement("div");p.appendChild(f),p.style.width=100*(g+1)+"%",f.setAttribute("data-calendar-from",s),f.setAttribute("data-calendar-schedule-to",d),f.setAttribute("data-calendar-schedule-key",a[i]),g<2&&(f.appendChild(u),v.innerHTML="");var y=document.querySelectorAll('[data-calendar-date="'+D+'"]')[0],L=document.querySelectorAll('[data-calendar-date="'+S+'"]')[0];f.classList.add("vcal-schedule"),f.classList.add("vcal-right-radius"),y.appendChild(o),L.appendChild(p),this.options.disableSelectSchedule||(v.addEventListener("click",function(e){t.scheduleSelected(this.dataset.calendarScheduleKey)}),f.addEventListener("click",function(e){t.scheduleSelected(this.dataset.calendarScheduleKey)}))}}},removeSchedule:function(){var e=document.querySelectorAll('[class="vcal-schedule-wrapper"]'),t=document.querySelectorAll('[class="vcal-schedule-wrapper-right"]');if(e)for(var a=0;a<e.length;a++)e[a].remove();if(t)for(a=0;a<t.length;a++)t[a].remove()},scheduleSelected:function(e){this.removeScheduleSelected();var t=this.schedule[e];t.key=e;for(var a=document.querySelectorAll('[data-calendar-schedule-key="'+e+'"]'),s=0;s<a.length;s++)a[s].classList.add("vcal-schedule--selected");this.options.onSelectedSchedule&&this.options.onSelectedSchedule(t)},removeScheduleSelected:function(){for(var e=document.querySelectorAll(".vcal-schedule"),t=0;t<e.length;t++)e[t].classList.remove("vcal-schedule--selected")},leftZero:function(e){return e<10?"0"+e:e},getYYYYMMDD:function(e){return this.date.getFullYear().toString()+this.leftZero((this.date.getMonth()+1).toString())+this.leftZero(this.date.getDate().toString())},monthsAsString:function(e){return[1,2,3,4,5,6,7,8,9,10,11,12][e]},clearCalendar:function(){vanillaCalendar.month.innerHTML=""},removeActiveClass:function(){for(var e=0;e<this.activeDates.length;e++)this.activeDates[e].classList.remove("vcal-date--selected")}};