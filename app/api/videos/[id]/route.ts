import { json } from "../../../lib/api";
import { getVideo, videos } from "../../../lib/data";
import { notFoundJson } from "../../../lib/http";

export function generateStaticParams() {
  return videos.map((video) => ({ id: video.id }));
}

export async function GET(
  _request: Request,
  ctx: RouteContext<"/api/videos/[id]">,
) {
  const { id } = await ctx.params;
  const video = getVideo(id);
  if (!video) return notFoundJson();
  return json(video);
}
