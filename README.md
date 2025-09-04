
### Todo List App

### Built using
 NextJS v15

 MongoDB (default)

 Supabase (optional)
 
 NextAuth
 
 Drag & Drop using react-beautiful-dnd

### Installation

```bash
npm install
npm run dev
```

#### RENAME .env.example TO .env.local
    when deploying to Vercel or AWS, don't upload the .env file, you will need to import environment variables into the Vercel/AWS hosting settings

#### NEXTAUTH_SECRET
    generate a secret key using this command:
    npx auth secret
    or
    openssl rand -base64 32

#### GITHUB/GOOGLE KEYS
    Sign into your Github or Google account and navigate to the Developer Settings
    Get your Client ID and Secret Keys, and set them in the .env file

#### MONGODB IS THE DEFAULT DATABASE
    /lib/db.js
    /lib/actions.js
    /app/api/auth/[...nextauth]/route.js

#### IF YOU WISH TO USE SUPABASE, USE/UPDATE THESE
    /lib/supabase-db.js
    /lib/supabase-actions.js
    /app/api/auth/[...nextauth]/route.js

    Sign into Supabase and get the Database URL and Service Role Key
    Update the .env file

#### SUPABASE TABLES (run using the supabase sql editor):
    CREATE TABLE IF NOT EXISTS users (
        id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
        email TEXT NOT NULL UNIQUE
    )

    CREATE TABLE IF NOT EXISTS items (
        item_id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
        user_id UUID REFERENCES users (id),
        content TEXT
    )

#### next.config.mjs (Allowed domains for images. Update as needed.)
    lh3.googleusercontent.com
    avatars.githubusercontent.com
    www.gravatar.com
    images.unsplash.com

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

### Screenshot
<img src="/public/screenshot.jpg" alt="Todo App Screenshot">

### Demo
https://nextjs-14-todo-app.vercel.app/