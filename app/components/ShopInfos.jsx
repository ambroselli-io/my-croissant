import pin from "../assets/pin-grey.svg";
import clock from "../assets/clock-grey.svg";
import phone from "../assets/phone-grey.svg";
import web from "../assets/web-grey.svg";

const ShopInfos = ({ data }) => {
  return (
    <>
      <p
        aria-details="description of the shop text-[#3c4043]"
        className="px-4 mt-5 text-sm font-light">
        {data.properties.description}
      </p>
      <address className="flex flex-col px-4 mt-5 pb-11 text-[#3c4043] text-sm not-italic font-light items-start gap-2 justify-start">
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
        <span aria-details="phone" className="flex">
          <img src={phone} className="w-5 mr-3" />
          {data.properties.phone}
        </span>
        <span aria-details="website" className="flex">
          <img src={web} className="w-5 mr-3" />
          <a href={`https://${data.properties.website}`} className="underline" target="_blank">
            {data.properties.website}
          </a>
        </span>
      </address>
    </>
  );
};

export default ShopInfos;
