import * as fs from 'fs/promises';
import { TransactionRecord } from '../../models/DataRecord';
import { OUTPUT_DIRECTORY } from '../../const';

export class TransactionWriter {
  private lines: string[] = ['timestamp,amount,currency'];
  write(record: TransactionRecord) {
    this.lines.push(`${record.timestamp},${record.amount},${record.currency}`);
  }
  async finalize() {
    await fs.writeFile(`${OUTPUT_DIRECTORY}/transactions.csv`, this.lines.join('\n'));
  }
}