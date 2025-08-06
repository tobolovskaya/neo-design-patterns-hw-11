import { AbstractHandler } from '../AbstractHandler';
import { SystemErrorRecord } from '../../models/DataRecord';

export class MessageTrimmer extends AbstractHandler {
  protected process(record: SystemErrorRecord): SystemErrorRecord {
    const message = (record.message || '').trim().slice(0, 255);
    return { ...record, message };
  }
}