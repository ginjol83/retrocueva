import imagesData from "../../db/gameboy/images.json";

export interface GbImageAsset {
  region: string;
  regionLabel: string;
  url: string;
}

export interface GbGameImages {
  covers?: GbImageAsset[];
  snaps?: GbImageAsset[];
}

interface GbImagesData {
  generated: string;
  source: string;
  coverage: { entries: number; withCover: number; withSnaps: number };
  games: Record<string, GbGameImages>;
}

const data = imagesData as unknown as GbImagesData;

export const gbImagesCoverage = data.coverage;
export const gbImagesSource = data.source;

export function imagesFor(id: number): GbGameImages | undefined {
  return data.games[String(id)];
}
