export const is = (element, type) => element?.["$type"] === type ?? false;
export const getBusinessObject = (element) => element?.businessObject ?? {};
