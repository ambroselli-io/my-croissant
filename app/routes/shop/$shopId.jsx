import { useEffect } from "react";
import { useLoaderData } from "remix";
import ShopObject from "../../../db/models/shop";
import MyMap from "../../services/mapbox";
import pin from "../../assets/pin-grey.svg";
import clock from "../../assets/clock-grey.svg";
import todayOpeningHours from "../../utils/opening-hours";

const pictures = [
  "https://images.unsplash.com/photo-1607151815172-254f6b0c9b4b?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=MnwyOTE0MTR8MHwxfHJhbmRvbXx8fHx8fHx8fDE2NDIzNDQ3MzQ&ixlib=rb-1.2.1&q=80&w=1080",
  "https://images.unsplash.com/photo-1595397351604-cf490cc38bf1?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=MnwyOTE0MTR8MHwxfHJhbmRvbXx8fHx8fHx8fDE2NDIzNDQ3NTI&ixlib=rb-1.2.1&q=80&w=1080",
  "https://images.unsplash.com/photo-1577595927087-dedbe84f0e4d?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=MnwyOTE0MTR8MHwxfHJhbmRvbXx8fHx8fHx8fDE2NDIzNDQ3NjU&ixlib=rb-1.2.1&q=80&w=1080",
  "https://images.unsplash.com/photo-1532635224-cf024e66d122?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=MnwyOTE0MTR8MHwxfHJhbmRvbXx8fHx8fHx8fDE2NDIzNDQ3NzI&ixlib=rb-1.2.1&q=80&w=1080",
];

export const loader = async ({ params }) => {
  const shop = await ShopObject.findById(params.shopId);
  const picture = pictures[Math.round(Math.random() * 3)];
  const openingHours = [
    {
      weekday: "monday",
      start: 1000,
      end: 1700,
      pauseStart: 1300,
      pauseEnd: 1400,
      priority: 0,
    },
    {
      weekday: "tuesday",
      start: 1000,
      end: 1700,
      pauseStart: 1300,
      pauseEnd: 1400,
      priority: 0,
    },
    {
      weekday: "wednesday",
      start: 1000,
      end: 1700,
      pauseStart: 1300,
      pauseEnd: 1400,
      priority: 0,
    },
    {
      weekday: "thursday",
      start: 1000,
      end: 1700,
      pauseStart: 1300,
      pauseEnd: 1400,
      priority: 0,
    },
    {
      weekday: "friday",
      start: 1000,
      end: 1700,
      pauseStart: 1300,
      pauseEnd: 1400,
      priority: 0,
    },
    {
      weekday: "saturday",
      start: 1000,
      end: 1700,
      pauseStart: 1300,
      pauseEnd: 1400,
      priority: 0,
    },
    {
      weekday: "sunday",
      start: 1000,
      end: 1700,
      pauseStart: 1300,
      pauseEnd: 1400,
      priority: 0,
    },
  ];

  return {
    data: {
      type: "Feature",
      id: shop._id,
      geometry: shop.location,
      properties: {
        _id: shop._id,
        title: shop.name,
        picture,
        address1: "Goudsbloemstraat 35D",
        address2: "1015JJ Amsterdam",
        openingHours: todayOpeningHours(openingHours, shop.location.coordinates),
      },
    },
  };
};

const Shop = () => {
  const { data } = useLoaderData();

  useEffect(() => {
    MyMap.addCurrentShopMarker(data);
  }, [data?.id]);

  return (
    <div className="max-w-sm w-full h-full bg-white drop-shadow-lg">
      <img src={data.properties.picture} className="w-full h-60 object-cover" />
      <h1 className="font-bold px-4 mt-4 text-xl">{data.properties.title}</h1>
      <address className="flex flex-col px-4 mt-2 text-sm not-italic items-start gap-2 justify-start">
        <span aria-details="address" className="flex">
          <img src={pin} className="w-5 mr-3" />
          {data.properties.address1}, {data.properties.address2}
        </span>
        <span aria-details="opening hours" className="flex">
          <img src={clock} className="w-5 mr-3" />
          <em className={`not-italic ${!data.properties.openingHours.opened && "text-red-500"}`}>
            {data.properties.openingHours.opened ? "Opened now" : "Closed now"}
          </em>
          <em className="text-gray-400">
            {!!data.properties.openingHours.schedule &&
              `\u00A0\u00A0${data.properties.openingHours.schedule}`}
          </em>
        </span>
      </address>
    </div>
  );
};

export default Shop;
