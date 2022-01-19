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

const todayOpeningHours = (hours, coordinates) => {
  const timeZone = find(coordinates[1], coordinates[0]);
  const today = tzDate(new Date(), timeZone);
  const weekday = weekdays[today.getDay()];
  const openingHours = hours
    .map(({ start, end, pauseStart, pauseEnd, date, closed = false, weekday, priority }) => {
      if (closed) return { closed: true, weekday, priority };
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
        return { start: tzStart, end: tzEnd, date: date || today, closed, weekday, priority };
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
        weekday,
        priority,
      };
    })
    .map((dayOpeningHours) => {
      const { weekday, priority } = dayOpeningHours;
      if (dayOpeningHours.closed) return { opened: false, weekday, priority };
      if (
        dayOpeningHours.start.toISOString() > today.toISOString() ||
        dayOpeningHours.end.toISOString() < today.toISOString()
      ) {
        return {
          opened: false,
          schedule: formatOpenedTimes(dayOpeningHours),
          weekday,
          priority,
        };
      }
      if (!dayOpeningHours.pauseStart) {
        return {
          opened: true,
          schedule: formatOpenedTimes(dayOpeningHours),
          weekday,
          priority,
        };
      }
      if (
        dayOpeningHours.pauseStart.toISOString() < today.toISOString() &&
        dayOpeningHours.pauseEnd.toISOString() > today.toISOString()
      ) {
        return {
          opened: false,
          schedule: formatOpenedTimes(dayOpeningHours),
          weekday,
          priority,
        };
      }
      return {
        opened: true,
        schedule: formatOpenedTimes(dayOpeningHours),
        weekday,
        priority,
      };
    });

  console.log(openingHours);

  const todayOpeningHours = openingHours
    .filter((o) => o.weekday === weekday)
    .sort((o1, o2) => (o1.priority > o2.priority ? -1 : 1))?.[0];
  return {
    ...todayOpeningHours,
    openingHours,
  };
};

export default todayOpeningHours;
