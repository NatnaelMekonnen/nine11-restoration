export const formatFileRequest = (
  req:
    | { [fieldname: string]: Express.Multer.File[] }
    | Express.Multer.File[]
    | undefined,
) => {
  if (Array.isArray(req)) {
    const formattedObj: { [key: string]: unknown } = {};

    for (const file of req) {
      if (file && file.fieldname) {
        formattedObj[file.fieldname] = file;
      }
    }

    if (Object.keys(formattedObj).length > 0) {
      return formattedObj;
    }

    return req;
  } else if (typeof req === "object" && req !== null) {
    const formattedObj: { [key: string]: unknown } = {};

    for (const key in req) {
      if (Object.prototype.hasOwnProperty.call(req, key)) {
        const innerFiles = req[key];
        if (Array.isArray(innerFiles)) {
          for (const file of innerFiles) {
            if (file && file.fieldname) {
              formattedObj[file.fieldname] = file;
            }
          }
        }
      }
    }

    if (Object.keys(formattedObj).length > 0) {
      return formattedObj;
    }

    return req;
  }

  return req;
};
