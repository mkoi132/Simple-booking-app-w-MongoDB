## Getting Started

- This application is configured to run in development environment only.
- It is required to have Node and npm pre-installed on the machine so that you can run the app.

- To spin up the application, change working directory to mydbapp/
- Then execute the command `npm init` {this is important as it install all dependancies}
- Once the npm init done, you might optionally run `npm audit` {advisable by npm}
- Finally, execute the command `npm run dev` {This will spin up both express server and application at once}
- Once you notice BOTH terminal response:

  - " ✓ Compiled " and " app listening on port 5000 "
    means that the application is accessible via a web browser
    you MUST hit Ctrl+C to kill the application or it will run on the port forever

- Expressjs app: http://localhost:5000
- Nextjs front-end: http://localhost:3000

{IMPORTANT}: It is rare that the database can't be boot up automatically through "npm run dev"
but just in case please attempt to start it manually.
From the directory mydbapp/
Execute: node src/server/db.js
Then: npm run dev



## Learn More
- This project uses [`next/font`](https://nextjs.org/docs/app/building-your-application/optimizing/fonts) to automatically optimize and load [Geist](https://vercel.com/font).
To learn more about Next.js, take a look at the following resources: [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.

- This project is application layer to the MERN stack app with MongoDB. Ultilise the pre-loaded AirBnB listingsAndReview example dataset provided and hosted by MongoDB. Back-end integration is built with a lightweight Expess.js server.


