import type { Video } from "@/lib/tmdb/types/common";

export function prioritizePlayableVideos(videos: Video[]): Video[] {
  const priority = (video: Video) => {
    switch (video.type.toLowerCase()) {
      case "trailer":
        if (
          video.official &&
          video.name?.trim().toLowerCase() === "official trailer"
        ) {
          return 5;
        }
        return video.official ? 4 : 3;
      case "teaser":
        return 2;
      case "clip":
        return 1;
      default:
        return 0;
    }
  };

  return videos
    .filter((video) => video.site.toLowerCase() === "youtube" && video.key)
    .sort((a, b) => priority(b) - priority(a));
}
