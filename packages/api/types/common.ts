export type PageInfo = {
  total: number;
  current_page: number;
  page_size: number;
  number_of_pages: number;
};

export interface IPaginatedResponse<T> extends PageInfo {
  data: T[];
}

// 대기 중인 항목 수를 포함하는 페이지네이션 응답 타입
export interface IPaginatedResponseWithPending<T>
  extends IPaginatedResponse<T> {
  pending_orders_count?: number;
  pending_transactions_count?: number;
}
