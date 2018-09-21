
exports.up = function(knex, Promise) {
  return knex.schema.createTable('event_options', function (table) {
    table.increments();
    table.integer('event_id').references('events.id');
    table.string('option_text');
  });  
};

exports.down = function(knex, Promise) {
  return knex.schema.dropTable('event_options');  
};
