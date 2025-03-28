create table users (
    id serial primary key,
    name VARCHAR(100),
    age INT
);

insert into users (name, age) values
    ('joao', 34),
    ('maria', 28);
