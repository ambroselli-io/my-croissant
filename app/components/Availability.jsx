import ReactDOM from "react-dom";
import { useEffect, useState } from "react";

const Availability = ({
  hours,
  title = "Opening hours",
  openedCaption = "Opened now",
  closedCaption = "Closed now",
}) => {
  const [showMoreAvailability, setShowMoreAvailability] = useState(false);

  return (
    <>
      <MoreAvailability
        hours={hours}
        title={title}
        show={showMoreAvailability}
        close={() => setShowMoreAvailability(false)}
      />
      <span
        aria-details="opening hours"
        className="flex text-sm mb-3 cursor-pointer"
        onClick={() => setShowMoreAvailability(true)}>
        <img src="/assets/clock-grey.svg" className="w-5 mr-3" />
        <em className={`not-italic ${!hours.opened && "text-red-500"}`}>
          {hours.opened ? openedCaption : closedCaption}
        </em>
        <em className="text-gray-400">{!!hours.schedule && `\u00A0\u00A0${hours.schedule}`}</em>
      </span>
    </>
  );
};

const MoreAvailability = ({ hours, title, show, close }) => {
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, [isMounted]);
  if (!isMounted) return null;

  return ReactDOM.createPortal(
    <aside
      className={`absolute h-full w-full bg-white flex flex-col overflow-y-hidden ${
        !show ? "translate-y-full" : ""
      } transition-transform delay-150 duration-500`}>
      <div className="w-full h-full relative overflow-y-auto px-4 py-6">
        <button className="font-light text-black absolute right-2 top-2" onClick={close}>
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-6 w-6"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor">
            <path
              strokeLinecap="round"
              className="drop-shadow-sm"
              // style={{ filter: "drop-shadow(0px 0px 1px rgba(0, 0, 0, 1))" }}
              strokeLinejoin="round"
              strokeWidth={2}
              d="M6 18L18 6M6 6l12 12"
            />
          </svg>
        </button>
        <h2 className="font-bold mb-3">{title}</h2>
        <div className="flex text-sm">
          <div className="flex flex-col mr-2">
            {hours.openingHours.map((hour) => (
              <span
                key={hour.weekday}
                className={`block ml-2 mb-1 ${hours.weekday === hour.weekday ? "font-bold" : ""} `}>
                {hour.weekday.charAt(0).toUpperCase() + hour.weekday.slice(1)}
              </span>
            ))}
          </div>
          <div className="flex flex-col">
            {hours.openingHours.map((hour) => (
              <span
                key={hour.weekday}
                className={`block ml-2 mb-1 ${hours.weekday === hour.weekday ? "font-bold" : ""} `}>
                {hour.schedule}
              </span>
            ))}
          </div>
        </div>
      </div>
    </aside>,
    document?.getElementById("drawer")
  );
};

export default Availability;
