const appError = require("./appError");

// utils/filter.js
const validCategories = ["Electronics", "Clothing", "Home", "Books", "Sports"];

const getCategoryFilter = (queryCategory, next) => {
  if (!queryCategory) return {};

  const normalized =
    queryCategory.charAt(0).toUpperCase() +
    queryCategory.slice(1).toLowerCase();

  if (!validCategories.includes(normalized)) {
    return next(appError.create("Invalid category", 400, "Fail"));
  }

  return { category: normalized };
};

const validStatuses = ["Pending", "Shipped", "Delivered", "Cancelled"];

const getStatusFilter = (queryStatus, next) => {
  if (!queryStatus) return {};

  const normalized =
    queryStatus.charAt(0).toUpperCase() + queryStatus.slice(1).toLowerCase();

  if (!validStatuses.includes(normalized)) {
    return next(appError.create("Invalid status", 400, "Fail"));
  }

  return { status: normalized };
};

module.exports = { getCategoryFilter, getStatusFilter };
