
const secretURL = require('./util/url-helper')();

module.exports = function makeDataHelpers(db) {
  return {
    savePoll: function( knex, newPoll, callback) {
      // Insert Event into Events table
      const { event_name, event_location, event_note } = newPoll.event_details;
      const { name, email } = newPoll.organizer_details;
      knex('events')
      .returning('id')
      .insert({
        title: event_name,
        place: event_location,
        note: event_note,
        organizer_name: name,
        organizer_email: email,
        super_secret_URL: secretURL
      })
      .then((id) => {
        // Insert each Options into Event_Options table using event ID
        const options = Object.values(newPoll.event_options);
        options.forEach((option,index) => {
          knex('event_options').insert({
            event_id: id[0],
            option_text: option 
          })
          .then(res => console.log(res));
        })
      })
  },
  // FROM events JOIN event_options ON events.id = event_options.event_id LEFT JOIN participants ON event_options.id=participants.event_option_id WHERE super_secret_URL=query;
    getPoll: function(knex, super_secret_URL, callback) {
      knex()
        .select([
          'events.id AS event_id',
          'events.title',
          'events.place',
          'events.note',
          'events.organizer_name',
          'events.organizer_email',
          'event_options.id AS event_option_id',
          'event_options.option_text'
        ])
        .from('events')
        .innerJoin('event_options', 'events.id', 'event_options.event_id')
        .where({ super_secret_URL })
      .then(result => callback(result))
    }

  };
};
