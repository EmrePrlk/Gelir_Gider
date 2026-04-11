export const imageMocker = {
  image: {
    cover: (index: number) => `/assets/images/cover/cover_${index + 1}.jpg`,
    avatar: (index: number) => `/assets/images/avatar/avatar_${index + 1}.jpg`,
    travel: (index: number) => `/assets/images/travel/travel_${index + 1}.jpg`,
    company: (index: number) =>
      `/assets/images/company/company_${index + 1}.png`,
    product: (index: number) =>
      `/assets/images/m_product/product_${index + 1}.jpg`,
    portrait: (index: number) =>
      `/assets/images/portrait/portrait_${index + 1}.jpg`,
  },
};
