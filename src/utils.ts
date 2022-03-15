import BadWordsFilter from 'bad-words';

export const stripHtml = (str: string) => str?.replace(/<[^>]*>?/gm, '');

export const buildWordList = (badWordsFilter: BadWordsFilter): void => {
  // this package does not have a TS one, so I have to use 'require' here
  // eslint-disable-next-line @typescript-eslint/no-var-requires
  const frenchBadwordsList = require('french-badwords-list').array as Array<string>;
  badWordsFilter.addWords(...frenchBadwordsList);
};
