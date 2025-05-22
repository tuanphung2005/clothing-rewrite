'use client'

import { Swiper, SwiperSlide } from 'swiper/react';
import { Autoplay, EffectFade } from 'swiper/modules';
import { Image } from "@heroui/image";
import { ProductImageSliderProps } from "@/types/mainPage";
import type { Swiper as SwiperType } from 'swiper/types';
import { useRef } from 'react';

import 'swiper/css';
import 'swiper/css/effect-fade';

export const ProductImageSlider = ({ images, alt }: ProductImageSliderProps) => {
  
    const swiperRef = useRef<SwiperType | null>(null);
    const getRandomDelay = () => Math.floor(Math.random() * 3000) + 2000;
    const handleSlideChange = () => {
        if (swiperRef.current && swiperRef.current.autoplay) {
        swiperRef.current.autoplay.stop();
        swiperRef.current.autoplay.start();
        }
  };
  
    return (
    <Swiper
      modules={[Autoplay, EffectFade]}
      effect="flip"
      autoplay={{
        delay: getRandomDelay(),
        disableOnInteraction: false,
      }}
      loop={true}
      className="w-full h-full"
      onSlideChange={handleSlideChange}
    >
      {images.map((image, index) => (
        <SwiperSlide key={index}>
          <Image
            alt={`${alt} - ${index + 1}`}
            className="w-full h-full object-cover"
            radius="none"
            width="100%"
            src={image}
          />
        </SwiperSlide>
      ))}
    </Swiper>
  );
};