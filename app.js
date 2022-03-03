const express = require('express');
const bodyParser = require('body-parser');
const { graphqlHTTP } = require('express-graphql');
const { buildSchema } = require('graphql');

const app = express();
const PORT = process.env.PORT || 3000;

//temp before database creation
const events =[]

app.use(bodyParser.json());

app.use('/graphql', graphqlHTTP({
    // the first ! is so it cant return an array of null values and the second ! is so that the field itself cannot be null
    schema: buildSchema(`
        type Event {
            _id: ID!
            title: String!
            description: String!
            price: Float!
            date: String!
        }

        input EventInput {
            title: String!
            description: String!
            price: Float!
            date: String!
        }

        type RootQuery{
            events: [Event!]! 
        }

        type RootMutation{
            createEvent(eventInput: EventInput): Event
        }

        schema {
            query: RootQuery
            mutation: RootMutation
        }
    `),
    rootValue: {
        events: () => {
            return events
        },
        createEvent: (args) => {
           const event = {
               _id: Math.random().toString(), //temp until database is created to generate one
               title: args.eventInput.title,
               description: args.eventInput.description,
               price: +args.eventInput.price, //+ makes sure the price arg is converted to a float 
               date: args.eventInput.date
           };
           events.push(event);
           return event;
        }
    },
    graphiql: true
})
);

app.listen(PORT, () => console.log(`Now Listening on port ${PORT}`));