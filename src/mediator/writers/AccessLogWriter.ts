import * as fs from 'fs/promises';
import { AccessLogRecord } from '../../models/DataRecord';
import { OUTPUT_DIRECTORY } from '../../const';

export class AccessLogWriter {
  private records: AccessLogRecord[] = [];
  write(record: AccessLogRecord) {
    this.records.push(record);
  }
  async finalize() {
    await fs.writeFile(`${OUTPUT_DIRECTORY}/access_logs.json`, JSON.stringify(this.records, null, 2));
  }
}