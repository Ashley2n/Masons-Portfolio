"use client";
import Image from "next/image";
import { useState } from "react";
import { modelShots } from "@/content/home";
import { getNextIndex } from "@/lib/carousel";
import type { ModelShot } from "@/types/content";

type ModelPreviewShotProps = {
  shot: ModelShot;
  handleOnClick: () => void;
};

const ModelPreviewShot = ({ shot, handleOnClick }: ModelPreviewShotProps) => (
  <div className="w-16 h-16 rounded-lg" onClick={handleOnClick}>
    <Image
      src={shot.src}
      alt={shot.alt}
      className="bg-cover bg-center w-full h-14 rounded-lg border-2 hover:border-brand-600"
      width={0}
      height={0}
    />
  </div>
);

export default function ModelShotsCarousel() {
  const [currentImage, setCurrentImage] = useState<ModelShot>(modelShots[0]);

  const nextImage = (shot: ModelShot) => {
    const currentIndex = modelShots.indexOf(shot);
    setCurrentImage(modelShots[getNextIndex(currentIndex, modelShots.length)]);
  };

  return (
    <section className="h-screen bg-neutral-100 px-23 py-16 ">
      <div>
        <div className="bg-linear-to-l from-purple-600 to-blue-500 ">
          <button className="w-12" onClick={() => nextImage(currentImage)}>
            →
          </button>
          <Image
            src={currentImage.src}
            width={100}
            height={100}
            alt={currentImage.alt}
            className="bg-neutral-700 rounded-lg bg-center bg-cover w-full h-100"
          />
          <button>→</button>
        </div>

        <div className="flex justify-center mt-2">
          {modelShots.map((s) => (
            <ModelPreviewShot
              key={s.id}
              shot={s}
              handleOnClick={() => setCurrentImage(s)}
            />
          ))}
        </div>
      </div>
    </section>
  );
}
