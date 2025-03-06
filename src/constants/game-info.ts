export interface GameVersion {
  VERSION: string;
  LAST_UPDATED: string;
}

export interface ExternalLinks {
  GITHUB: string;
  FEEDBACK: string;
  HOMEPAGE: string;
}

export interface SharingInfo {
  TITLE: string;
  DESCRIPTION: string;
  HASHTAGS: string;
  IMAGE_URL: string;
}

export interface ResultTemplates {
  WIN_WAVE: string;
  WIN_PARTICLE: string;
  DRAW: string;
}

export type GameResultType = keyof ResultTemplates | null;

export type SocialPlatform = "x" | "facebook" | "linkedin" | "default";

export const GAME_VERSION: GameVersion = {
  VERSION: "1.0.0",
  LAST_UPDATED: "2025-03-06",
};

export const EXTERNAL_LINKS: ExternalLinks = {
  GITHUB: "https://github.com/shine-jung/quantum-gomoku",
  FEEDBACK: "https://forms.gle/zZaqoVf8WY6PMKqP8",
  HOMEPAGE: "https://quantum-gomoku.vercel.app",
};

export const SHARING_INFO: SharingInfo = {
  TITLE: "양자 오목 게임을 해보세요!",
  DESCRIPTION:
    "양자 물리학의 원리를 활용한 전략 보드 게임, 지금 플레이해보세요!",
  HASHTAGS: "양자오목,퀀텀게임,보드게임",
  IMAGE_URL: "https://quantum-gomoku.vercel.app/og-image.png",
};

export const RESULT_TEMPLATES: ResultTemplates = {
  WIN_WAVE: "파동팀으로 양자 오목 게임에서 승리했습니다! 🌊",
  WIN_PARTICLE: "입자팀으로 양자 오목 게임에서 승리했습니다! 🔴",
  DRAW: "양자 오목 게임에서 흥미로운 무승부 결과가 나왔습니다! ⚖️",
};

export const getSocialShareUrl = (
  platform: SocialPlatform,
  result: GameResultType = null
): string => {
  const baseUrl = window.location.href;
  const shareText = result ? RESULT_TEMPLATES[result] : SHARING_INFO.TITLE;

  switch (platform) {
    case "x":
      return `https://x.com/intent/post?text=${encodeURIComponent(
        shareText
      )}&url=${encodeURIComponent(baseUrl)}&hashtags=${encodeURIComponent(
        SHARING_INFO.HASHTAGS.split(",").join(",")
      )}`;
    case "facebook":
      return `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(
        baseUrl
      )}`;
    case "linkedin":
      return `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(
        baseUrl
      )}`;
    default:
      return baseUrl;
  }
};
