import asyncio
from enum import Enum
from re import U
from fastapi import FastAPI

import graphene
from graphene import ObjectType, String, Schema, Enum
from neo4j_graphql_py import neo4j_graphql

from starlette_graphene3 import GraphQLApp, make_graphiql_handler


import neo4j
def context(request):
    global driver
    if driver is None:
        driver = neo4j.GraphDatabase.driver("bolt://localhost:7687", auth=("neo4j", "nishant"))

    return {'driver': driver, 'request': request}

driver = neo4j.GraphDatabase.driver("bolt://localhost:7687", auth=("neo4j", "nishant"))
print(driver)
class Query(ObjectType):
    # this defines a Field `hello` in our Schema with a single Argument `name`
    hello = String(
        name=String(default_value="stranger")
        )
    goodbye = String()

    # our Resolver method takes the GraphQL context (root, info) as well as
    # Argument (name) for the Field and returns data for the query Response
    def resolve_hello(root, info,name):
        return f'Hello {name}!'

    def resolve_goodbye(root, info):
        return 'See ya!'


# class FileUploadMutation(graphene.Mutation):
#     class Arguments:
#         file = Upload(required=True)

#     ok = graphene.Boolean()

#     def mutate(self, info, file, **kwargs):
#         return FileUploadMutation(ok=True)


# class Mutation(graphene.ObjectType):
#     upload_file = FileUploadMutation.Field()


# class Subscription(graphene.ObjectType):
#     count = graphene.Int(upto=graphene.Int())

#     async def subscribe_count(root, info, upto=3):
#         for i in range(upto):
#             yield i
#             await asyncio.sleep(1)


app = FastAPI()
schema = graphene.Schema(query=Query)

app.add_route("/", GraphQLApp(schema, on_get=make_graphiql_handler()))  # Graphiql IDE

# app.mount("/", GraphQLApp(schema, on_get=make_playground_handler()))  # Playground IDE
# app.mount("/", GraphQLApp(schema)) # no IDE