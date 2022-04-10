import { sql, DatabaseTransactionConnection as TrxHandler } from 'slonik';
import {
  FullValidationRecord,
  ItemValidationProcess,
  ItemValidationReview,
  ItemValidationAndReview,
  ItemValidationStatus,
  ItemValidationReviewStatus,
  ItemValidationGroup,
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
      [['iv', 'id'], ['itemValidationId']],
      [['iv', 'item_id'], ['itemId']],
    ].map((c) =>
      sql.join(
        c.map((cwa) => sql.identifier(cwa)),
        sql` AS `,
      ),
    ),
    sql`, `,
  );

  private static columnsForState = sql.join(
    [
      [['iv', 'id'], ['itemValidationId']],
      [['ivr', 'status_id'], ['reviewStatusId']],
      [['ivr', 'reason'], ['reviewReason']],
      [['iv', 'created_at'], ['createdAt']],
    ].map((c) =>
      sql.join(
        c.map((cwa) => sql.identifier(cwa)),
        sql` AS `,
      ),
    ),
    sql`, `,
  );

  private static columnsForIVG = sql.join(
    [
      [['id'], ['id']],
      [['item_id'], ['itemId']],
      [['item_validation_id'], ['itemValidationId']],
      [['item_validation_process_id'], ['processId']],
      [['status_id'], ['statusId']],
      [['result'], ['result']],
    ].map((c) =>
      sql.join(
        c.map((cwa) => sql.identifier(cwa)),
        sql` AS `,
      ),
    ),
    sql`, `,
  );

  /**
   * Get a list of all enabled processes
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

  async getItemValidationReviewStatuses(
    transactionHandler: TrxHandler,
  ): Promise<ItemValidationReviewStatus[]> {
    return transactionHandler
      .query<ItemValidationReviewStatus>(
        sql`
        SELECT * FROM item_validation_review_status
      `,
      )
      .then(({ rows }) => rows.slice());
  }

  /**
   * Get validation state of given item
   * Only return the latest iV entry joined with iVR
   * @param {string} itemId id of the item being checked
   */
  async getLastItemValidationAndReviews(
    itemId: string,
    transactionHandler: TrxHandler,
  ): Promise<ItemValidationAndReview> {
    return transactionHandler
      .query<ItemValidationAndReview>(
        sql`
        WITH iv AS (SELECT * FROM item_validation 
        WHERE item_id = ${itemId})
        SELECT ${ItemValidationService.columnsForState}
        FROM iv
        LEFT JOIN item_validation_review AS ivr
        ON iv.id = ivr.item_validation_id
        ORDER BY iv.created_at DESC
        LIMIT 1
      `,
      )
      .then(({ rows }) => rows[0]);
  }

  /**
   * Get item validation groups of given iVId
   * @param {string} iVId id of the item being checked
   */
  async getItemValidationGroups(
    iVId: string,
    transactionHandler: TrxHandler,
  ): Promise<ItemValidationGroup[]> {
    return transactionHandler
      .query<ItemValidationGroup>(
        sql`
        SELECT ${ItemValidationService.columnsForIVG}
        FROM item_validation_group
        WHERE item_validation_id = ${iVId}
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
        ORDER BY ivr.created_at ASC
      `,
      )
      .then(({ rows }) => rows.slice());
  }

  /**
   * Create an entry for the validation attempt in item-validation
   * @param {string} itemId id of the item being validated
   */
  async createItemValidation(itemId: string, transactionHandler: TrxHandler): Promise<string> {
    return transactionHandler
      .query<{ id: string }>(
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
   * @param {string} itemId id of the item being validated
   * @param {string} iVId id of the entry in item-validation
   * @param {string} iVPId id of the item-validation-process
   * @param {string} statusId id of the status in item-validation-status
   */
  async createItemValidationGroup(
    itemId: string,
    iVId: string,
    iVPId: string,
    statusId: string,
    transactionHandler: TrxHandler,
  ): Promise<ItemValidationGroup> {
    return transactionHandler
      .query<ItemValidationGroup>(
        sql`
          INSERT INTO item_validation_group (item_id, item_validation_id, item_validation_process_id, status_id)
          VALUES (
            ${itemId}, ${iVId}, ${iVPId}, ${statusId}
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
    statusId: string,
    transactionHandler: TrxHandler,
  ): Promise<ItemValidationReview> {
    return transactionHandler
      .query<ItemValidationReview>(
        sql`        
        INSERT INTO item_validation_review (item_validation_id, status_id)
        VALUES (
          ${validationId}, ${statusId}
        )
        RETURNING *
      `,
      )
      .then(({ rows }) => rows[0]);
  }

  /**
   * Update an entry for the automatic validation process in DB
   * @param {string} statusId new status of process, failure or success
   */
  async updateItemValidationGroup(
    id: string,
    statusId: string,
    transactionHandler: TrxHandler,
  ): Promise<ItemValidationGroup> {
    return transactionHandler
      .query<ItemValidationGroup>(
        sql`
        UPDATE item_validation_group 
        SET status_id = ${statusId},
            updated_at = CURRENT_TIMESTAMP
        WHERE id = ${id}
        RETURNING *
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
    statusId: string,
    reason: string = '',
    reviewerId: string,
    transactionHandler: TrxHandler,
  ): Promise<ItemValidationReview> {
    return transactionHandler
      .query<ItemValidationReview>(
        sql`
        UPDATE item_validation_review
        SET status_id = ${statusId},
            reason = ${reason},
            reviewer_id = ${reviewerId},
            updated_at = CURRENT_TIMESTAMP
        WHERE id = ${id}
        RETURNING *
      `,
      )
      .then(({ rows }) => rows[0]);
  }

  /**
   * Toggle the enabled field of an item validation process
   * @param id process id
   * @param {boolean} value the value for enabled field
   */
  async setEnabledForItemValidationProcess(
    id: string,
    value: boolean,
    transactionHandler: TrxHandler,
  ): Promise<ItemValidationProcess> {
    return transactionHandler
      .query<ItemValidationProcess>(
        sql`
          UPDATE item_validation_process
          SET enabled = ${sql.json(value)}
          WHERE id = ${id}
          RETURNING id, name
        `,
      )
      .then(({ rows }) => rows[0]);
  }
}
