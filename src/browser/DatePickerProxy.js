/*
  *
  * Licensed to the Apache Software Foundation (ASF) under one
  * or more contributor license agreements.  See the NOTICE file
  * distributed with this work for additional information
  * regarding copyright ownership.  The ASF licenses this file
  * to you under the Apache License, Version 2.0 (the
  * "License"); you may not use this file except in compliance
  * with the License.  You may obtain a copy of the License at
  *
  *   http://www.apache.org/licenses/LICENSE-2.0
  *
  * Unless required by applicable law or agreed to in writing,
  * software distributed under the License is distributed on an
  * "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY
  * KIND, either express or implied.  See the License for the
  * specific language governing permissions and limitations
  * under the License.
  *
 */

/*global Windows, WinJS*/

var cordova = require('cordova');

module.exports = {

  date: function (success, error, args) {

    module.exports.winJSDatePicker.show(success, error, 'date', args[0]);

  },

  time: function (success, error, args) {

    module.exports.winJSDatePicker.show(success, error, 'time', args[0]);

  },

  datetime: function (success, error, args) {

    module.exports.winJSDatePicker.show(success, error, 'datetime', args[0]);

  },

  winJSDatePicker: {

    show: function (success, error, pickertype, options) {
      /* options = {
      mode : 'date/time/datetime',
      date : selected date in format 'month/day/year/hours/minutes',
      minDate: 0 or DateObj,
      maxDate: 0 or DateObj,
      clearText: 'Clear'
      locale: 'en-us'
      }
      */

      if (options.date) {
        var dateParts = options.date.split('/');

        var month = dateParts[0] <= 9 ? '0' + dateParts[0] : dateParts[0],
          day = dateParts[1] <= 9 ? '0' + dateParts[1] : dateParts[1],
          hours = dateParts[3] <= 9 ? '0' + dateParts[3] : dateParts[3],
          minutes = dateParts[4] <= 9 ? '0' + dateParts[4] : dateParts[4];

        var dateTimeString = '' + dateParts[2] + '-' + month + '-' + day + 'T' + hours + ':' + minutes + ':00';

        options.date = new Date(dateTimeString);

      }
      else {
        options.date = new Date();
      }

      if (!options.minDate) {
        options.minDate = new Date('1970-01-01T00:00:00');
      }

      if (!options.maxDate) {
        options.maxDate = new Date('2050-01-01T00:00:00');
      }

      var resultDate = new Date(options.date);

      var locale = options.locale || 'en-us'; // 'en-us' | de-de

      var useButtonlabel = options.okText || 'Use';
      var cancelButtonLabel = options.cancelText || 'Cancel';
      var hoursLabel = options.hoursLabel || 'hours';
      var minutesLabel = options.minutesLabel || 'minutes';

      var calendarFirstDayOfWeek = options.firstDayOfWeek || 0; // sunday = 0; monday = 1; etc.

      var style = document.createElement('style');
      style.setAttribute('type', 'text/css');
      var css = options.cssRules || getDefaultStyle();
      style.innerText = css;



      // create Overlay
      var overlay = document.createElement('div');
      var overlay_id = 'winjsoverlay';
      overlay.className = 'overlayMain';
      overlay.id = overlay_id;
      overlay.appendChild(style);

      // create Overlay-footer with cancel and use buttons
      var overlayFooter = document.createElement('div');
      overlayFooter.className = 'overlayFooter';
      var leftCell = document.createElement('div');
      leftCell.className = 'footerLeftCell';
      overlayFooter.appendChild(leftCell);
      var rightCell = document.createElement('div');
      rightCell.className = 'footerRightCell';
      overlayFooter.appendChild(rightCell);
      var cancelButton = document.createElement('button');
      cancelButton.innerText = cancelButtonLabel;
      cancelButton.className = 'buttonStyle';
      cancelButton.addEventListener('click', function () {
        overlay.parentElement.removeChild(overlay);
      });
      rightCell.appendChild(cancelButton);
      var useButton = document.createElement('button');
      useButton.innerText = useButtonlabel;
      useButton.className = 'buttonStyle';
      useButton.addEventListener('click', function () {
        console.log('resultDate: ' + resultDate.toLocaleDateString());
        if (pickertype.indexOf('time') >= 0) {
          var hours = document.getElementById('winjsdatepickerHours').value;
          var minutes = document.getElementById('winjsdatepickerMinutes').value;
          setResultTime(hours, minutes);
        } else {
          setResultTime(0, 0);

        }
        console.log('resultDate: ' + resultDate.toLocaleDateString());
        var dateTimeStr = '';
        if (pickertype.indexOf('date') >= 0) {
          dateTimeStr = resultDate.getFullYear() + '-' + String(resultDate.getMonth() + 1).padStart(2, '0') + '-' + String(resultDate.getDate()).padStart(2, '0');
        }
        else {
          dateTimeStr = '1970-01-01';
        }
        if (pickertype.indexOf('time') >= 0) {
          dateTimeStr = dateTimeStr + 'T' + String(hours).padStart(2, '0') + ':' + String(minutes).padStart(2, '0') + ':00';
        }
        success(dateTimeStr);
        overlay.parentElement.removeChild(overlay);
      });
      leftCell.appendChild(useButton);
      overlay.appendChild(overlayFooter);

      var pickerDivTable = document.createElement('div');
      pickerDivTable.className = 'pickerDivTable';
      var pickerDiv = document.createElement('div');
      pickerDiv.id = 'winjsdatetimepickerContainer';
      pickerDiv.className = 'pickerDiv';
      pickerDivTable.appendChild(pickerDiv);
      overlay.appendChild(pickerDivTable);



      var calendarDiv = document.createElement('div');
      calendarDiv.className = 'calendarDiv';
      pickerDiv.appendChild(calendarDiv);



      if (pickertype.indexOf('date') >= 0) {
        drawCalendar(options.date.getFullYear(), options.date.getMonth(), 1, overlay);
      }

      if (pickertype.indexOf('time') >= 0) {
        drawTimePicker();
      }

      document.body.appendChild(overlay);

      function setResultDate(date) {
        resultDate.setFullYear(date.getFullYear());
        resultDate.setMonth(date.getMonth());
        resultDate.setDate(date.getDate());
      }

      function setResultTime(hours, minutes) {
        resultDate.setHours(hours);
        resultDate.setMinutes(minutes);
      }

      function daysInMonth(month, year) {
        console.log('month: ' + month);
        console.log('year: ' + year);
        var result = new Date(year, month, 0).getDate();
        console.log('result: ' + result);
        return result;
      }

      function removeSelectedClass() {
        var elements = document.getElementsByClassName('selectedDateCell');
        if (elements.length > 0) {
          for (var i = 0; i < elements.length; i++) {
            var element = elements[0];
            element.className = element.className.replace('selectedDateCell', '').trim();
          }
        }
      }

      function drawCalendar(year, month, day, overlay) {
        calendarDiv.innerHTML = '';

        var firstDayOfMonth = new Date(year, month, day);

        var dayOfWeekOfFirstOfMonth = firstDayOfMonth.getDay();
        console.log('firstDayOfMonth: ' + firstDayOfMonth.toLocaleDateString());
        console.log('dayOfWeekOfFirstOfMonth: ' + dayOfWeekOfFirstOfMonth);

        var overlayHeader = document.createElement('div');
        overlayHeader.className = 'overlayHeader';

        var yearText = firstDayOfMonth.getFullYear();
        var yearDiv = document.createElement('div');
        yearDiv.className = 'yearDiv';
        var yearBeforeSpan = document.createElement('span');
        yearBeforeSpan.innerText = '< ';
        yearBeforeSpan.addEventListener('click', function () {
          drawCalendar(firstDayOfMonth.getFullYear() - 1, firstDayOfMonth.getMonth(), 1, overlay);
        });
        yearBeforeSpan.className = 'yearBeforeSpan';
        var yearAfterSpan = document.createElement('span');
        yearAfterSpan.innerText = ' >';
        yearAfterSpan.addEventListener('click', function () {
          drawCalendar(firstDayOfMonth.getFullYear() + 1, firstDayOfMonth.getMonth(), 1, overlay);
        });
        yearAfterSpan.className = 'yearAfterSpan';
        var yearSpan = document.createElement('span');
        yearSpan.innerText = yearText;
        yearSpan.className = 'yearSpan';
        yearDiv.appendChild(yearBeforeSpan);
        yearDiv.appendChild(yearSpan);
        yearDiv.appendChild(yearAfterSpan);

        var monthText = firstDayOfMonth.toLocaleString(locale, { month: 'long' });
        var monthDiv = document.createElement('div');
        monthDiv.className = 'monthDiv';
        var monthBeforeSpan = document.createElement('span');
        monthBeforeSpan.innerText = '< ';
        monthBeforeSpan.addEventListener('click', function () {
          drawCalendar(firstDayOfMonth.getFullYear(), firstDayOfMonth.getMonth() - 1, 1, overlay);
        });
        monthBeforeSpan.className = 'monthBeforeSpan';
        var monthAfterSpan = document.createElement('span');
        monthAfterSpan.innerText = ' >';
        monthAfterSpan.addEventListener('click', function () {
          drawCalendar(firstDayOfMonth.getFullYear(), firstDayOfMonth.getMonth() + 1, 1, overlay);
        });
        monthAfterSpan.className = 'monthAfterSpan';
        var monthSpan = document.createElement('span');
        monthSpan.innerText = monthText;
        monthSpan.className = 'monthSpan';
        monthDiv.appendChild(monthBeforeSpan);
        monthDiv.appendChild(monthSpan);
        monthDiv.appendChild(monthAfterSpan);

        overlayHeader.appendChild(yearDiv);
        overlayHeader.appendChild(monthDiv);

        const oldOverlayHeader = overlay.querySelector('.overlayHeader');
        if (oldOverlayHeader) {
          overlay.insertBefore(overlayHeader, oldOverlayHeader);
          overlay.removeChild(oldOverlayHeader);
        } else if (overlay.children && overlay.children.length) {
          overlay.insertBefore(overlayHeader, overlay.children[0]);
        } else {
          overlay.appendChild(overlayHeader);
        }

        var table = document.createElement('table');

        table.className = 'calendarTableMain';

        var thead = document.createElement('thead');
        thead.className = 'calendarTableHead';
        table.appendChild(thead);
        var theadRow = document.createElement('tr');
        theadRow.className = 'calendarTableRowHead';
        thead.appendChild(theadRow);

        for (var i = 0; i < 7; i++) {
          var weekDay = new Date(firstDayOfMonth.getFullYear(), firstDayOfMonth.getMonth(), calendarFirstDayOfWeek + 1 + i - dayOfWeekOfFirstOfMonth);
          var weekDayText = weekDay.toLocaleString(locale, { weekday: 'short' });
          console.warn('i: ' + i + ' | weekDay: ' + weekDay.toLocaleDateString() + ' | text: ' + weekDayText);
          var td = document.createElement('td');
          td.innerText = weekDayText;
          td.className = 'tableHeadCell';
          theadRow.appendChild(td);
        }

        var tbody = document.createElement('tbody');
        tbody.className = 'calendarTableBody';
        table.appendChild(tbody);

        var beforeOffset = dayOfWeekOfFirstOfMonth - 1;
        console.log('beforeOffset: ' + beforeOffset);
        console.log('firstDayOfMonth.getMonth(): ' + firstDayOfMonth.getMonth());
        var lengthOfMonthWithBeforeOffset = beforeOffset + daysInMonth(firstDayOfMonth.getMonth() + 1, firstDayOfMonth.getFullYear());
        console.log('lengthOfMonthWithBeforeOffset: ' + lengthOfMonthWithBeforeOffset);
        var afterOffset = (lengthOfMonthWithBeforeOffset % 7) === 0 ? 0 : 7 - (lengthOfMonthWithBeforeOffset % 7);
        console.log('afterOffset: ' + afterOffset);
        var calendarMonthLength = lengthOfMonthWithBeforeOffset + afterOffset;

        var tbodyRow = document.createElement('tr');
        tbodyRow.className = 'calendarTableRowBody';
        console.log('calendarMonthLength: ' + calendarMonthLength);
        for (var i = 0; i < calendarMonthLength; i++) {
          (function () {
            console.log('\ti: ' + i);
            if ((i % 7) === 0 && i > 0) {
              tbody.appendChild(tbodyRow);
              tbodyRow = document.createElement('tr');
            }
            var monthDay = new Date(firstDayOfMonth.getFullYear(), firstDayOfMonth.getMonth(), calendarFirstDayOfWeek + 1 + i - dayOfWeekOfFirstOfMonth);
            console.log('\tmonthDay: ' + monthDay.getDate());
            var td = document.createElement('td');
            td.className = (td.className + ' tableBodyCell').trim();

            if (monthDay.getMonth() !== firstDayOfMonth.getMonth()) {
              td.className = (td.className + ' outsideMonthCell').trim();
            }

            if (monthDay.getFullYear() === resultDate.getFullYear() &&
              monthDay.getMonth() === resultDate.getMonth() &&
              monthDay.getDate() === resultDate.getDate()) {
              removeSelectedClass();
              td.className = (td.className + ' selectedDateCell').trim();
            }
            if (monthDay > options.maxDate) {
              td.setAttribute("disabled", "disabled");
              td.className = (td.className + ' disabledDateCell').trim();
            } else {

              td.addEventListener('click', function () {
                removeSelectedClass();
                this.className = (this.className + ' selectedDateCell').trim();
                var separateDay = new Date(monthDay);
                console.log('separateDay: ' + (separateDay.toLocaleDateString()));
                setResultDate(separateDay);
              });
            }
            td.innerText = monthDay.getDate();
            tbodyRow.appendChild(td);
          }());
        }
        tbody.appendChild(tbodyRow);
        calendarDiv.appendChild(table);
      }

      function drawTimePicker() {
        var timePickerTable = document.createElement('table');
        timePickerTable.className = 'timePickerTable';

        var timePickerDescriptionRow = document.createElement('tr');
        timePickerDescriptionRow.className = 'timePickerDescriptionRow';
        timePickerTable.appendChild(timePickerDescriptionRow);

        var timePickerInputRow = document.createElement('tr');
        timePickerInputRow.className = 'timePickerInputRow';
        timePickerTable.appendChild(timePickerInputRow);

        for (var i = 0; i < 2; i++) {
          var descriptionElement = document.createElement('td');
          timePickerDescriptionRow.appendChild(descriptionElement);

          var cell = document.createElement('td');
          cell.className = 'timePickerInputCell';
          timePickerInputRow.appendChild(cell);

          var timePickerSelect = document.createElement('select');
          timePickerSelect.className = 'timePickerSelect';
          timePickerSelect.setAttribute('data-tap-disabled', 'true');

          cell.appendChild(timePickerSelect);

          if (i == 0) {
            timePickerSelect.id = 'winjsdatepickerHours';
            descriptionElement.textContent = hoursLabel;
            descriptionElement.className = 'timePickerLabel';

            for (var h = 0; h <= 23; h++) {
              var option = document.createElement('option');
              option.textContent = h <= 9 ? '0' + h : h;
              option.value = h;

              if (h == options.date.getHours()) {
                option.setAttribute('selected', 'selected');
              }

              timePickerSelect.appendChild(option);
            }
          }
          else if (i == 1) {
            timePickerSelect.id = 'winjsdatepickerMinutes';
            descriptionElement.textContent = minutesLabel;
            descriptionElement.className = 'timePickerLabel';

            for (var m = 0; m <= 59; m++) {
              var option = document.createElement('option');
              option.textContent = m <= 9 ? '0' + m : m;
              option.value = m;

              if (m == options.date.getMinutes()) {
                option.setAttribute('selected', 'selected');
              }

              timePickerSelect.appendChild(option);
            }
          }
        }

        pickerDiv.appendChild(timePickerTable);
      }

      function getDefaultStyle() {
        return `
           .overlayMain {
             color: white;
             position: fixed;
             left: 0;
             top: 0;
             right:0;
             bottom:0;
             width: calc(100% - 32px);
             height: calc(100% - 32px);
             z-index: 99999;
             margin: 16px auto;
             background: #000;
             -ms-touch-action:none;
             font-family: sans-serif;
             padding: 16px;
             box-sizing: border-box;
           }
           .overlayFooter {
             position: fixed;
             bottom:16px;
             left:32px;
             right:32px;
             z-index: 1000;
             height: 10%;
             display: block;
             text-align:center;
             vertical-align:middle;
           }
           .pickerDivTable {
             width: calc(100% - 32px);
             height: calc(100% - 32px);
             display: table;
             text-align:center;
             margin: 0 auto;
             padding:0;
           }
           .pickerDiv {
             display: table-cell;
             vertical-align:middle;
             text-align:center;
           }
           .tableHeadCell{
             border-left: 1px solid;
             border-right: 1px solid;
             width: 14%
           }
           .tableBodyCell {
             border: 1px solid;
             width: 14%;
           }
           .selectedDateCell {
             color: red;
             border-color: red;
           }
           .disabledDateCell {
             color: grey;
             border-color: grey;
           }
           .calendarTableMain {
             height: 60%;
             font-size: 5vw;
             position: relative;
             top: -12%;
           }
           .outsideMonthCell {
             color: grey;
             border-color: grey;
           }
           .buttonStyle {
             border: 3px solid white;
             border-radius: 8px;
             background:#000;
             color:#FFF;
             width: 90%;
             height: 90%;
             font-size: 2em;
           }
           .footerLeftCell {
             display: inline-block;
             width: calc(50% - 16px);
             margin-right:16px
           }
           .footerRightCell {
             display: inline-block;
             width: calc(50% - 16px);
             margin-left:16px
           }
           .yearDiv {
             width: 100%;
             font-size: 34px;
             position: relative;
             top: -12%;
             text-align: center;
           }
           .monthDiv {
             width: 100%;
             font-size: 34px;
             position: relative;
             top: -12%;
             text-align: center;
           }
           .timePickerTable {
             table-layout:fixed;
             width:100%;
             margin: 0 auto;
             padding:0;
           }
           .timePickerLabel {
             font-size: 34px;
           }
           .timePickerSelect {
             border: 3px solid white;
             background:#000;
             color:#FFF;
             border-radius:0;
             width: 90%;
             height: 90%;
             font-size: 2em;
           }
         `;
      }
    }
  }
};

require('cordova/exec/proxy').add('DatePickerPlugin', module.exports);

