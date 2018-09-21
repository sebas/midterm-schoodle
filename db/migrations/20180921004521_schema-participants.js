exports.up = function(knex, Promise) {
  return knex.schema.createTable('participants', function (table) {
    table.increments();
    table.integer('event_id').references('events.id');
    table.integer('event_option_id').references('event_options.id');
    table.string('username');
    table.string('email');
  });  
};

exports.down = function(knex, Promise) {
  return knex.schema.dropTable('participants');  
};