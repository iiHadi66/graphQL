import { buildSchema } from 'graphql';
import { graphqlHTTP } from 'express-graphql';
import express from 'express';

// vi hård kodar vår data
export const books = [
    { id: 1, bookName: 'Svartfågel', author: 'Frida Skybäck'},
    { id: 2, bookName: 'En Annan Tid', author: 'Lee Child'},
    { id: 3, bookName: 'Dödens Dagbok', author: 'Chris Carter'},
    { id: 4, bookName: 'Vänner In I Döden', author: 'Elisabeth Andersson'},
    { id: 5, bookName: 'Detaljerna', author: 'La Genberg'},
    { id: 6, bookName: 'Det andra arvet', author: 'Malin Sanglert'},
];

// vi skapar vår schema
const schema = buildSchema(`
    type Query {
        getBook(id: Int!): Book
        getBooks: [Book]
    }

    type Book {
        id: Int!
        bookName: String!
        author: String!
    }

    input BookInput {
        bookName: String!
        author: String!
    }
    
    type Mutation {
        createBook(input: BookInput): Book
        updateBook(id: Int!, input: BookInput): Book
    }
`);
//-------------------//

type Book = {
 id: number;
 bookName: string;
 author: string;
}

type BookInput = 
    Pick<Book, 'bookName' | 'author'>

//-----------------//
// Resolver//

const getBook = (args: { id: number }): Book | undefined => 
    books.find(book => book.id === args.id)

const getBooks = (): Book[] => books;

const createBook = (args: { input: BookInput}): Book => {
    const book = {
        id: books.length + 1,
        ...args.input,
    }
    books.push(book);
    return book;
}

const updateBook = (args: { book: Book}): Book => {
    const index = books.findIndex(book => book.id === args.book.id);
    const targetBook = books[index];

    if (targetBook) books[index] = args.book;

    return targetBook;
}

const root = {
    getBook,
    getBooks,
    createBook,
    updateBook,
}
//-----------------//

//server

const app = express();

app.use(
    '/graphql',
    graphqlHTTP({
        schema,
        rootValue: root,
        graphiql: true,
    })
)

const PORT = 9000;
app.listen(PORT)
console.log(`Running at http://localhost:${PORT}/graphql`);