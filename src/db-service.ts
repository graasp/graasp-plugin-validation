import { sql, DatabaseTransactionConnection as TrxHandler } from 'slonik';
import { FullValidationRecord, ItemValidation, ItemValidationReview, ItemValidationStatus } from './types';
/**
 * Database's first layer of abstraction for content validation
 */
export class ValidationService{

  private static columnsForValidation = sql.join(
    [
      [['ivr', 'id'], ['id']],
      [['iv', 'item_id'], ['itemId']],
      [['iv', 'result'], ['result']],
      [['ivp', 'name'], ['process']],
      [['ivr', 'create_at'], ['createAt']],
    ].map((c) =>
      sql.join(
        c.map((cwa) => sql.identifier(cwa)),
        sql` AS `,
      ),
    ),
    sql`, `,
  );

  private static columnsForStatus = sql.join(
    [
      [['iv', 'status'], ['automaticStatus']],
      [['ivr', 'status'], ['manualStatus']],
      [['iv', 'result'], ['automaticResult']],
      [['ivr', 'reason'], ['manualResult']],
    ].map((c) =>
      sql.join(
        c.map((cwa) => sql.identifier(cwa)),
        sql` AS `,
      ),
    ),
    sql`, `,
  );

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
   * Get validation status given itemId
   * @param itemId id of the item being checked
   */
   async getValidationStatus(itemId: string, transactionHandler: TrxHandler): Promise<ItemValidationStatus[]> {
    return transactionHandler
      .query<ItemValidationStatus>(
        sql`
        WITH iv AS (SELECT * FROM item_validation 
        WHERE item_id = ${itemId})
        SELECT ${ValidationService.columnsForStatus}
        FROM iv
        LEFT JOIN item_validation_review AS ivr
        ON iv.id = ivr.validation_id
      `,
      )
      .then(({ rows }) => rows.slice());
  }

  /**
   * Get all entries need manual review, ordered by created time (oldest first)
   */
   async getManualReviewEntries(transactionHandler: TrxHandler): Promise<FullValidationRecord[]> {
    return transactionHandler
      .query<FullValidationRecord>(
        sql`
        SELECT ${ValidationService.columnsForValidation}
        FROM item_validation_review AS ivr
        INNER JOIN item_validation AS iv
        ON ivr.validation_id = iv.id
        INNER JOIN item_validation_process AS ivp
        ON iv.process_id = ivp.id
        WHERE ivr.status = 'pending'
        ORDER BY ivr.create_at ASC
      `,
      )
      .then(({ rows }) => rows.slice());
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
   * Create an entry for manual review in DB
   * @param validationId id of the validation record needs manual review
   */
   async createManualReviewRecord(validationId: string, transactionHandler: TrxHandler): Promise<ItemValidationReview> {
    return transactionHandler
      .query<ItemValidationReview>(
        sql`
        INSERT INTO item_validation_review (validation_id)
        VALUES (
          ${validationId}
        )
      `,
      )
      .then(({ rows }) => rows[0]);
  }

  /**
   * Update an entry for the automatic validation process in DB
   * @param itemValidationEntry entry with updated data
   */
   async updateAutomaticValidationRecord(itemValidationEntry: ItemValidation, transactionHandler: TrxHandler): Promise<ItemValidation> {
    const { id, status: processStatus, result } = itemValidationEntry;
    return transactionHandler
      .query<ItemValidation>(
        sql`
        UPDATE item_validation 
        SET status = ${processStatus},
            result = ${result},
            update_at = CURRENT_TIMESTAMP
        WHERE id = ${id}
      `,
      )
      .then(({ rows }) => rows[0]);
  }

  /**
   * Update an entry for the manual validation process in DB
   * @param itemValidationReviewEntry entry with updated data
   */
   async updateManualValidationRecord(id: string, status: string = 'pending', reason: string = '', reviewerId: string, transactionHandler: TrxHandler): Promise<ItemValidationReview> {
    return transactionHandler
      .query<ItemValidationReview>(
        sql`
        UPDATE item_validation _review
        SET status = ${status},
            reason = ${reason},
            reviewer = ${reviewerId},
            update_at = CURRENT_TIMESTAMP
        WHERE id = ${id}
      `,
      )
      .then(({ rows }) => rows[0]);
  }
}

