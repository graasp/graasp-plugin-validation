import { sql, DatabaseTransactionConnection as TrxHandler } from 'slonik';
import { ItemValidationReviewStatuses } from './constants';
import {
  FullValidationRecord,
  ItemValidation,
  ItemValidationProcess,
  ItemValidationReview,
  ItemValidationAndReview,
  ItemValidationStatus,
  ItemValidationReviewStatus,
} from './types';
/**
 * Database's first layer of abstraction for content validation
 */
export class ItemValidationService {
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
      [['ivr', 'updated_at'], ['reviewUpdatedAt']],
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
  async getEnabledProcesses(transactionHandler: TrxHandler): Promise<ItemValidationProcess[]> {
    return transactionHandler
      .query<ItemValidationProcess>(
        sql`
        SELECT * 
        FROM item_validation_process
        WHERE enabled = TRUE
      `,
      )
      .then(({ rows }) => rows.slice());
  }

  // get status list to convert status-id to status
  async getItemValidationStatuses(transactionHandler: TrxHandler): Promise<ItemValidationStatus[]> {
    return transactionHandler
      .query<ItemValidationStatus>(
        sql`
        SELECT * FROM item_validation_status
      `,
      )
      .then(({ rows }) => rows.slice());
  }

  async getItemValidationReviewStatuses(transactionHandler: TrxHandler): Promise<ItemValidationReviewStatus[]> {
    return transactionHandler
      .query<ItemValidationReviewStatus>(
        sql`
        SELECT * FROM item_validation_review_status
      `,
      )
      .then(({ rows }) => rows.slice());
  }

  // get status-id with given status name
  async getValidationReviewStatusId(name: string, transactionHandler: TrxHandler): Promise<string> {
    return transactionHandler
      .query<{ id: string }>(
        sql`
        SELECT id FROM item_validation_review_status
        WHERE name = ${name}
      `,
      )
      .then(({ rows }) => rows[0].id);
  }

  async getValidationStatusId(name: string, transactionHandler: TrxHandler): Promise<string> {
    return transactionHandler
      .query<{ id: string }>(
        sql`
        SELECT id FROM item_validation_status
        WHERE name = ${name}
      `,
      )
      .then(({ rows }) => rows[0].id);
  }

  /**
   * Get validation status given itemId
   * @param itemId id of the item being checked
   */
  async getItemValidationAndReviews(
    itemId: string,
    transactionHandler: TrxHandler,
  ): Promise<ItemValidationAndReview[]> {
    return transactionHandler
      .query<ItemValidationAndReview>(
        sql`
        WITH iv AS (SELECT * FROM item_validation 
        WHERE item_id = ${itemId})
        SELECT ${ItemValidationService.columnsForStatus}
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
  async getItemValidationReviews(transactionHandler: TrxHandler): Promise<FullValidationRecord[]> {
    return transactionHandler
      .query<FullValidationRecord>(
        sql`
        SELECT ${ItemValidationService.columnsForValidation}
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
   * Create an entry for the validation attempt in item-validation
   * @param itemId id of the item being validated
   */
  async createItemValidation(
    itemId: string,
    transactionHandler: TrxHandler,
  ): Promise<string> {
    return transactionHandler
      .query<{id: string}>(
        sql`
          INSERT INTO item_validation (item_id)
          VALUES (
            ${itemId}
          )
          RETURNING *
        `,
      )
      .then(({ rows }) => rows[0]?.id);
  }

  /**
   * Create an entry for the automatic validation process in item-validation-group
   * @param itemId id of the item being validated
   * @param item-validation-id
   */
   async createItemValidationGroup(
    itemId: string,
    iVId: string,
    iVPId: string,
    status_id: string,
    transactionHandler: TrxHandler,
  ): Promise<ItemValidation> {
    return transactionHandler
      .query<ItemValidation>(
        sql`
          INSERT INTO item_validation_group (item_id, item_validation_id, item_validation_process_id, status_id)
          VALUES (
            ${itemId}, ${iVId}, ${iVPId}, ${status_id}
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
  async createItemValidationReview(
    validationId: string,
    status_id: string,
    transactionHandler: TrxHandler,
  ): Promise<ItemValidationReview> {
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
   * @param status new status of process, failure or success
   */
  async updateItemValidationGroup(
    id: string,
    status_id: string,
    transactionHandler: TrxHandler,
  ): Promise<ItemValidation> {
    return transactionHandler
      .query<ItemValidation>(
        sql`
        UPDATE item_validation_group 
        SET status_id = ${status_id},
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
  async updateItemValidationReview(
    id: string,
    status_id: string,
    reason: string = '',
    reviewerId: string,
    transactionHandler: TrxHandler,
  ): Promise<ItemValidationReview> {
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
