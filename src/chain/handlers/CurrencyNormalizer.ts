import { AbstractHandler } from '../AbstractHandler';
import { TransactionRecord } from '../../models/DataRecord';

export class CurrencyNormalizer extends AbstractHandler {
  protected process(record: TransactionRecord): TransactionRecord {
    const { currency } = record;
    if (!currency || !/^[a-zA-Z]{3}$/.test(currency)) {
      throw new Error('Missing or invalid currency');
    }
    return { ...record, currency: currency.toUpperCase() };
  }
}