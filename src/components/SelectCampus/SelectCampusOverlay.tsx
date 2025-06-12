import { useCampusDataHook } from "../../hooks/shared/useCampusData";
import { Campus } from "../../types/variables";
import SelectCampusButton from "./SelectCampusButton";

import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay, EffectCoverflow, Pagination } from "swiper/modules";
import "swiper/css";
import "swiper/css/effect-coverflow";
import "swiper/css/pagination";

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
        loop={true}
        slidesPerView={1}
        spaceBetween={-950}
        centeredSlides={true}
        modules={[EffectCoverflow, Autoplay, Pagination]}
        className="w-full MyGradient"
        style={
          {
            "--swiper-pagination-color": "#FFBA08",
            "--swiper-pagination-bullet-inactive-color": "#fff",
            "--swiper-pagination-bullet-inactive-opacity": "1",
            "--swiper-pagination-bottom": "15px",
          } as any
        }
      >
        {Object.values(Campus).map((value) => (
          <SwiperSlide key={value}>
            <SelectCampusButton label={value} value={value} />
          </SwiperSlide>
        ))}
      </Swiper>
    </div>
  );
}
