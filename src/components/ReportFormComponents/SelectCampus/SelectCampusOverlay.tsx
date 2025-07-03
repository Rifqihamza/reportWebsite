import { useCampusDataHook } from "../../../hooks/shared/useCampusData";
import { Campus } from "../../../types/variables";
import SelectCampusButton from "./SelectCampusButton";

import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay, EffectCoverflow, Pagination, Navigation } from "swiper/modules";
import "swiper/css";
import "swiper/css/effect-coverflow";
import "swiper/css/pagination";
import "swiper/css/navigation";

export default function SelectCampusOverlay() {
  const { selectedCampus } = useCampusDataHook();

  return (
    <div className={
      "fixed z-100 w-dvw h-dvh bg-black/90 backdrop-blur-md flex flex-col justify-center items-center duration-200" +
      (selectedCampus ? " opacity-0 pointer-events-none" : "")
    }>
      <div className="mb-6 text-center">
        <h1 className="text-3xl text-white">Pilih Kampus:</h1>
        <span className="text-white ">Klik Gambar untuk melanjutkan</span>
      </div>
      <Swiper
        effect={"coverflow"}
        autoplay={{
          delay: 1500,
          disableOnInteraction: true,
        }}
        coverflowEffect={{
          rotate: 0,
          stretch: 0,
          depth: 500,
          modifier: 1,
          slideShadows: false,
        }}
        pagination={{
          clickable: true,
        }}
        navigation={true}
        loop={true}
        slidesPerView={1}
        spaceBetween={-950}
        centeredSlides={true}
        modules={[EffectCoverflow, Autoplay, Pagination, Navigation]}
        className="w-full [&_.swiper-button-prev,_.swiper-button-next]:z-100 md:[&_.swiper-button-prev]:translate-x-10 md:[&_.swiper-button-next]:-translate-x-10"
        style={
          {
            "--swiper-pagination-color": "#FFBA08",
            "--swiper-pagination-bullet-inactive-color": "#fff",
            "--swiper-pagination-bullet-inactive-opacity": "1",
            "--swiper-pagination-bottom": "15px",
            "--swiper-navigation-color": "#fff",
          } as any
        }
      >
        {Object.values(Campus).map((value) => (
          <SwiperSlide key={value}>
            <SelectCampusButton label={value} value={value} />
          </SwiperSlide>
        ))}
        <div className="z-10 pointer-events-none bg-[linear-gradient(to_right,rgba(0,_0,_0,_1),rgba(0,_0,_0,_0)_20%,rgba(0,_0,_0,_0)_80%,rgba(0,_0,_0,_1))] w-full h-full absolute top-0 left-0"></div>
      </Swiper>
    </div >
  );
}
