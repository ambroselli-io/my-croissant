const weekdays = ["sunday", "monday", "tuesday", "wednesday", "thursday", "friday", "saturday"];
import { find } from "geo-tz";

const tzDate = (date, timeZone) =>
  new Date(
    date.toLocaleString("en-US", {
      hour12: false,
      timeZone,
    })
  );

const formatOpenedTimes = (todayOpeningHours) => {
  const startTime = todayOpeningHours.start.toLocaleString("en-US", {
    hour12: false,
    hour: "numeric",
    minute: "numeric",
  });
  const endTime = todayOpeningHours.end.toLocaleString("en-US", {
    hour12: false,
    hour: "numeric",
    minute: "numeric",
  });
  if (!todayOpeningHours.pauseStart) {
    return `${startTime} - ${endTime}`;
  }
  const pauseStartTime = todayOpeningHours.pauseStart.toLocaleString("en-US", {
    hour12: false,
    hour: "numeric",
    minute: "numeric",
  });
  const pauseEndTime = todayOpeningHours.pauseEnd.toLocaleString("en-US", {
    hour12: false,
    hour: "numeric",
    minute: "numeric",
  });
  return `${startTime} - ${pauseStartTime}; ${pauseEndTime} - ${endTime}`;
};

const todayOpeningHours = (openingHours, coordinates) => {
  const timeZone = find(coordinates[1], coordinates[0]);
  const today = tzDate(new Date(), timeZone);
  const weekDay = weekdays[today.getDay()];
  const todayOpeningHours = openingHours
    .filter((o) => o.weekday === weekDay)
    .sort((o1, o2) => (o1.priority > o2.priority ? -1 : 1))
    .map(({ start, end, pauseStart, pauseEnd, date, closed = false }) => {
      if (closed) return { closed: true };
      const tzStart = tzDate(
        new Date(
          today.getFullYear(),
          today.getMonth(),
          today.getDate(),
          start / 100,
          `${start}`.slice(-2)
        ),
        timeZone
      );
      const tzEnd = tzDate(
        new Date(
          today.getFullYear(),
          today.getMonth(),
          today.getDate(),
          end / 100,
          `${end}`.slice(-2)
        ),
        timeZone
      );
      if (!pauseStart || !pauseEnd) {
        return { start: tzStart, end: tzEnd, date: date || today, closed };
      }
      const tzPauseStart = tzDate(
        new Date(
          today.getFullYear(),
          today.getMonth(),
          today.getDate(),
          pauseStart / 100,
          `${pauseStart}`.slice(-2)
        ),
        timeZone
      );
      const tzPauseEnd = tzDate(
        new Date(
          today.getFullYear(),
          today.getMonth(),
          today.getDate(),
          pauseEnd / 100,
          `${pauseEnd}`.slice(-2)
        ),
        timeZone
      );
      return {
        start: tzStart,
        end: tzEnd,
        pauseStart: tzPauseStart,
        pauseEnd: tzPauseEnd,
        date: date || today,
        closed,
      };
    })?.[0];

  if (todayOpeningHours.closed) return { opened: false };
  if (
    todayOpeningHours.start.toISOString() > today.toISOString() ||
    todayOpeningHours.end.toISOString() < today.toISOString()
  ) {
    return {
      opened: false,
      schedule: formatOpenedTimes(todayOpeningHours),
    };
  }
  if (!todayOpeningHours.pauseStart) {
    return {
      opened: true,
      schedule: formatOpenedTimes(todayOpeningHours),
    };
  }
  if (
    todayOpeningHours.pauseStart.toISOString() < today.toISOString() &&
    todayOpeningHours.pauseEnd.toISOString() > today.toISOString()
  ) {
    return {
      opened: false,
      schedule: formatOpenedTimes(todayOpeningHours),
    };
  }
  return {
    opened: true,
    schedule: formatOpenedTimes(todayOpeningHours),
  };
};

export default todayOpeningHours;
