# Questions
 
- `.findOne({ userName: updated.userName || '', _id: { $ne: req.params.id } })`
  - Not sure what the $ne is for?
  - found answer: https://docs.mongodb.com/manual/reference/operator/query/
    - Matches all values that are not equal to a specified value.