import {Field, ObjectType, InputType} from 'type-graphql';

@ObjectType()
export class Book {
    @Field()
    id!: number
    @Field()
    bookName!: string
    @Field()
    author!: string
}

@InputType()
export class bookInput implements Pick<Book, 'bookName' | 'author'> {
    @Field()
    bookName!: string
    @Field()
    author!: string
}