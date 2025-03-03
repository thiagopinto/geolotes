export class PaginationResponseDto<T> {
  data: T[];
  meta: {
    total: number;
    page: number;
    perPage: number;
    totalPages: number;
    firstPage: number;
    lastPage: number;
  };

  constructor(data: T[], total: number, page: number, perPage: number) {
    this.data = data;
    this.meta = {
      total: parseInt(`${total}`),
      page: parseInt(`${page}`),
      perPage: parseInt(`${perPage}`),
      totalPages: Math.ceil(total / perPage),
      firstPage: 1,
      lastPage: Math.ceil(total / perPage),
    };
  }
}
