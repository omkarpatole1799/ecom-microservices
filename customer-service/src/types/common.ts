export interface ApiResponse<T> {
  success: boolean;
  usrMsg?: string;
  data?: T;
  errMsg?: string;
}

export interface JwtPayloadInterface {
  id: string | undefined;
  email: string | undefined;
  name: string | undefined;
}

export interface OrderItem {
  id: string;
  productId: string;
  name: string;
  price: number;
  quantity: number;
}

export interface Order {
  id: string;
  userId: string;
  items: OrderItem[];
  totalAmount: number;
  status: string;
  createdAt: string;
  name: string;
  address: string;
  phone: string;
}
