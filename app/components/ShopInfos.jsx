import Availability from "./Availability";

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
          <img src="/assets/pin-grey.svg" className="w-5 mr-3" />
          {data.properties.address1}, {data.properties.address2}
        </span>
        <Availability hours={data.properties.openingHours} />
        <span aria-details="phone" className="flex">
          <img src="/assets/phone-grey.svg" className="w-5 mr-3" />
          {data.properties.phone}
        </span>
        <span aria-details="website" className="flex">
          <img src="/assets/web-grey.svg" className="w-5 mr-3" />
          <a href={`https://${data.properties.website}`} className="underline" target="_blank">
            {data.properties.website}
          </a>
        </span>
      </address>
    </>
  );
};

export default ShopInfos;
