(function ($, undefined) {
    var dwDatePicker = function () {
          // the selected date.
        this._selectedDate = null;
        // The date shown in the calendar.
        this._displayDate = new Date();
        // Display the calendar area.
        this._context = null;
        // Calendar of events bound to input box.
        this._input = null;
        // Full names of the week.
        this._dayNames = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
        // Short names of the week.
        this._dayNamesShort = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
        // Full names of the month.
        this._monthNames = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
        // Short names of the month.
        this._monthNamesShort = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
        // The date pattern for format/parse the date.
        this._datePattern = 'yyyy-mm-dd';
        this._settingNames = ['dateFormat', 'dayNames', 'dayNamesShort', 'monthNames', 'monthNamesShort'];
    };

    $.extend(dwDatePicker.prototype, {
    	  // Validate two dates on the some date.
        _isSomeDate:function (date1, date2) {
            return date1.getDate() == date2.getDate() && date1.getMonth() == date2.getMonth() && date1.getFullYear() == date2.getFullYear();
        },
        // Refresh the calendar.
        _refresh:function () {
            if (this._context.find('.dw-date-picker').length < 1) {
                $('<div class="dw-date-picker"/>').appendTo(this._context);
            }
            this._refreshMonthBar();
            this._refreshDayBar();
            this._refreshDays();
            this._refreshTools();
        },
        // Refresh the month bar of the calendar.
        _refreshMonthBar:function () {
            var text = this._monthNames[this._displayDate.getMonth()] + ', ' + this._displayDate.getFullYear();
            var parent = this._context.find('.dw-date-picker-panel-title');

            if (parent.length < 1) {
                parent = $('<div class="dw-date-picker-panel dw-date-picker-panel-title"/>');
                parent.appendTo(this._context.find('.dw-date-picker'));
                var inst = this;

                var prevYear = $('<div class="dw-date-picker-cell dw-date-picker-cell-title" dw-prev-year><div class="dw-date-picker-cell-text dw-date-picker-cell-text-title">&#60;&#60;</div></div>');
                prevYear.click(function () {
                    inst._showMonth({
                        year:inst._displayDate.getFullYear() - 1,
                        month:inst._displayDate.getMonth()
                    });
                });
                prevYear.appendTo(parent);

                var prevMonth = $('<div class="dw-date-picker-cell dw-date-picker-cell-title" dw-prev-month><div class="dw-date-picker-cell-text dw-date-picker-cell-text-title">&#60;</div></div>');
                prevMonth.click(function () {
                    var year = inst._displayDate.getFullYear();
                    var month = inst._displayDate.getMonth();
                    inst._showMonth({
                        year:month > 0 ? year : year - 1,
                        month:month > 0 ? month - 1 : 11
                    });
                });
                prevMonth.appendTo(parent);

                $('<div class="dw-date-picker-cell dw-date-picker-cell-title dw-date-picker-cell-span3" dw-month><div class="dw-date-picker-cell-text dw-date-picker-cell-text-title dw-date-picker-cell-text-span3">' + text + '</div></div>').appendTo(parent);
                
                var nextMonth = $('<div class="dw-date-picker-cell dw-date-picker-cell-title" dw-next-month><div class="dw-date-picker-cell-text dw-date-picker-cell-text-title">&#62;</div></div>');
                nextMonth.click(function () {
                    var year = inst._displayDate.getFullYear();
                    var month = inst._displayDate.getMonth();
                    inst._showMonth({
                        year:month < 11 ? year : year + 1,
                        month:month < 11 ? month + 1 : 0
                    });
                });
                nextMonth.appendTo(parent);

                var nextYear = $('<div class="dw-date-picker-cell dw-date-picker-cell-title" dw-next-year><div class="dw-date-picker-cell-text dw-date-picker-cell-text-title">&#62;&#62;</div></div>');
                nextYear.click(function () {
                    inst._showMonth({
                        year:inst._displayDate.getFullYear() + 1,
                        month:inst._displayDate.getMonth()
                    });
                });
                nextYear.appendTo(parent);
            } else {
                parent.find('.dw-date-picker-cell-text-span3').text(text);
            }
        },
        // Refresh the day bar of the calendar.
        _refreshDayBar:function () {
            var parent = this._context.find('.dw-date-picker-panel-week');
            if (parent.length < 1) {
                parent = $('<div class="dw-date-picker-panel dw-date-picker-panel-week"/>');
                parent.appendTo(this._context.find('.dw-date-picker'));
                for (var i = 0; i < 7; i++) {
                    $('<div class="dw-date-picker-cell dw-date-picker-cell-week"><div class="dw-date-picker-cell-text dw-date-picker-cell-text-week">' + this._dayNamesShort[i] + '</div></div>').appendTo(parent);
                }
            }
        },
        // Refresh the days of the calendar.
        _refreshDays:function () {
            var parent = this._context.find('.dw-date-picker-panel-day');
            if (parent.length < 1) {
                parent = $('<div class="dw-date-picker-panel dw-date-picker-panel-day"/>');
                parent.appendTo(this._context.find('.dw-date-picker'));
            } else {
                parent.children().remove();
            }

            var date = new Date();
            date.setTime(this._displayDate.getTime());
            date.setDate(1);
            date.setDate(-date.getDay() + 1);
            var today = new Date();

            do {
                for (var j = 0; j < 7; j++) {
                    var cell = $('<div class="dw-date-picker-cell"><div class="dw-date-picker-cell-text">' + date.getDate() + '</div></div>');
                    if (this._isSomeDate(date, today)) {
                        cell.addClass('dw-date-picker-cell-today');
                        cell.children().addClass('dw-date-picker-cell-text-today');
                        $('<span class="dw-date-picker-cell-side">Today</span>').appendTo(cell.children());
                    } else if (this._selectedDate != null && this._isSomeDate(date, this._selectedDate)) {
                        //cell.addClass('dw-selected');
                    } else if (date.getMonth() == this._displayDate.getMonth()) {
                        cell.addClass('dw-date-picker-cell-day');
                        cell.children().addClass('dw-date-picker-cell-text-day');
                    } else {
                        cell.addClass('dw-date-picker-cell-day-disabled');
                        cell.children().addClass('dw-date-picker-cell-text-day-disabled');
                    }
                    cell.appendTo(parent);

                    var inst = this;
                    cell.click(function (date) {
                        var selectedDate = new Date();
                        selectedDate.setTime(date.getTime());
                        return function () {
                            inst._selectDate(selectedDate);
                        };
                    }(date));

                    date.setDate(date.getDate() + 1);
                }
            } while (date.getMonth() == this._displayDate.getMonth());

            date.setDate(1);
            $('table[dw-date-picker] > tbody td')
        },
        _refreshTools:function () {
            if (this._context.find('table[dw-date-picker] > tfoot').length < 1) {
                $('<tfoot/>').appendTo(this._context.find('table[dw-date-picker]'));
                var toolbar = $('<tr>');
                toolbar.appendTo($('table[dw-date-picker] > tfoot'));
                $('<td class="dw-date-picker-cell" colspan="3" dw-close><div class="dw-date-picker-cell-text">&nbsp;</div></td>').appendTo(toolbar);
                $('<td class="dw-date-picker-cell" colspan="2" dw-today><div class="dw-date-picker-cell-text">Today</div></td>').prependTo(toolbar);
                $('<td class="dw-date-picker-cell" colspan="2" dw-selected-date><div class="dw-date-picker-cell-text">Selected</div></td>').appendTo(toolbar);
                var inst = this;

                $('td[dw-today]').mouseenter(function () {
                    $(this).addClass('dw-focus');
                }).mouseleave(function () {
                        $(this).removeClass('dw-focus');
                    }).click(function () {
                        inst._showMonth(new Date());
                    });

                $('td[dw-selected-date]').mouseenter(function () {
                    $(this).addClass('dw-focus');
                }).mouseleave(function () {
                        $(this).removeClass('dw-focus');
                    }).click(function () {
                        if (inst._selectedDate != null) {
                            inst._showMonth(inst._selectedDate);
                        }
                    });

                if (this._input != null) {
                    $('td[dw-close]').mouseenter(function () {
                        $(this).addClass('dw-focus');
                    }).mouseleave(function () {
                            $(this).removeClass('dw-focus');
                        }).click(function () {
                            inst._context.hide();
                        }).text('Close');
                }
            }
        },
        _selectMonth:function () {
            if (this._context.find('tr[dw-select-month-bar]').length > 0) {
                this._context.find('tr[dw-select-month-bar]').remove();
            } else {
                $('<tr dw-select-month-bar><td class="dw-date-picker-cell" colspan="3"><select/></td><td class="dw-date-picker-cell">ok</td><td class="dw-date-picker-cell" colspan="3"><select/></td></tr>').
                    insertAfter($('tr[dw-month-bar]'));

                var month = this._context.find('tr[dw-select-month-bar] select:first');
                for (var i = 0; i < 12; i++) {
                    $('<option value="' + i + '">' + this._monthNames[i] + '</option>').appendTo(month);
                }
                month.val(this._displayDate.getMonth());

                var year = this._context.find('tr[dw-select-month-bar] select:last');
                for (var i = this._displayDate.getFullYear() - 10; i < this._displayDate.getFullYear() + 10; i++) {
                    $('<option value="' + i + '">' + i + '</option>').appendTo(year);
                }
                year.val(this._displayDate.getFullYear());

                var inst = this;
                $('tr[dw-select-month-bar] td:eq(1)').click(function () {
                    inst._showMonth({
                        year:parseInt(year.val()),
                        month:parseInt(month.val())
                    });
                });
            }
        },
        _selectDate:function (date) {
            this._selectedDate = date;
            this._showMonth(date);
            if (this._input != null) {
                this._input.val(this._formatDate(date, this._datePattern));
                this._context.hide();
            }
        },
        _showMonth:function (date) {
            if ($.type(date) == 'date') {
                this._displayDate.setTime(date.getTime());
            } else {
                this._displayDate.setDate(1);
                this._displayDate.setMonth(date.month);
                this._displayDate.setFullYear(date.year);
            }
            this._refresh();
        },
        _formatDate:function (date) {
            var parts = [];
            var prev = null;
            for (var i = 0; i < this._datePattern.length; i++) {
                var s = this._datePattern.charAt(i);
                parts.push(prev == s ? parts.pop() + s : s);
                prev = s;
            }
            var result = '';
            for (var j = 0; j < parts.length; j++) {
                switch (parts[j]) {
                    case 'yyyy':
                        result += date.getFullYear();
                        break;
                    case 'yy':
                        var year = date.getFullYear() + '';
                        result += year.substring(year.length < 2 ? 0 : year.length - 2, year.length);
                        break;
                    case 'MM':
                        result += this._monthNames[date.getMonth()];
                        break;
                    case 'M':
                        result += this._monthNamesShort[date.getMonth()];
                        break;
                    case 'mm':
                        var month = date.getMonth() + 1 + '';
                        result += month.length < 2 ? '0' + month : month;
                        break;
                    case 'm':
                        result += date.getMonth() + 1;
                        break;
                    case 'dd':
                        var day = date.getDate() + 1 + '';
                        result += day.length < 2 ? '0' + day : day;
                        break;
                    case 'd':
                        result += date.getDate() + 1;
                        break;
                    case 'DD':
                        result += this._dayNames[date.getDay()];
                        break;
                    case 'D':
                        result += this._dayNames[date.getDay()];
                        break;
                    default:
                        result += parts[j];
                }
            }
            return result;
        },
        _operate:function (arg0, arg1, arg2) {
            switch (arg0) {
                case 'show':
                    this._context.show();
                    break;
                case 'hide':
                    this._context.hide();
                    break;
                case 'refresh':
                    this._refresh();
                    break;
                case 'option':
                    switch ($.type(arg1)) {
                        case 'string':
                            var result = this._option(arg1, arg2);
                            if (result != undefined) {
                                return result;
                            }
                            break;
                        case 'object':
                            this._options(arg1);
                            break;
                    }
                    break;
            }
        },
        _options:function (settings) {
            for (var name in settings) {
                if (settings.hasOwnProperty(name)) {
                    this._option(name, settings[name], false);
                }
            }
        },
        _option:function (name, value) {
            if (value == undefined) {
                return $.inArray(name, this._settingNames) > -1 ? this['_' + name] : null;
            }
            if ($.inArray(name, this._settingNames) > -1) {
                this['_' + name] = value;
            }
        },
        _init:function (tag) {
            switch (tag.get(0).tagName.toLowerCase()) {
                case 'input':
                    this._input = tag;
                    var content = $('<div style="display: none;" class="dw-date-picker-context"/>');
                    this._context = content;
                    content.appendTo($('body'));
                    content.css('z-index', parseInt(tag.css('z-index')) + 1);
                    content.offset({
                        top:tag.offset().top + tag.get(0).offsetHeight,
                        left:tag.offset().left
                    });
                    tag.focus(function () {
                        content.show();
                    });
                    break;
                case 'div':
                    this._context = tag;
                    tag.addClass('dw-date-picker-context');
                    tag.css('position', 'absolute');
                    break;
            }
        }
    });

    $.fn.dwDatePicker = function (arg0, arg1, arg2) {
        if (this.length > 1) {
            this.each(function (i, elem) {
                $(elem).dwDatePicker(arg0, arg1, arg2);
            });
        } else if (this.length > 0) {
            var inst = this.get(0).dwDatePicker;
            if (inst == null) {
                inst = new dwDatePicker();
                this.get(0).dwDatePicker = inst;
                inst._init(this);
                inst._operate('option', arg0, arg1);
                inst._refresh();
            } else {
                inst._operate(arg0, arg1, arg2);
            }
            this.dwDatePicker = inst._operate;
        }
    };
})(jQuery);
