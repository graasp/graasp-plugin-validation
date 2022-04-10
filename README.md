# graasp-plugin-validation

# Purpose
The Graasp Explorer is designed to be a platform to share and explore open educational resources. Inappropriate content, such as dirty words, aggressive language, hate speech and etc., should be prohibited from publishing.

# Introduction
## Validation Process
There will be different validation processes to check different aspects. Each validation process will have a record in DB.

### Bad Words Detection 
Depends on two npm packages:  
- [bad-words](https://www.npmjs.com/package/bad-words)  
- [frenchy-badwords-list](https://www.npmjs.com/package/french-badwords-list)
### Image Checking
The image classifier is based on this open-source repo:   
- [NudeNet](https://github.com/notAI-tech/NudeNet )  
  - A pre-trained classifier based on deep learning developed in Python. Also available as a docker image.
  - To spin up the container of classifier, run  
`docker run -it -p 8080:8080 notaitech/nudenet:classifier`  
  - The repo further provides a python package and detector.  
- An alternative choice is another open-source repo:  
[NSFW.js](https://github.com/infinitered/nsfwjs#quick-how-to-use-the-module). Also a pre-trained classifier based on deep learning but developed with JavaScript and tensorflow.js  


### Aggressive and Hate Speech Classification (In progress)


## Status

### Status for item-validation

**Pending**: The process is in progress.

**Success**: The item passes the test, which means the content of the item is judged safe, i.e. DO NOT contain inappropriate language.

**Failure**: The item is suspicious, which means the item might contain inappropriate content. A failed process will wait for manual review from administrator. Any item containing failed process could not be published, until the content is updated or the content is later approved by an administrator.

### Status for item-validation-review

**Pending**: The item-validation record is waiting for manual review.

**Accepted**: The admin accepts the result of the validation, which means that the item is indeed problematic and the publication cannot proceed

**Rejected**: The admin rejects the result of the validation, which means that the The item is valid as if it passed the test. It can, for example, be published without issues.

# Endpoints
## Start Validation
`POST /validations/:itemId` - A new validation job will start on given item. Enabled validation processes will start to run on given item. After each process finishes, it will update the corresponding record in `item-validation` with results. If an automatic process fails, it will then create a new entry in `item-validation-review`.

`GET /validations/reviews` - Returns all entries in `item-validation-review`. This endpoint is mainly used in admin mode to display all items that need manual review.

`GET /validations/status/:itemId` - Returns combined results from `item-validation-review` joined with `item-validation` that match given `itemId`. It is used to check the current validation status of a specific item, and can also be used to check previous validation results.

`POST /validations/review/:id` - Update the record in `item-validation-review` with given `id`. This is used when admins set the review results when manually checking the item and automatic validation results.
