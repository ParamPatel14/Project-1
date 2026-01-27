import httpx
import asyncio

async def check_google():
    url = "https://accounts.google.com/.well-known/openid-configuration"
    print(f"Attempting to fetch {url}...")
    try:
        async with httpx.AsyncClient() as client:
            resp = await client.get(url, timeout=10.0)
            print(f"Status: {resp.status_code}")
            print("Content preview:", resp.text[:100])
    except Exception as e:
        print(f"Error: {e}")

if __name__ == "__main__":
    asyncio.run(check_google())
