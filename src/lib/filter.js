import _ from "lodash";

const filterLib = (payload, filter) => {
  const {
    keyword,
    size,
    event,
    style,
    price,
    material,
    categoryCode,
    page,
    limit,
  } = filter;

  const resolveSize = [];
  const resolveEvent = [];
  const resolveStyle = [];
  const resolvePrice = [];
  const resolveMaterial = [];

  for (const item in size) {
    if (size[item]) resolveSize.push(item);
  }

  for (const item in event) {
    if (event[item]) resolveEvent.push(item);
  }

  for (const item in material) {
    if (material[item]) resolveMaterial.push(item);
  }

  for (const item in style) {
    if (style[item]) resolveStyle.push(item);
  }

  for (const item in price) {
    if (price[item]) resolvePrice.push(item);
  }

  const filterPayload = payload.filter((item) => {
    const isMatchCategoryCode = item.categoryCode === categoryCode;
    const isContainSize = resolveSize.includes(item.size);

    const isContainEvent = resolveEvent.includes(item.event);
    const isContainStyle = resolveStyle.includes(item.style);
    const isContainMaterial = resolveMaterial.includes(item.material);

    let isContainPrice = false;
    resolvePrice.forEach((price) => {
      const splitPrice = price.split(",");
      const fromPrice = Number(splitPrice[0]);
      const toPrice = Number(splitPrice[1]);
      if (item.price >= fromPrice && item.price <= toPrice)
        isContainPrice = true;
    });

    let isContainKeyword = true;
    if (keyword)
      isContainKeyword = item.name
        .toLowerCase()
        .includes(keyword.toLowerCase());

    if (
      isMatchCategoryCode &&
      isContainEvent &&
      isContainSize &&
      isContainMaterial &&
      isContainPrice &&
      isContainStyle &&
      isContainKeyword
    )
      return item;
  });

  const chunkPayload = _.chunk(filterPayload, 10);

  const resolvePayload =
    chunkPayload[page - 1] >= 0 ? chunkPayload[page - 1] : chunkPayload[0];
  const totalPage = Math.ceil(filterPayload.length / 10);

  return {
    resolvePayload: resolvePayload || [],
    resolveMeta: {
      currentPage: page,
      limit,
      totalItems: filterPayload.length,
      totalPage,
    },
  };
};

export default filterLib;
