import React from 'react';
import dayjs from 'dayjs';
import isoWeek from 'dayjs/plugin/isoWeek';
import classnames from 'classnames';
import PropTypes from 'prop-types';
import { DATE_FORMAT, DATE_UNIT, GRID_VIEWS } from '../../constants';

dayjs.extend(isoWeek);

function BgCells({selectedGridView, columnWidth, renderedDates}) {
  const isWeekend = (date) => {
    if (selectedGridView === GRID_VIEWS.DAY) {
      return dayjs(date).isoWeekday() === 6 ||
        dayjs(date).isoWeekday() === 7;
    }
    return false;
  };

  const isEndOfRange = (date) => {
    if (selectedGridView === GRID_VIEWS.YEAR) {
      return dayjs(date).endOf(DATE_UNIT.YEAR).format(DATE_FORMAT.YEAR_MONTH) === dayjs(date).format(DATE_FORMAT.YEAR_MONTH);
    } else if (selectedGridView === GRID_VIEWS.DAY || GRID_VIEWS.MONTH) {
      return dayjs(date).endOf(DATE_UNIT.MONTH).format(DATE_FORMAT.YEAR_MONTH_DAY) === date;
    }
    return false;
  };

  return renderedDates.map((d) => {
    let dateItemWidth, _isWeekend = false, isEndRange = false;
    if (selectedGridView === GRID_VIEWS.YEAR) {
      isEndRange = true;
      let endOfYear = dayjs(d).endOf(DATE_UNIT.YEAR);
      dateItemWidth = (endOfYear.diff(d, DATE_UNIT.MONTH) + 1) * columnWidth;
    } else if (selectedGridView === GRID_VIEWS.MONTH) {
      isEndRange = true;
      let endOfMonth = dayjs(d).endOf(DATE_UNIT.MONTH);
      dateItemWidth = (dayjs(endOfMonth).diff(d, DATE_UNIT.DAY) + 1) * columnWidth;
    } else {
      isEndRange = isEndOfRange(d);
      _isWeekend = isWeekend(d);
      dateItemWidth = columnWidth;
    }
    const dateBgClassName = classnames({
      'timeline-date-bg': true,
      'd-inline-block': true,
      'sun-or-sat-day': _isWeekend,
      'end-of-range': isEndRange
    });
    return (
      <div key={`timeline-date-bg-${d}`} name={d} className={dateBgClassName} style={{width: dateItemWidth}}></div>
    );
  });
}

BgCells.propTypes = {
  selectedGridView: PropTypes.string,
  columnWidth: PropTypes.number,
  renderedDates: PropTypes.array,
};

export default BgCells;
