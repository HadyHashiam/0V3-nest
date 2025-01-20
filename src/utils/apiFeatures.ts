export class ApiFeatures {
  private mongooseQuery: any;
  private queryString: any;
  public paginationResult: any;

  constructor(mongooseQuery: any, queryString: any) {
    this.mongooseQuery = mongooseQuery;
    this.queryString = queryString;
  }

  filter() {
    const queryStringObj = { ...this.queryString };
    const excludesFields = ['page', 'sort', 'limit', 'fields'];
    excludesFields.forEach((field) => delete queryStringObj[field]);

    let queryStr = JSON.stringify(queryStringObj);
    queryStr = queryStr.replace(/\b(gte|gt|lte|lt)\b/g, (match) => `$${match}`);

    this.mongooseQuery = this.mongooseQuery.find(JSON.parse(queryStr));
    return this;
  }

  sort() {
    if (this.queryString.sort) {
      const sortBy = this.queryString.sort.split(',').join(' ');
      this.mongooseQuery = this.mongooseQuery.sort(sortBy);
    } else {
      this.mongooseQuery = this.mongooseQuery.sort('-createdAt');
    }
    return this;
  }

  limitFields() {
    if (this.queryString.fields) {
      const fields = this.queryString.fields.split(',').join(' ');
      this.mongooseQuery = this.mongooseQuery.select(fields);
    } else {
      this.mongooseQuery = this.mongooseQuery.select('-__v');
    }
    return this;
  }

  search(modelName: string) {
    if (this.queryString.keyword) {
      let query: any = {};
      if (modelName === 'Products') {
        query.$or = [
          { title: { $regex: this.queryString.keyword, $options: 'i' } },
          { description: { $regex: this.queryString.keyword, $options: 'i' } },
        ];
      } else {
        query = { name: { $regex: this.queryString.keyword, $options: 'i' } };
      }
      this.mongooseQuery = this.mongooseQuery.find(query);
    }
    return this;
  }

  paginate(countDocuments: number) {
    const page = this.queryString.page * 1 || 1;
    const limit = this.queryString.limit * 1 || 50;
    const skip = (page - 1) * limit;

    this.paginationResult = {
      currentPage: page,
      limit,
      numberOfPages: Math.ceil(countDocuments / limit),
    };

    if (page * limit < countDocuments) {
      this.paginationResult.next = page + 1;
    }

    if (skip > 0) {
      this.paginationResult.prev = page - 1;
    }

    this.mongooseQuery = this.mongooseQuery.skip(skip).limit(limit);
    return this;
  }

  getQuery() {
    return this.mongooseQuery;
  }
}
