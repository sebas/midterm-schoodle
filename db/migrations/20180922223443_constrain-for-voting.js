// ALTER TABLE participants ADD CONSTRAINT no_double_votes UNIQUE (event_id, email);

exports.up = function(knex, Promise) {
  return knex.schema.alterTable('participants', function(table) {
    table.unique(['event_id', 'email'],'no_double_votes')
  }); 
}; 

exports.down = function(knex, Promise) {
  return knex.schema.alterTable('participants', function(table) {
    table.dropUnique(['event_id', 'email'],'no_double_votes')
  }); 
};
