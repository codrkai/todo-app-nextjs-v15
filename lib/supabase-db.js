/*
    To use supabase as the database, make sure to run:
    npm install @supabase/supabase-js

    Update the .env.local file with your Supabase URL and Service Role Key:
    SUPABASE_URL=your_supabase_url
    SUPABASE_SERVICE_ROLE_KEY=your_supabase_service_role_key
*/

import { createClient } from '@supabase/supabase-js'

export const supabase = createClient(process.env.SUPABASE_URL, process.env.SUPABASE_SERVICE_ROLE_KEY)
