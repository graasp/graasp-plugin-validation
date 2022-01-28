import { sql, DatabaseTransactionConnection as TrxHandler } from 'slonik';
import { ItemValidation } from './types';
/**
 * Database's first layer of abstraction for content validation
 */
export class ValidationService{

   /**
   * Get Id of given validation process name
   * @param name Process's name
   */
    async getProcessId(name: string, transactionHandler: TrxHandler): Promise<string> {
      return transactionHandler
        .query<string>(
          sql`
          SELECT id 
          FROM item_validation_process
          WHERE name = ${name}
        `,
        )
        .then(({ rows }) => rows[0]);
    }

  /**
   * Create an entry for the automatic validation process in DB
   * @param itemId id of the item being validated
   * @param processId id of the validation process
   */
    async createAutomaticValidationRecord(itemId: string, processId: string, transactionHandler: TrxHandler): Promise<ItemValidation> {
      return transactionHandler
        .query<ItemValidation>(
          sql`
          INSERT INTO item_validation (item_id, process_id)
          VALUES (
            ${itemId}, ${processId}
          )
        `,
        )
        .then(({ rows }) => rows[0]);
    }

  /**
   * Update an entry for the automatic validation process in DB
   * @param itemId id of the item being validated
   * @param processId id of the validation process
   */
   async updateAutomaticValidationRecord(itemValidationEntry: ItemValidation, transactionHandler: TrxHandler): Promise<ItemValidation> {
    const { id, status: processStatus, result } = itemValidationEntry;
    return transactionHandler
      .query<ItemValidation>(
        sql`
        UPDATE item_validation 
        SET status = ${processStatus}
            result = ${result}
            update_at = CURRENT_TIMESTAMP
        WHERE id = ${id}
      `,
      )
      .then(({ rows }) => rows[0]);
  }
}

