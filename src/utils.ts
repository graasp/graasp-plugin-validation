export const stripHtml = (str: string) => str?.replace(/<[^>]*>?/gm, '');