import * as fs from 'fs/promises';
import { DataRecord } from '../../models/DataRecord';
import { OUTPUT_DIRECTORY } from '../../const';

export class RejectedWriter {
  private lines: string[] = [];
  write(record: DataRecord, error: string) {
    this.lines.push(JSON.stringify({ record, error }));
  }
  async finalize() {
    await fs.writeFile(`${OUTPUT_DIRECTORY}/rejected.jsonl`, this.lines.join('\n'));
  }
}