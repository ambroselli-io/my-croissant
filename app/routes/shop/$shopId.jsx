import { useEffect, useState } from "react";
import { useLoaderData, useTransition } from "remix";
import parsePhoneNumber from "libphonenumber-js";
import ShopObject from "../../../db/models/shop";
import MyMap from "../../services/mapbox";
import todayOpeningHours from "../../utils/opening-hours";
import ShopInfos from "../../components/ShopInfos";
import Tabs from "../../components/Tabs";
import ShopItems from "../../components/ShopItems";

const pictures = [
  "https://images.unsplash.com/photo-1607151815172-254f6b0c9b4b?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=MnwyOTE0MTR8MHwxfHJhbmRvbXx8fHx8fHx8fDE2NDIzNDQ3MzQ&ixlib=rb-1.2.1&q=80&w=1080",
  "https://images.unsplash.com/photo-1595397351604-cf490cc38bf1?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=MnwyOTE0MTR8MHwxfHJhbmRvbXx8fHx8fHx8fDE2NDIzNDQ3NTI&ixlib=rb-1.2.1&q=80&w=1080",
  "https://images.unsplash.com/photo-1577595927087-dedbe84f0e4d?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=MnwyOTE0MTR8MHwxfHJhbmRvbXx8fHx8fHx8fDE2NDIzNDQ3NjU&ixlib=rb-1.2.1&q=80&w=1080",
  "https://images.unsplash.com/photo-1532635224-cf024e66d122?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=MnwyOTE0MTR8MHwxfHJhbmRvbXx8fHx8fHx8fDE2NDIzNDQ3NzI&ixlib=rb-1.2.1&q=80&w=1080",
];

export const loader = async ({ params }) => {
  console.log("start fetchinf");
  await new Promise((res) => setTimeout(res, 1000));
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
  await new Promise((res) => setTimeout(res, 1000));

  return {
    data: {
      type: "Feature",
      id: shop._id,
      geometry: shop.location,
      properties: {
        _id: shop._id,
        title: shop.name,
        picture,
        address1: "Haarlemmerstraat 80",
        address2: "1013 EV Amsterdam",
        openingHours: todayOpeningHours(openingHours, shop.location.coordinates),
        phone: parsePhoneNumber("+31207371585").formatInternational(),
        website: "petitgateau.nl",
        description:
          'Petit Gateau (French for "small cake") is a pastry shop selling especially individual cakes. On the week-end though, some croissant and all',
        items: [
          {
            _id: 1,
            name: "Pain au Chocolat",
            ingredients: [
              {
                _id: 1,
                name: "Farine",
                quantity: "80%",
                supplier: "Moulins de France",
              },
              {
                _id: 2,
                name: "Beurre",
                quantity: "80%",
                supplier: "Beurrier de France",
              },
              {
                _id: 3,
                name: "Bâton de chocolat",
                quantity: "80%",
                supplier: "Beurrier de France",
              },
            ],
          },
        ],
      },
    },
  };
};

const Shop = () => {
  const { data } = useLoaderData();

  useEffect(() => {
    MyMap.addCurrentShopMarker(data);
  }, [data?.id]);

  const [activeTab, setActiveTab] = useState(0);

  return (
    <div className="max-w-sm w-full h-full bg-white drop-shadow-lg flex flex-col overflow-y-hidden">
      <img src={data.properties.picture} className="w-full h-60 object-cover" />
      <h1 className="font-bold px-4 mt-4 text-xl">{data.properties.title}</h1>
      <Tabs
        menu={["Menu", "About"]}
        className=" grow shrink overflow-y-hidden"
        activeTab={activeTab}
        setActiveTab={setActiveTab}>
        <div className="w-full h-full overflow-x-auto overflow-y-auto flex">
          <div
            style={{ transform: `translateX(${-activeTab * 100}%)` }}
            className="transition-transform h-full flex">
            <section className="w-full shrink-0  px-4 overflow-y-auto ">
              <ShopItems data={data} />
            </section>
            <section className="w-full shrink-0  px-4 overflow-y-auto ">
              <ShopInfos data={data} />
            </section>
          </div>
        </div>
      </Tabs>
    </div>
  );
};

export default Shop;
