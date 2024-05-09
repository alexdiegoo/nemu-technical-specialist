import { v4 as uuidv4 } from 'uuid';

import { convertDateToString } from '../utils/convertDateToString';
import { parseUtmContent, preventAnotherSeparatorsThanPipe } from '../utils/formatUTMs';
import { ProductJsonRepository } from '../repositories/ProductDataRepository';
import { NemuPayload } from './NemuPayload';
import { BaseProcessDTO } from './BaseProcessDTO';

export class NemuWorker {

  private productDataRepository: ProductJsonRepository; // Repositório de dados de produtos

  constructor(productDataRepository: ProductJsonRepository) {
    this.productDataRepository = productDataRepository;
  }
 
  private hasInvalidRequest = (payload: NemuPayload): boolean => {
    const invalidPaymentStatus = ['refused'];

    if (invalidPaymentStatus.includes(payload.status)) {
      return true;
    }

    return false;
  };

  async process({ payload }: BaseProcessDTO<NemuPayload>) {
    if (this.hasInvalidRequest(payload)) {
      return 'Request invalid';
    }

    const productDataAlreadyExists = await this.productDataRepository.getBy(
      payload.transaction_id
    );

    const paymentType = this.parsePaymentMethod(payload.method);

    const paymentStatus = this.parsePaymentStatus(payload.status);

    const gross_value = Number(payload.total_price);

    const liquid_value = Number(payload.total_price);

    if (productDataAlreadyExists) {
      productDataAlreadyExists.status = paymentStatus;
      await this.productDataRepository.updateById(productDataAlreadyExists.id, productDataAlreadyExists);

      return `Transaction ${productDataAlreadyExists.transactionId} updated`;
    }

    const utm_content = preventAnotherSeparatorsThanPipe(this.convertParams(payload.checkout.utm_content));
    const utm_campaign = preventAnotherSeparatorsThanPipe(this.convertParams(payload.checkout.utm_campaign));
    const utm_medium = preventAnotherSeparatorsThanPipe(this.convertParams(payload.checkout.utm_medium));
    const utm_source = preventAnotherSeparatorsThanPipe(this.convertParams(payload.checkout.utm_source));

    const { content, term } = parseUtmContent(utm_content, "\\");

    const product = await this.productDataRepository.add({
      id: uuidv4(),
      transactionId: payload.transaction_id,
      name: payload.plans[0].name,
      value: liquid_value,
      status: paymentStatus,
      quantity: 1,
      paymentType,
      campaign: utm_campaign,
      content,
      medium: utm_medium,
      term: term || this.convertParams(payload.checkout.utm_term),
      src: utm_source,
      customerEmail: payload.customer?.email,
      customerName: payload.customer?.name,
      customerPhone: payload.customer?.phone,
      date: convertDateToString(new Date(payload.created_at.replaceAll(' =>', ':'))),
      gross_value,
      origin: 'nemu',
    });


    return `Transaction ${product.transactionId} created`;
  }

  private convertParams = (utm: string): string => {
    if (!utm || utm.includes('|')) {
      return utm;
    }

    return utm.replace('\\', '|');
  };

  private parsePaymentMethod = (payment_type: string): string => {
    const mappings: {
      [key: string]: string;
    } = {
      boleto: 'billet',
      pix: 'pix',
      credit_card: 'credit_card',
    };

    return mappings[payment_type] || payment_type;
  };

  private parsePaymentStatus = (payment_enum: string): string => {
    const mappings: { [key in string]: string } = {
      approved: 'paid',
      pending: 'waiting_payment',
      charge_back: 'chargeback',
      refunded: 'refunded',
      canceled: 'cancelled',
    };

    return mappings[payment_enum] || payment_enum;
  };
}