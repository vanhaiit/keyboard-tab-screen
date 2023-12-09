import { IPost, PostContentType } from '../types/Post';
import clip from 'text-clipper';

const seeMoreButton =
  '<a href="#" id="more-button" class="more-button"> More</a>';
const seeLessButton =
  '<a href="#" id="less-button" class="more-button"> Less</a>';
const maxLengthContent = 140;
const trendingLengthContent = 500;
const shortTrendingLengthContent = 70;
const includesScriptTags = ['p', 'a', 'div'];

type Mode = 'Trending' | 'Post';

const getContent = (
  mode: Mode,
  maxLength: number,
  text: {
    htmlContent: string;
    length: number;
  },
) => {
  if (mode === 'Trending') {
    const textString = clip(text.htmlContent, maxLength, {
      html: true,
      stripTags: includesScriptTags,
    });
    return {
      shortContent:
        text.length > maxLength ? textString + seeMoreButton : textString,
      content:
        text.length > maxLength
          ? text.htmlContent + seeLessButton
          : text.htmlContent,
    };
  } else {
    const textString = clip(text.htmlContent, maxLength, {
      html: true,
      stripTags: includesScriptTags,
    });

    return {
      shortContent:
        text.length > maxLength ? textString + seeMoreButton : text.htmlContent,
      content:
        text.length > maxLength
          ? text.htmlContent + seeLessButton
          : text.htmlContent,
    };
  }
};

export const convertPostData = (
  { data: { content }, medias }: IPost,
  mode: Mode,
) => {
  const texts = content.filter(
    item => item.type === 'text' || item.type === 'link',
  );
  const rawMedias = content.filter(
    item => item.type === 'video' || item.type === 'image',
  );
  const links = content.filter(item => item.type === 'link');

  const newMedias = rawMedias
    .map(item => {
      const foundMedia = medias.find(media => {
        if (typeof item.files![0] === 'object') {
          return media.id === item.files![0][0];
        }
        return media.id === item.files![0];
      });
      if (foundMedia) {
        return {
          type: item.type,
          url: foundMedia.url,
        };
      }
      return null;
    })
    .filter(item => !!item) as {
    type: PostContentType;
    url: string;
  }[];

  const text = texts.reduce(
    ({ htmlContent, length }, item) => {
      if (item.type === 'link') {
        return {
          htmlContent:
            (htmlContent += `<a href="${item.link}" target="__blank">${item.link}</a>`),
          length: (length += (item.link || '').length),
        };
      }
      return {
        htmlContent: (htmlContent += item.htmlContent),
        length: (length += (item.rawContent || '').replace('\\n', '').length),
      };
    },
    {
      htmlContent: '',
      length: 0,
    },
  );

  const trendingContentLength =
    newMedias.length > 0
      ? shortTrendingLengthContent
      : links.length > 0
      ? maxLengthContent
      : trendingLengthContent;

  const maxLength = mode === 'Post' ? maxLengthContent : trendingContentLength;

  const htmlText = getContent(mode, maxLength, text);

  return {
    newMedias: newMedias,
    textHtml: htmlText.content,
    shortContent: htmlText.shortContent,
    links,
  };
};
