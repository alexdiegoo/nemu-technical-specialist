import { ProductData } from './IProductData';

export interface ProductDataRepository {
  add(productData: ProductData): Promise<ProductData>;
  updateById(id: string, newData: ProductData): Promise<void>;
  getBy(transactionId: string): Promise<ProductData | undefined>;
}
