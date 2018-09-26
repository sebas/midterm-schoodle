
const super_secret_URL = require('./util/url-helper');

module.exports = function makeDataHelpers(knex) {
  return {
    savePoll: function (newPoll, callback) {
      // Insert Event into Events table
      const { event_name, event_location, event_note } = newPoll.event_details;
      const { name, email } = newPoll.organizer_details;
      knex('events')
        .returning(['id','super_secret_URL'])
        .insert({
          title: event_name,
          place: event_location,
          note: event_note,
          organizer_name: name,
          organizer_email: email,
          super_secret_URL: super_secret_URL()
        })
        .then(([{id, super_secret_URL}]) => {
          // Insert each Options into Event_Options table using event ID
          const options = Object.values(newPoll.event_options);
          options.map((option) => {
            knex('event_options')
              .returning('id AS event_option_id')
              .insert({
                event_id: id,
                option_text: option
              }).then((res)=>(console.log(res)))
          });
          callback(id, super_secret_URL)
        })
    },

    // FROM events JOIN event_options ON events.id = event_options.event_id LEFT JOIN participants ON event_options.id=participants.event_option_id WHERE super_secret_URL=query;
    getPoll: function (super_secret_URL, callback) {
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
    },

    getPollOptions: function (event_id, callback) {
      knex('event_options')
        .select('*')
        .where({ event_id })
        .then(result =>
          callback(result))
    },

    saveVote: function (newVote, callback){
     // console.log("The fields are ", newVote.event_id, newVote.event_option_id, newVote.organizer_name,newVote.organizer_email);
     // INSERT INTO table_name(column_list) VALUES(value_list) ON CONFLICT no_double_votes DO UPDATE ...
     const { event_id, event_option_id, username, email } = newVote;
     knex.raw('INSERT INTO participants ("event_id", "event_option_id", "username", "email") VALUES (?, ?, ?, ?) ON CONFLICT ON CONSTRAINT no_double_votes DO UPDATE SET event_option_id = ? , username = ?', [event_id, event_option_id, username, email, event_option_id, username])
     .then((res)=>{
        callback(res);
      })
    },

    getParticipantsForOption: function(event_option_id, callback) {
      knex("participants")
        .select('*')
        .where({ event_option_id })
        .then((res)=>{
          callback(res);
        })
    },

    getVotesSum: function(event_id, callback) {
      knex("participants")
        .select('*')
        .where({ event_id })
        .then((res)=>{
          callback(res);
        })
    }

  };
};
