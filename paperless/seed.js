// RUN: npx tsx seed.js

import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';

dotenv.config({ path: '.env.local' });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !supabaseServiceKey) {
  console.error("Missing Supabase URL or Service Role Key");
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseServiceKey, {
  auth: { autoRefreshToken: false, persistSession: false }
});

async function seedDatabase() {
  console.log("🌱 Starting database seed...");

  // --- DUMMY USERS ---
  const usersToCreate = [
    { email: "alex.dev@demo.com", password: "qwerty12345", name: "Alex (Demo User)", interests: ["React", "System Design", "UI/UX"] },
    { email: "sarah.dev@demo.com", password: "qwerty12345", name: "Sarah Jenkins", interests: ["Backend", "PostgreSQL", "Security"] },
    { email: "mike.design@demo.com", password: "qwerty12345", name: "Mike Ross", interests: ["CSS", "Design Systems", "Animation"] }
  ];

  const authUsers = [];

  for (const u of usersToCreate) {
    // create the Auth User
    const { data: authData, error: authError } = await supabase.auth.admin.createUser({
      email: u.email,
      password: u.password,
      email_confirm: true,
    });

    if (authError) {
      console.log(`User ${u.email} might already exist. Skipping auth creation.`);
      continue;
    }

    const userId = authData.user.id;
    authUsers.push(userId);

    // update their public profile
    await supabase.from('profiles').upsert({
      id: userId,
      full_name: u.name,
      interests: u.interests,
      avatar_url: `https://api.dicebear.com/9.x/avataaars/svg?seed=${u.name.replace(' ', '')}`
    });

    console.log(`✅ Created user: ${u.name}`);
  }

  // ensure we have users to work with
  if (authUsers.length < 3) {
    console.error("Need at least 3 users to run this script cleanly. Clear your auth table and try again.");
    return;
  }

  const [alexId, sarahId, mikeId] = authUsers;

  // --- CREATE FOLDERS ---
  const { data: folders } = await supabase.from('folders').insert([
    { user_id: alexId, name: "Frontend Mastery", public: true, folder_type: "personal" },
    { user_id: alexId, name: "Private Journal", public: false, folder_type: "personal" },
    { user_id: sarahId, name: "Database Internals", public: true, folder_type: "personal" }
  ]).select();
  
  console.log("✅ Created folders");

  // --- CREATE RICH MARKDOWN NOTES ---
  const markdownNote1 = `
## The Paradigm Shift of React Server Components (RSC)

React Server Components represent one of the biggest architectural shifts in the React ecosystem since Hooks. But why do we need them?

### The Problem with Client-Side Rendering
Historically, SPA (Single Page Applications) downloaded a massive JavaScript bundle before the user could see anything meaningful. 

* **High Time to Interactive (TTI)**
* **Poor SEO**
* **Waterfall network requests**

### Enter Server Components
With Next.js App Router, components default to the server. They render on the backend, send secure HTML/CSS to the client, and *leave the heavy JavaScript behind*.

\`\`\`tsx
// This runs purely on the server!
import db from '@/lib/db';

export default async function UserProfile({ id }) {
  const user = await db.query('SELECT * FROM users WHERE id = $1', [id]);
  
  return (
    <div className="card">
      <h1>{user.name}</h1>
      <p>No extra client bundle size added!</p>
    </div>
  );
}
\`\`\`

### Key Takeaways
1. **Security:** You can safely query databases directly in components.
2. **Performance:** Zero impact on the client bundle size.
3. **SEO:** Fully rendered HTML is sent to the crawler immediately.
`;

  const markdownNote2 = `
## Understanding Rate Limiting in System Design

When building public-facing APIs, protecting your servers from abuse (DDoS attacks, brute force, or just aggressive scraping) is critical. 

### Common Algorithms

#### 1. Token Bucket
Imagine a bucket filled with tokens. Every request removes a token. If the bucket is empty, the request is dropped. The bucket refills at a constant rate.
* **Pros:** Allows for sudden bursts of traffic.
* **Cons:** Harder to implement perfectly in distributed systems.

#### 2. Fixed Window Counter
We track requests in a specific time window (e.g., 1:00 PM to 1:01 PM). If the counter exceeds the limit, block requests until the next minute.
* **Pros:** Memory efficient.
* **Cons:** The "Edge Case Spike" - a user can send 100 requests at 1:00:59 and 100 requests at 1:01:00, effectively bypassing the per-minute limit.

### Redis Implementation Example
Using Redis is the industry standard for distributed rate limiting due to its blistering fast in-memory operations and atomic \`INCR\` commands.

> "A well-designed rate limiter should fail open. If the Redis cache goes down, allow the traffic through rather than breaking the entire application for legitimate users."
`;

  const markdownNote3 = `
## CSS Grid vs Flexbox: When to use what?

A debate as old as modern CSS. Here is the ultimate mental model to end the confusion.

### Flexbox is 1-Dimensional
If you are laying out items in a **row** OR a **column**, use Flexbox. It excels at distributing space along a single axis.

* Navbars
* Centering a div
* Aligning icons next to text

### Grid is 2-Dimensional
If you need to control layout across both rows AND columns simultaneously, use Grid.

\`\`\`css
.dashboard-layout {
  display: grid;
  grid-template-columns: 250px 1fr;
  grid-template-rows: 60px 1fr;
  gap: 1rem;
}
\`\`\`

Stop using flexbox to build complex dashboard layouts by nesting 14 different flex containers! Embrace the grid.
`;

  const { data: notes } = await supabase.from('notes').insert([
    { 
      user_id: alexId, 
      folder_id: folders[0].id, 
      title: "React Server Components Explained", 
      content: markdownNote1, 
      public: true, 
      tags: ["react", "nextjs", "architecture"],
      summary: "An overview of why React Server Components solve the bundle size problem and improve SEO by rendering heavy logic on the backend."
    },
    { 
      user_id: sarahId, 
      folder_id: folders[2].id, 
      title: "System Design: Rate Limiting", 
      content: markdownNote2, 
      public: true, 
      tags: ["backend", "system design", "redis"],
      summary: "A breakdown of common rate-limiting algorithms like Token Bucket and Fixed Window, and why Redis is the standard choice for distributed systems."
    },
    { 
      user_id: mikeId, 
      title: "Grid vs Flexbox Rules", 
      content: markdownNote3, 
      public: true, 
      tags: ["css", "frontend", "design"],
      summary: "A simple mental model for choosing between CSS Grid and Flexbox based on 1-dimensional vs 2-dimensional layout needs."
    }
  ]).select();

  console.log("✅ Created rich markdown notes");

  // --- CREATE SAVES/BOOKMARKS ---
  // Demo user saves Sarah and Mike's notes
  await supabase.from('user_saves').insert([
    { user_id: alexId, note_id: notes[1].id },
    { user_id: alexId, note_id: notes[2].id },
    { user_id: sarahId, note_id: notes[0].id }
  ]);

  console.log("✅ Created bookmarks/saves");
  console.log("🎉 Database successfully seeded!");
  console.log("\n🔑 YOU CAN NOW LOG IN WITH:");
  console.log("Email: portfolio@demo.com");
  console.log("Password: Password123!");
}

seedDatabase().catch(console.error);