export type PageList<T> = {
    items: T[];

    totalCount: number;
    page: number;
    pageSize: number;
    successfulCollations: number;
    averageAccuracy: number;

    hasNextPage: boolean;
    hasPreviousPage: boolean;
}