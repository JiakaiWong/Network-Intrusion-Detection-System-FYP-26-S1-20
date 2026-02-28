import asyncio
from database import client  # import the client

async def list_databases():
    print("Listing all databases:")
    db_names = await client.list_database_names()  # await the coroutine
    for db_name in db_names:
        print(f" - {db_name}")
        db = client[db_name]
        collections = await db.list_collection_names()
        if collections:
            for coll in collections:
                print(f"     collection: {coll}")
                # If it's the users collection, count documents
                if coll == "users":
                    count = await db[coll].count_documents({})
                    print(f"         documents in users: {count}")

asyncio.run(list_databases())