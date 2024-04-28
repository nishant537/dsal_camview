# Naming convention to be followed for SQL 

- *TABLE NAMING* - If you’re naming entities that represent real-world facts, you should use nouns. These are tables like employee, customer, city, and country. If possible, use a single word that exactly describes what is in the table. On the example of our 4 tables, it’s more than clear what data can be found in these tables.
- *TABLE NAMING* - If there is a need to use more than 1 word to describe what is in the table – do it so. In our database, one such example would be the call_outcome table. We can’t use only "call", because we already have the table call in the database. On the other hand, using the word outcome wouldn’t clearly describe what is in the table, so using the call_outcome as the table name seems like a good choice.
- *A primary key column* - You should usually have only 1 column serving as a primary key. It would be the best to simply name this column "id".
- *Foreign key columns* - Since they store values from the range of primary key of the referenced table, you should use that table name and “id”, e.g. customer_id.
- *Data columns* - For naming column use a singular word to describe the case, for eg: In employee table, a column for name can be named as "name".
- *Dates* - For dates, it’s good to describe what the date represents. Names like start_date and end_date are pretty descriptive. If you want, you can describe them even more precise, using names like call_start_date and call_end_dat
- *Flags* - We could have flags marking if some action took place or not. We could use names like is_active, is_deleted
