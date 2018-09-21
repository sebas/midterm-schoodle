
exports.up = function(knex, Promise) {
  return knex.schema.createTable('events', function (table) {
    table.increments();
    table.string('title');
    table.string('place');
    table.string('note');
    table.string('organizer_name');
    table.string('organizer_email');
    table.string('super_secret_URL').index();
  });  
};

exports.down = function(knex, Promise) {
  return knex.schema.dropTable('events');  
};
