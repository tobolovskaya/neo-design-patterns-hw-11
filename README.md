# Data Processing Utility (HW11)

Консольна утиліта для обробки JSON-записів із використанням патернів **Chain of Responsibility** та **Mediator**.

## Структура проекту

```
/
├── data/
│   └── records.json            # Вхідний файл із записами
├── chain/
│   ├── AbstractHandler.ts      # Базовий клас ланцюга відповідальностей
│   ├── handlers/               # Окремі обробники (валідація, парсинг)
│   └── chains/                 # Функції побудови ланцюгів для типів записів
├── mediator/
│   ├── ProcessingMediator.ts   # Центральний посередник для запису
│   └── writers/                # Writers для різних форматів та rejected
├── models/
│   └── DataRecord.ts           # Інтерфейси для типів записів
├── output/                     # Папка згенерованих файлів
└── main.ts                     # Точка входу: читання, обробка, запис
```

## Використані патерни

* **Chain of Responsibility** (в `chain/`):

  * `AbstractHandler` + ланцюги обробників для кожного `type` (`access_log`, `transaction`, `system_error`).
  * Кожен `Handler` реалізує метод `process()` і кидає помилку при валідації.
* **Mediator** (в `mediator/ProcessingMediator.ts`):

  * Центральний об’єкт для маршрутизації успішних та відхилених записів до відповідних `Writer`-ів.
  * Після обробки кожного запису викликаються `onSuccess` або `onRejected`.

## Як запускати проєкт

1. Встановіть залежності:

   ```bash
   npm install
   ```
2. Запустіть утиліту:

   ```bash
   npx ts-node src/main.ts
   ```
3. Результати збережуться в папці `output/`:

   * `access_logs.json`
   * `transactions.csv`
   * `errors.jsonl`
   * `rejected.jsonl`

## Як додати новий тип запису

1. **Опис моделі**: додайте новий інтерфейс у `models/DataRecord.ts` з полем `type: 'new_type'` та відповідними полями.
2. **Створіть обробники**: у `chain/handlers/` реалізуйте класи-нащадки `AbstractHandler` для валідації/трансформації.
3. **Збірка ланцюга**: у `chain/chains/` додайте функцію `buildNewTypeChain()` та підключіть обробники через `setNext()`.
4. **Writer**: у `mediator/writers/` створіть `NewTypeWriter`, реалізуйте методи `write()` та `finalize()` для формату збереження.
5. **Mediator**: зареєструйте новий `NewTypeWriter` у `ProcessingMediator` та обробляйте `onSuccess` для `new_type`.
6. **main.ts**: додайте новий ключ у мапу `handlerMap` з `new_type: buildNewTypeChain`.

---

© 2025 Design Patterns 
