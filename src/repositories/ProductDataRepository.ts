import fs from 'fs';
import { ProductData } from './IProductData';
import { ProductDataRepository } from './IProductDataRepository';

export class ProductJsonRepository implements ProductDataRepository {
  private filePath: string;

  constructor(filePath: string) {
    this.filePath = filePath;
  }

  async add(productData: ProductData): Promise<ProductData> {
    const products = await this.loadProducts();
    products.push(productData);
    await this.saveProducts(products);
    return productData;
  }

  async updateById(id: string, newData: ProductData): Promise<void> {
    let products = await this.loadProducts();
    const index = products.findIndex(product => product.id === id);
    if (index !== -1) {
      products[index] = newData;
      await this.saveProducts(products);
    } else {
      throw new Error(`Product with id ${id} not found.`);
    }
  }

  async getBy(transactionId: string): Promise<ProductData | undefined> {
    const products = await this.loadProducts();
    return products.find(product =>
      product.transactionId === transactionId
    );
  }

  private async loadProducts(): Promise<ProductData[]> {
    return new Promise((resolve, reject) => {
      fs.readFile(this.filePath, 'utf8', (err, data) => {
        if (err) {
          if (err.code === 'ENOENT') {
            // If the file does not exist, return an empty array
            resolve([]);
          } else {
            reject(err);
          }
        } else {
          try {
            resolve(JSON.parse(data));
          } catch (parseError) {
            reject(parseError);
          }
        }
      });
    });
  }

  private async saveProducts(products: ProductData[]): Promise<void> {
    return new Promise((resolve, reject) => {
      fs.writeFile(this.filePath, JSON.stringify(products, null, 2), 'utf8', err => {
        if (err) {
          reject(err);
        } else {
          resolve();
        }
      });
    });
  }
}
