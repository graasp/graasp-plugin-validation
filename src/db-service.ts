// global
import { Item } from 'graasp';
import { sql, DatabaseTransactionConnectionType as TrxHandler } from 'slonik';

/**
 * Database's first layer of abstraction for content validation
 */
export class ValidationService{
  private static allColumns = sql.join(
    [
      'id',
      'name',
      'description',
      'type',
      'path',
      'extra',
      'settings',
      'creator',
      ['created_at', 'createdAt'],
      ['updated_at', 'updatedAt'],
    ].map((c) =>
      !Array.isArray(c)
        ? sql.identifier([c])
        : sql.join(
            c.map((cwa) => sql.identifier([cwa])),
            sql` AS `,
          ),
    ),
    sql`, `,
  );

  /**
  * @param {string} itemId - containing item's id
  * @return item matching id or null
  */
  async getItem(itemId: string, transactionHandler: TrxHandler): Promise<Item> {
    return (
      transactionHandler
        .query<Item>(
          sql`
          SELECT ${ValidationService.allColumns}
          FROM item
          WHERE id = ${itemId}
        `,
        )
        .then(({ rows }) => rows[0] || null)
    );
  }
}

