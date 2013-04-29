(function ($, undefined) {
    var dwDatePicker = function () {
        this._selectedDate = null;
        this._displayDate = new Date();
        this._context = null;
        this._input = null;
        this._dayNames = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
        this._dayNamesShort = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
        this._monthNames = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
        this._monthNamesShort = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
        this._dateFormat = 'yyyy-mm-dd';
        this._settingNames = ['dateFormat', 'dayNames', 'dayNamesShort', 'monthNames', 'monthNamesShort'];
    };

    $.extend(dwDatePicker.prototype, {
        _isSomeDate:function (date1, date2) {
            return date1.getDate() == date2.getDate() && date1.getMonth() == date2.getMonth() && date1.getFullYear() == date2.getFullYear();
        },
        _refresh:function () {
            if (this._context.find('table[dw-date-picker]').length < 1) {
                $('<table class="dw-date-picker" dw-date-picker/>').appendTo(this._context);
            }
            this._refreshTitle();
            this._refreshDays();
            this._refreshTools();
        },
        _refreshTitle:function () {
            if (this._context.find('table[dw-date-picker] > thead').length < 1) {
                $('<thead/>').appendTo(this._context.find('table[dw-date-picker]'));
            }
            this._context.find('table[dw-date-picker] > thead > tr[dw-select-month-bar]').remove();
            this._refreshMonthBar();
            this._refreshDayBar();
        },
        _refreshMonthBar:function () {
            var text = this._monthNames[this._displayDate.getMonth()] + ', ' + this._displayDate.getFullYear();
            var row = this._context.find('table[dw-date-picker] > thead > tr[dw-month-bar]');
            if (row.length < 1) {
                row = $('<tr dw-month-bar/>');
                row.appendTo(this._context.find('table > thead'));
                $('<td colspan="3" dw-month>' + text + '</td>').appendTo(row);
                $('<td dw-prev-month>&#60;</td>').prependTo(row);
                $('<td dw-next-month>&#62;</td>').appendTo(row);
                $('<td dw-prev-year>&#60;&#60;</td>').prependTo(row);
                $('<td dw-next-year>&#62;&#62;</td>').appendTo(row);

                $('tr[dw-month-bar] td').mouseenter(function () {
                    $(this).addClass('dw-focus');
                }).mouseleave(function () {
                        $(this).removeClass('dw-focus');
                    });

                var inst = this;
                row.find('td[dw-month]').click(function () {
                    return inst._selectMonth();
                });
                row.find('td[dw-prev-year]').click(function () {
                    inst._showMonth({
                        year:inst._displayDate.getFullYear() - 1,
                        month:inst._displayDate.getMonth()
                    });
                });
                row.find('td[dw-next-year]').click(function () {
                    inst._showMonth({
                        year:inst._displayDate.getFullYear() + 1,
                        month:inst._displayDate.getMonth()
                    });
                });
                row.find('td[dw-prev-month]').click(function () {
                    var year = inst._displayDate.getFullYear();
                    var month = inst._displayDate.getMonth();
                    inst._showMonth({
                        year:month > 0 ? year : year - 1,
                        month:month > 0 ? month - 1 : 11
                    });
                });
                row.find('td[dw-next-month]').click(function () {
                    var year = inst._displayDate.getFullYear();
                    var month = inst._displayDate.getMonth();
                    inst._showMonth({
                        year:month < 11 ? year : year + 1,
                        month:month < 11 ? month + 1 : 0
                    });
                });
            } else {
                row.children('td[dw-month]').text(text);
            }
        },
        _refreshDayBar:function () {
            if (this._context.find('table[dw-date-picker] > thead > tr[dw-day-bar]').length < 1) {
                var row = $('<tr dw-day-bar/>');
                row.appendTo(this._context.find('table > thead'));
                for (var i = 0; i < 7; i++) {
                    $('<th>' + this._dayNamesShort[i] + '</th>').appendTo(row);
                }
                row.find('th:first, th:last').addClass('dw-weekend');
            }
        },
        _refreshDays:function () {
            this._context.find('table[dw-date-picker] > tbody').remove();
            var body = $('<tbody/>');
            body.appendTo(this._context.find('table[dw-date-picker]'));

            var date = new Date();
            date.setTime(this._displayDate.getTime());
            date.setDate(1);
            date.setDate(-date.getDay() + 1);
            var today = new Date();

            do {
                var row = $('<tr/>');
                row.appendTo(body);

                for (var j = 0; j < 7; j++) {
                    var cell = $('<td>' + date.getDate() + '</td>');
                    if (this._isSomeDate(date, today)) {
                        cell.addClass('dw-today');
                    }
                    if (this._selectedDate != null && this._isSomeDate(date, this._selectedDate)) {
                        cell.addClass('dw-selected');
                    }
                    if (date.getMonth() != this._displayDate.getMonth()) {
                        cell.addClass('dw-disabled');
                    }
                    cell.appendTo(row);

                    var inst = this;
                    cell.mouseenter(function () {
                        $(this).addClass('dw-focus');
                    }).mouseleave(function () {
                            $(this).removeClass('dw-focus');
                        }).click(function (date) {
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
                $('<td colspan="3" dw-close> </td>').appendTo(toolbar);
                $('<td colspan="2" dw-today>Today</td>').prependTo(toolbar);
                $('<td colspan="2" dw-selected-date>Selected</td>').appendTo(toolbar);
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
                $('<tr dw-select-month-bar><td colspan="3"><select/></td><td>ok</td><td colspan="3"><select/></td></tr>').
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
                this._input.val(this._formatDate(date, this._dateFormat));
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
            for (var i = 0; i < this._dateFormat.length; i++) {
                var s = this._dateFormat.charAt(i);
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
