import { sql, DatabaseTransactionConnection as TrxHandler } from 'slonik';
import { ValidationStatus, ValidationReviewStatus } from './constants';
import { FullValidationRecord, ItemValidation, ItemValidationProcess, ItemValidationReview, ItemValidationStatus, Status } from './types';
/**
 * Database's first layer of abstraction for content validation
 */
export class ValidationService{

  private static columnsForValidation = sql.join(
    [
      [['ivr', 'id'], ['id']],
      [['ivr', 'status_id'], ['reviewStatusId']],
      [['ivr', 'created_at'], ['createdAt']],
      [['iv', 'item_id'], ['itemId']],
      [['iv', 'status_id'], ['validationStatusId']],
      [['iv', 'result'], ['validationResult']],
      [['ivp', 'name'], ['process']],
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
      [['iv', 'status_id'], ['validationStatusId']],
      [['iv', 'result'], ['validationResult']],
      [['iv', 'updated_at'], ['validationUpdatedAt']],
      [['ivr', 'status_id'], ['reviewStatusId']],
      [['ivr', 'reason'], ['reviewResult']],
      [['ivr', 'updated_at'], ['reviewUpdatedAt']]
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
  async getProcessId(name: string, transactionHandler: TrxHandler): Promise<ItemValidationProcess> {
    return transactionHandler
      .query<ItemValidationProcess>(
        sql`
        SELECT * 
        FROM item_validation_process
        WHERE name = ${name}
      `,
      )
      .then(({ rows }) => rows[0]);
  }

  async getValidationStatusId(name: string, transactionHandler: TrxHandler): Promise<string> {
    return transactionHandler
      .query<{id: string}>(
        sql`
        SELECT id FROM item_validation_status
        WHERE name = ${name}
      `,
      )
      .then(({ rows }) => rows[0].id);
  }

  async getAllStatus(transactionHandler: TrxHandler): Promise<Status[]> {
    return transactionHandler
      .query<Status>(
        sql`
        SELECT * FROM item_validation_status
        UNION
        SELECT * FROM item_validation_review_status
      `,
      )
      .then(({ rows }) => rows.slice());
  }

  async getValidationReviewStatusId(name: string, transactionHandler: TrxHandler): Promise<string> {
    return transactionHandler
      .query<{id: string}>(
        sql`
        SELECT id FROM item_validation_review_status
        WHERE name = ${name}
      `,
      )
      .then(({ rows }) => rows[0].id);
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
        ON iv.id = ivr.item_validation_id
      `,
      )
      .then(({ rows }) => rows.slice());
  }

  /**
   * Get all entries need manual review, ordered by created time (oldest first)
   */
   async getValidationReviewEntries(transactionHandler: TrxHandler): Promise<FullValidationRecord[]> {
    return transactionHandler
      .query<FullValidationRecord>(
        sql`
        SELECT ${ValidationService.columnsForValidation}
        FROM item_validation_review AS ivr
        INNER JOIN item_validation AS iv
        ON ivr.item_validation_id = iv.id
        INNER JOIN item_validation_process AS ivp
        ON iv.item_validation_process_id = ivp.id
        ORDER BY ivr.created_at ASC
      `,
      )
      .then(({ rows }) => rows.slice());
  }

  /**
   * Create an entry for the automatic validation process in DB
   * @param itemId id of the item being validated
   * @param processId id of the validation process
   */
    async createItemValidation(itemId: string, processId: string, transactionHandler: TrxHandler): Promise<ItemValidation> {
      const status_id = await this.getValidationStatusId(ValidationStatus.Pending, transactionHandler);
      return transactionHandler
        .query<ItemValidation>(
          sql`
          INSERT INTO item_validation (item_id, item_validation_process_id, status_id)
          VALUES (
            ${itemId}, ${processId}, ${status_id}
          )
          RETURNING *
        `,
        )
        .then(({ rows }) => rows[0]);
    }

  /**
   * Create an entry for manual review in DB
   * @param validationId id of the validation record needs manual review
   */
   async createItemValidationReview(validationId: string, transactionHandler: TrxHandler): Promise<ItemValidationReview> {
    const status_id = await this.getValidationReviewStatusId(ValidationReviewStatus.Pending, transactionHandler);
    return transactionHandler
      .query<ItemValidationReview>(
        sql`        
        INSERT INTO item_validation_review (item_validation_id, status_id)
        VALUES (
          ${validationId}, ${status_id}
        )
        RETURNING *
      `,
      )
      .then(({ rows }) => rows[0]);
  }

  /**
   * Update an entry for the automatic validation process in DB
   * @param itemValidationEntry entry with updated data
   */
   async updateItemValidation(itemValidationEntry: ItemValidation, transactionHandler: TrxHandler): Promise<ItemValidation> {
    const { id, status: processStatus, result } = itemValidationEntry;
    const status_id = await this.getValidationStatusId(processStatus, transactionHandler);
    return transactionHandler
      .query<ItemValidation>(
        sql`
        UPDATE item_validation 
        SET status_id = ${status_id},
            result = ${result},
            updated_at = CURRENT_TIMESTAMP
        WHERE id = ${id}
      `,
      )
      .then(({ rows }) => rows[0]);
  }

  /**
   * Update an entry for the manual validation process in DB
   * @param itemValidationReviewEntry entry with updated data
   */
   async updateItemValidationReview(id: string, status: string = ValidationReviewStatus.Pending, reason: string = '', reviewerId: string, transactionHandler: TrxHandler): Promise<ItemValidationReview> {
    const status_id = await this.getValidationReviewStatusId(status, transactionHandler);
    return transactionHandler
      .query<ItemValidationReview>(
        sql`
        UPDATE item_validation_review
        SET status_id = ${status_id},
            reason = ${reason},
            reviewer_id = ${reviewerId},
            updated_at = CURRENT_TIMESTAMP
        WHERE id = ${id}
        RETURNING *
      `,
      )
      .then(({ rows }) => rows[0]);
  }
}

