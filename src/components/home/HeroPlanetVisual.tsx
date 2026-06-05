import Image from "next/image";
import { HOME_ASSETS } from "@/lib/home-content";

/** 원본 1024×698 — 이 크기 이상으로 늘리지 않아 흐림 방지 */
const PLANET_WIDTH = 1024;
const PLANET_HEIGHT = 698;

export default function HeroPlanetVisual() {
  return (
    <div className="relative mx-auto w-full max-w-[1024px] lg:mx-0 lg:justify-self-end">
      <Image
        src={HOME_ASSETS.planetHero}
        alt="UARION 행성 궤도 비주얼"
        width={PLANET_WIDTH}
        height={PLANET_HEIGHT}
        quality={100}
        priority
        unoptimized
        sizes="(max-width: 1024px) 100vw, 1024px"
        className="h-auto w-full max-w-[1024px] object-contain"
      />
    </div>
  );
}
