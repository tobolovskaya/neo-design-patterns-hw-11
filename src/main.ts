import * as fs from 'fs/promises';
import { buildAccessLogChain } from './chain/chains/AccessLogChain';
import { buildTransactionChain } from './chain/chains/TransactionChain';
import { buildSystemErrorChain } from './chain/chains/SystemErrorChain';
import { ProcessingMediator } from './mediator/ProcessingMediator';
import { AccessLogWriter } from './mediator/writers/AccessLogWriter';
import { TransactionWriter } from './mediator/writers/TransactionWriter';
import { ErrorLogWriter } from './mediator/writers/ErrorLogWriter';
import { RejectedWriter } from './mediator/writers/RejectedWriter';
import { DataRecord } from './models/DataRecord';
import { SOURCE_DIRECTORY } from './const';

const handlerMap = {
  access_log: buildAccessLogChain,
  transaction: buildTransactionChain,
  system_error: buildSystemErrorChain,
};

async function main() {
  // зчитування даних
  const records: DataRecord[] = JSON.parse(await fs.readFile(`${SOURCE_DIRECTORY}/records.json`, 'utf-8'));
  console.log(`[INFO] Завантажено записів: ${records.length}`);

  // створення mediator
  const mediator = new ProcessingMediator(
    new AccessLogWriter(),
    new TransactionWriter(),
    new ErrorLogWriter(),
    new RejectedWriter()
  );

  // цикл по records:
  //   - вибір handler-а через handlerMap
  //   - try/catch: handle + mediator.onSuccess/onRejected
  for (const record of records) {
    const builder = handlerMap[record.type];
    if (!builder) {
      mediator.onRejected(record, 'Unknown type');
      continue;
    }

    const handler = builder();

    try {
      const processed = handler.handle(record);
      mediator.onSuccess(processed);
    } catch (e: any) {
      mediator.onRejected(record, e.message);
    }
  }

  // finalize
  await mediator.finalize();
}

main();