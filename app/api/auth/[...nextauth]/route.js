import NextAuth from "next-auth"
import GithubProvider from "next-auth/providers/github"
import GoogleProvider from "next-auth/providers/google"
import { client, clientdb } from "@/lib/db"

const authOptions = {
    // theme: {
    //     colorScheme: "auto", // "auto" | "dark" | "light"
    //     brandColor: "", // Hex color code
    //     logo: "", // Absolute URL to image
    //     buttonText: "" // Hex color code
    // },
    secret: process.env.NEXTAUTH_SECRET,
    callbacks: {
        async session({session}) {
            // lookup user from db
            try {
                await client.connect()
                const db = client.db(clientdb.name)
                const user = db.collection(clientdb.users)
                const data = await user.findOne({email: session.user.email})
                if (data) {
                    session.user.id = data.user_id
                } else {
                    // insert into db if email does not exist
                    const newUser = {
                        email: session.user.email
                    }
                    const insertUser = await user.insertOne(newUser)
                    if (insertUser.acknowledged) {
                        session.user.id = insertUser.insertedId
                    }
                    else {
                        console.log('Insert user failed')
                    }
                }
            } catch (error) {
                console.log(error)
            } finally {
                await client.close()
            }

            // SUPABASE Lookup
            /*
            try {
                const { data, error } = await supabase.from('users').select('*').eq('email',session.user.email)
                // insert into db if email does not exist
                if (data.length < 1) {
                    const { data, error } = await supabase.from('users').insert({email: session.user.email}).select()
                    const user = data[0]
                    session.user.id = user.id
                } else {
                    const user = data[0]
                    session.user.id = user.id
                    if (error) {
                        console.log(error)
                    }
                }
            } catch (error) {
                console.log(error)
            }
            */
            
            return session
        }
    },
    providers: [
        GithubProvider({
            clientId: process.env.GITHUB_ID,
            clientSecret: process.env.GITHUB_SECRET,
        }),
        
        GoogleProvider({
            clientId: process.env.GOOGLE_CLIENT_ID,
            clientSecret: process.env.GOOGLE_CLIENT_SECRET,
        })
    ],
}

const handler = NextAuth(authOptions)

export { handler as GET, handler as POST }
