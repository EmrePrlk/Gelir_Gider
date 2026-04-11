export const phoneRegex = () =>
  /^\+?(\d{1,3})?[ (.-]?(\d{1,4})[ ).-]?(\d{1,4})[ .-]?(\d{1,9})(?: *x(\d+))?$/;

export const linkRegex = (domain: string, extension: string) =>
  new RegExp(`^https://(www.)?${domain}.${extension}/.*`);

export const linkedinRegex = /^https:\/\/(www.)?linkedin.com\/in\/.*/;

export const githubRegex = linkRegex('github', 'com');

export const twitterRegex = linkRegex('twitter', 'com');

export const instagramRegex = linkRegex('instagram', 'com');

export const facebookRegex = linkRegex('facebook', 'com');

export const youtubeRegex = linkRegex('youtube', 'com');
