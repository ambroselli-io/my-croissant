import ReactDOM from "react-dom";
import { useEffect, useState } from "react";
import Availability from "./Availability";

const ItemCard = ({ item, isLoading }) => {
  const [showMoreInfos, setShowMoreInfos] = useState(false);

  return (
    <>
      <MoreInfos item={item} show={showMoreInfos} close={() => setShowMoreInfos(false)} />
      <article
        onClick={() => setShowMoreInfos(true)}
        className="h-32 relative rounded-lg bg-[#faf5e2] flex overflow-hidden cursor-pointer">
        <aside
          aria-labelledby="tags"
          className={`${
            item.homemade ? "bg-green-500" : "bg-red-500"
          } rounded-lg px-2 py-1 text-xs absolute top-2 right-2`}>
          {item.homemade ? "Home made" : "Industrial"}
        </aside>
        <div className="h-full w-1/4 shrink-0">
          <img src={item.picture} className="h-full w-full object-cover" />
        </div>
        <div className="relative px-4 pt-4 pb-2 flex flex-col items-start justify-start">
          <h2 className="font-bold mb-1">{item.name}</h2>
          <p className="font-light text-sm text-ellipsis line-clamp-2">{item.description}</p>
          <button
            onClick={() => setShowMoreInfos(true)}
            className="font-light italic text-xs ml-auto mt-auto">
            Plus d'infos <span className="text-base">👉</span>
          </button>
          <aside
            aria-labelledby="availability"
            className="rounded-lg px-2 py-1 text-xs absolute bottom-2 left-2">
            <em className={`not-italic ${!item.availableHours.opened && "text-red-500"}`}>
              {item.availableHours.opened ? "Available now" : "Not available now"}
            </em>
          </aside>
        </div>
      </article>
    </>
  );
};

const MoreInfos = ({ item, show, close }) => {
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, [isMounted]);
  if (!isMounted) return null;

  return ReactDOM.createPortal(
    <article
      className={`absolute h-full w-full bg-white flex flex-col overflow-y-auto ${
        !show ? "translate-y-full" : ""
      } transition-transform delay-150 duration-500`}>
      <div className="w-full h-60 relative">
        <img src={item.picture} className="w-full h-full object-cover" loading="lazy" />
        <button className="font-light text-white absolute right-2 top-2" onClick={close}>
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
      </div>
      <div className="relative px-4 pt-6 pb-2 flex flex-col items-start justify-start">
        <aside
          aria-labelledby="tags"
          className={`${
            item.homemade ? "bg-green-500" : "bg-red-500"
          } rounded-lg px-2 py-1 text-xs absolute top-2 right-2`}>
          {item.homemade ? "Home made" : "Industrial"}
        </aside>
        <h2 className="font-bold mb-1">{item.name}</h2>
        <Availability
          hours={item.availableHours}
          title="Availability"
          openedCaption=""
          closedCaption="Not available now"
        />
        <p className="font-light text-sm">{item.description}</p>
        <h3 className="mt-3 mb-2 font-bold text-sm">Ingredients</h3>
        {item.ingredients.map((ingredient) => (
          <div className="mt-1 ml-1 text-sm flex" key={ingredient.name}>
            <img className="h-6 w-6 mr-2" src={`/assets/${ingredient._id}.webp`} loading="lazy" />
            <span>
              {ingredient.name}: {ingredient.quantity}
              {ingredient.unit}
            </span>
          </div>
        ))}
      </div>
    </article>,
    document?.getElementById("drawer")
  );
};

export default ItemCard;
