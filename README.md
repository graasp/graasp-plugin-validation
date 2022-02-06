# graasp-plugin-validation

# Purpose
The Graasp Explorer is designed to be a platform to share and explore open educational resources. Inappropriate content, such as dirty words, aggressive langauge, hate speech and etc., should be prohibited from publishing.

# Introduction
## Validation Process
There will be different validation processes to check different things. Each validation process will have a record in DB.

### Existing
- Bad Words Detection (JS)
### In progress
- Aggressive and Hate Speech Classification (Python)
- Image Checking

## Status
To avoid any confusion, there are in total 5 distinct status in validation jobs.

**Pending**: The process/review is still in progress.

**Success**: The item is OK to publish.

**Fail**: The item is suspicious, and could not be published at the moment. A failed process will wait for manual review from administrator.

**Accept**: Admin accept the result of validation => The item is problematic and CANNOT be published.

**Reject**: Admin reject the result of validation => The item is OK, and will be published.

# Endpoints
## Existing Ones:
### Start Validation
`/validations/:itemId` - A new validation job will start on given item. Enabled validation processes will start to run on given item. After each process finishes, it will update corresponding record in item-validation with results. If an automatic process fails, it will then create a new entry in item-validation-review.

`/validations/reviews` - Returns all entries in item-validation-review that has a "pending" status. This endpoint is mainly used in admin mode to display all items that need manual review.

`/validations/status/:itemId` - Returns combined results from item-validation-review joined with item-validation that match given itemId. It is used to check the current validation status of a specific item, and can also be used to check previous validation results.

`/validations/review/:id` - Update the record in item-validation-review with given id. This is used when admins set the review results when manually checking the item/item-validations.
