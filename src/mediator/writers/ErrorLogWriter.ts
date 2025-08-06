import * as fs from 'fs/promises';
import { SystemErrorRecord } from '../../models/DataRecord';
import { OUTPUT_DIRECTORY } from '../../const';

export class ErrorLogWriter {
  private lines: string[] = [];
  write(record: SystemErrorRecord) {
    this.lines.push(JSON.stringify(record));
  }
  async finalize() {
    await fs.writeFile(`${OUTPUT_DIRECTORY}/errors.jsonl`, this.lines.join('\n'));
  }
}