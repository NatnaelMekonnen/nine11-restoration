/* eslint-disable @typescript-eslint/no-explicit-any */
import _ from "lodash";
import { errorLogger } from "../utils/logger";
import { Request } from "express";
import { Model } from "mongoose";

interface IConditions extends Record<string, any> {
  populate?: string;
  limit?: string;
  offset?: string;
  orderBy?: string;
  order?: string;
  $or?: Record<any, any>[];
  createdAt?: string | Record<any, any>;
}

function processPopulate(query: string) {
  const paths = query.split(".");
  let currentPopulate;
  while (paths.length) {
    const path = paths.pop();
    const populate = { path };
    if (currentPopulate) {
      currentPopulate = { path, populate: currentPopulate };
    } else {
      currentPopulate = populate;
    }
  }

  return currentPopulate;
}

const get = async (
  model: any,
  req: { params?: any; query?: any },
  conditions: IConditions = {},
  multiple = true,
): Promise<any> => {
  let { query } = req;
  const populate = query.populate ? query.populate : conditions.populate;
  let limit = query.limit ? query.limit : conditions.limit;
  let offset = query.offset ? query.offset : conditions.offset;
  limit = parseInt(query.limit || "10", 10);
  offset = parseInt(query.offset || "0", 10);
  const orderBy =
    query.orderBy || conditions.orderBy
      ? query.orderBy || conditions.orderBy
      : "createdAt";
  const order =
    query.order || conditions.order ? query.order || conditions.order : "desc";
  if (query.searchBy && query.keyword) {
    const searchBy = query.searchBy.split(",");
    const searchCondition: { [x: number]: RegExp }[] = [];

    searchBy.forEach((search: any) => {
      searchCondition.push({
        [search]: new RegExp(query.keyword, "i"),
      });
    });

    conditions = {
      ...conditions,
      $or: searchCondition,
    };
  }

  if (query.filterBy && query.filterValue) {
    const filterBy = query.filterBy.split(",");
    const filterValue = query.filterValue.split(",");

    filterBy.forEach((filter: any, i: string | number) => {
      conditions = {
        ...conditions,
        [filter]: filterValue[i],
      };
    });
  }

  if (query.range) {
    const range = query.range.split(",");
    conditions = {
      ...conditions,
      createdAt: {
        $gte: range[0],
        $lte: range[1],
      },
    };
  }

  query = _.omit(query, [
    "limit",
    "offset",
    "orderBy",
    "order",
    "populate",
    "searchBy",
    "keyword",
    "filterBy",
    "filterValue",
    "range",
  ]);
  conditions = _.omit(conditions, [
    "limit",
    "offset",
    "orderBy",
    "order",
    "populate",
    "searchBy",
    "keyword",
    "filterBy",
    "filterValue",
    "range",
  ]);
  /* Converting the query string to a boolean value. */
  if (!_.isEmpty(query)) {
    Object.keys(query).forEach((field) => {
      let value = query[field];
      switch (value) {
        case "true":
          value = true;
          conditions[field] = value;
          break;

        case "false":
          value = false;
          conditions[field] = value;
          break;

        default:
          break;
      }
    });
  }
  if (!multiple && !conditions._id) {
    const { params } = req;
    const paramId = Object.keys(params).find((param) =>
      param.toLowerCase().includes("id"),
    );
    if (paramId) conditions._id = req.params[paramId];
  }
  let modelQuery = model[multiple ? "find" : "findOne"](conditions);

  if (populate) {
    try {
      if (Array.isArray(populate) && populate.length) {
        populate.forEach((field) => {
          modelQuery = modelQuery.populate(processPopulate(field));
        });
      } else {
        modelQuery = modelQuery.populate(processPopulate(populate));
      }
    } catch (error) {
      errorLogger.log(error);
    }
  }

  if (multiple) {
    const total = await model.countDocuments({
      ...conditions,
      isDeleted: { $ne: true },
    });
    modelQuery = modelQuery
      .skip(offset)
      .limit(limit)
      .sort({ [orderBy]: order });
    const data = await modelQuery.skip(offset).limit(limit);
    return {
      data,
      meta: { limit, offset, total },
    };
  }

  return modelQuery;
};

export const find = async (
  model: typeof Model<any>,
  req: Request | any,
  conditions: Record<string, any> = {},
) => get(model, req, conditions, true);

export const findOne = async (
  model: typeof Model<any>,
  req: Request | any,
  conditions: Record<string, any> = {},
) => get(model, req, conditions, false);
